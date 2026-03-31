/**
 * Gaussian Mixture Model (GMM) – EM Algorithm
 *
 * Features (4D): [academicScore, skillsScore, certificationScore, softSkillsScore]
 * K = 4 clusters (one per employability tier)
 * Uses diagonal covariance matrices (feature independence assumption).
 * Numerically stable via log-space computations (log-sum-exp trick).
 */

const CLUSTER_LABELS = [
  'Needs Enhancement',       // cluster 0 – lowest scores
  'Developing Professional', // cluster 1
  'Career Ready',            // cluster 2
  'High Performer',          // cluster 3 – highest scores
];

// Prior cluster means (used when DB has < K data points)
const PRIOR_MEANS = [
  [0.20, 0.20, 0.10, 0.20],
  [0.45, 0.45, 0.25, 0.45],
  [0.68, 0.65, 0.48, 0.65],
  [0.88, 0.85, 0.72, 0.85],
];

const MIN_VARIANCE = 0.0005; // floor to avoid collapse

// ─── Math helpers ───────────────────────────────────────────────────────────

function diagLogPDF(point, means, variances) {
  let lp = 0;
  for (let d = 0; d < point.length; d++) {
    const diff = point[d] - means[d];
    lp += -0.5 * Math.log(2 * Math.PI * variances[d]) - (diff * diff) / (2 * variances[d]);
  }
  return lp;
}

function logSumExp(arr) {
  const max = Math.max(...arr);
  return max + Math.log(arr.reduce((s, v) => s + Math.exp(v - max), 0));
}

// ─── GMM Model class ─────────────────────────────────────────────────────────

class GMMModel {
  constructor(k = 4, maxIter = 300, tol = 1e-6) {
    this.k = k;
    this.maxIter = maxIter;
    this.tol = tol;
    this.fitted = false;

    // Initialise with priors
    this.weights = Array(k).fill(1 / k);
    this.means = PRIOR_MEANS.map(m => [...m]);
    this.variances = Array(k).fill(null).map(() => Array(4).fill(0.03));
  }

  // E-step: soft-assign each point to clusters
  _eStep(data) {
    return data.map(point => {
      const logProbs = this.weights.map((w, k) =>
        Math.log(w + 1e-300) + diagLogPDF(point, this.means[k], this.variances[k])
      );
      const lse = logSumExp(logProbs);
      return logProbs.map(lp => Math.exp(lp - lse));
    });
  }

  // M-step: update parameters from soft assignments
  _mStep(data, R) {
    const n = data.length;
    const d = data[0].length;

    for (let k = 0; k < this.k; k++) {
      const Nk = R.reduce((s, r) => s + r[k], 0);
      if (Nk < 1e-10) continue;

      this.weights[k] = Nk / n;

      const newMeans = Array(d).fill(0);
      for (let i = 0; i < n; i++)
        for (let dim = 0; dim < d; dim++)
          newMeans[dim] += R[i][k] * data[i][dim];
      this.means[k] = newMeans.map(m => m / Nk);

      const newVars = Array(d).fill(0);
      for (let i = 0; i < n; i++)
        for (let dim = 0; dim < d; dim++) {
          const diff = data[i][dim] - this.means[k][dim];
          newVars[dim] += R[i][k] * diff * diff;
        }
      this.variances[k] = newVars.map(v => Math.max(v / Nk, MIN_VARIANCE));
    }
  }

  _logLikelihood(data) {
    return data.reduce((total, point) => {
      const logProbs = this.weights.map((w, k) =>
        Math.log(w + 1e-300) + diagLogPDF(point, this.means[k], this.variances[k])
      );
      return total + logSumExp(logProbs);
    }, 0);
  }

  /**
   * Fit GMM using the EM algorithm.
   * When data.length < k, only update means from available points.
   */
  fit(data) {
    if (!data || data.length === 0) { this.fitted = true; return; }

    if (data.length < this.k) {
      data.forEach((pt, i) => { this.means[i] = [...pt]; });
      this.fitted = true;
      return;
    }

    let prevLL = -Infinity;
    for (let iter = 0; iter < this.maxIter; iter++) {
      const R = this._eStep(data);
      this._mStep(data, R);
      const ll = this._logLikelihood(data);
      if (Math.abs(ll - prevLL) < this.tol) break;
      prevLL = ll;
    }

    // Re-order clusters by ascending mean total score so cluster 0 = weakest
    const order = [...Array(this.k).keys()].sort(
      (a, b) => this.means[a].reduce((s, v) => s + v, 0) -
                this.means[b].reduce((s, v) => s + v, 0)
    );
    const oldMeans = this.means.map(m => [...m]);
    const oldVars  = this.variances.map(v => [...v]);
    const oldW     = [...this.weights];
    order.forEach((origIdx, newIdx) => {
      this.means[newIdx]     = oldMeans[origIdx];
      this.variances[newIdx] = oldVars[origIdx];
      this.weights[newIdx]   = oldW[origIdx];
    });

    this.fitted = true;
  }

  /** Assign a point to its most likely cluster */
  predict(point) {
    const logProbs = this.weights.map((w, k) =>
      Math.log(w + 1e-300) + diagLogPDF(point, this.means[k], this.variances[k])
    );
    const lse  = logSumExp(logProbs);
    const probs = logProbs.map(lp => Math.exp(lp - lse));
    const best  = probs.indexOf(Math.max(...probs));
    return {
      clusterId:    best,
      clusterLabel: CLUSTER_LABELS[best],
      confidence:   parseFloat(probs[best].toFixed(4)),
      clusterMeanScores: this.means[best].map(m => parseFloat((m * 100).toFixed(1))),
    };
  }
}

// ─── Singleton cache ─────────────────────────────────────────────────────────

let _cachedGMM = null;

const invalidateCache = () => { _cachedGMM = null; };

async function trainGMM() {
  const Prediction = require('../models/Prediction');
  const docs = await Prediction.find(
    {},
    { academicScore: 1, skillsScore: 1, certificationScore: 1, softSkillsScore: 1 }
  ).lean();

  const data = docs.map(p => [
    p.academicScore      || 0,
    p.skillsScore        || 0,
    p.certificationScore || 0,
    p.softSkillsScore    || 0,
  ]);

  const gmm = new GMMModel(4, 300, 1e-6);
  gmm.fit(data);
  _cachedGMM = gmm;
  return gmm;
}

async function getGMM() {
  return _cachedGMM || (await trainGMM());
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Assign a single student's scores to a cluster.
 */
async function assignCluster(academicScore, skillsScore, certificationScore, softSkillsScore) {
  const gmm = await getGMM();
  return gmm.predict([academicScore, skillsScore, certificationScore, softSkillsScore]);
}

/**
 * Return how many students currently fall into each cluster.
 */
async function getClusterDistribution() {
  const Prediction = require('../models/Prediction');
  const docs = await Prediction.find(
    {},
    { academicScore: 1, skillsScore: 1, certificationScore: 1, softSkillsScore: 1 }
  ).lean();

  const gmm = await getGMM();
  const distribution = CLUSTER_LABELS.map((label, id) => ({
    clusterId: id,
    clusterLabel: label,
    count: 0,
    meanScores: gmm.means[id].map(m => parseFloat((m * 100).toFixed(1))),
    weight: parseFloat((gmm.weights[id] * 100).toFixed(1)),
  }));

  docs.forEach(p => {
    const { clusterId } = gmm.predict([
      p.academicScore      || 0,
      p.skillsScore        || 0,
      p.certificationScore || 0,
      p.softSkillsScore    || 0,
    ]);
    distribution[clusterId].count++;
  });

  return distribution;
}

module.exports = { assignCluster, trainGMM, getGMM, invalidateCache, getClusterDistribution, CLUSTER_LABELS };
