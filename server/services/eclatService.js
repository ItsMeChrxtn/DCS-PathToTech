/**
 * ECLAT – Equivalence Class Transformation Algorithm
 *
 * Standard ECLAT using a vertical database (item → tidset).
 * Each student is one "transaction" whose items are categorical
 * labels derived from their four component scores and final
 * employability score.
 *
 * After mining frequent itemsets (DFS + tidset intersection),
 * association rules are generated and filtered so the consequent
 * is always an employability outcome item, making the rules
 * directly interpretable as "if a student has X → likely Y".
 */

// ─── Itemisation ─────────────────────────────────────────────────────────────

/**
 * Convert a student's numeric scores to a list of categorical items.
 * employabilityScore is expected in the range 0–100 (same as stored in DB).
 */
function toItems({ academicScore, skillsScore, certificationScore, softSkillsScore, employabilityScore }) {
  const items = [];

  // ── Academic (weight 30 %) ──────────────────────────────────
  if      (academicScore >= 0.80) items.push('high_academic');
  else if (academicScore >= 0.60) items.push('good_academic');
  else                             items.push('low_academic');

  // ── Technical Skills (weight 25 %) ─────────────────────────
  if      (skillsScore >= 0.80) items.push('expert_skills');
  else if (skillsScore >= 0.60) items.push('good_skills');
  else                           items.push('basic_skills');

  // ── Certifications (weight 20 %) ───────────────────────────
  if      (certificationScore >= 0.60) items.push('many_certs');
  else if (certificationScore >= 0.30) items.push('some_certs');
  else                                  items.push('no_certs');

  // ── Soft Skills (weight 25 %) ──────────────────────────────
  if      (softSkillsScore >= 0.75) items.push('strong_soft_skills');
  else if (softSkillsScore >= 0.50) items.push('good_soft_skills');
  else                               items.push('weak_soft_skills');

  // ── Employability outcome (rule consequent) ────────────────
  // employabilityScore is stored as 0–1 decimal in the DB
  if      (employabilityScore >= 0.70) items.push('highly_employable');
  else if (employabilityScore >= 0.55) items.push('moderately_employable');
  else                                  items.push('low_employability');

  return items;
}

// ─── ECLAT core ───────────────────────────────────────────────────────────────

/** Build vertical database: item → Set<transactionId> */
function buildVerticalDB(transactions) {
  const db = new Map();
  transactions.forEach((items, tid) => {
    items.forEach(item => {
      if (!db.has(item)) db.set(item, new Set());
      db.get(item).add(tid);
    });
  });
  return db;
}

/**
 * Recursive DFS over the search space.
 * prefix    – current itemset prefix (array)
 * items     – Map<item, tidset> of candidates to extend with
 * n         – total number of transactions
 * minSupport – minimum support threshold (0–1)
 * out       – result array (mutated)
 */
function eclatDFS(prefix, items, n, minSupport, out) {
  const entries = [...items.entries()];
  for (let i = 0; i < entries.length; i++) {
    const [item, tidset] = entries[i];
    const support = tidset.size / n;
    if (support < minSupport) continue;

    const itemset = [...prefix, item];
    out.push({ itemset, support: parseFloat(support.toFixed(4)), tidset });

    // Extend: intersect current tidset with each subsequent item's tidset
    const nextItems = new Map();
    for (let j = i + 1; j < entries.length; j++) {
      const [nextItem, nextTidset] = entries[j];
      const intersection = new Set([...tidset].filter(t => nextTidset.has(t)));
      if (intersection.size / n >= minSupport) {
        nextItems.set(nextItem, intersection);
      }
    }

    if (nextItems.size > 0) {
      eclatDFS(itemset, nextItems, n, minSupport, out);
    }
  }
}

/** Mine all frequent itemsets from a list of transactions. */
function mineFrequentItemsets(transactions, minSupport = 0.25) {
  const n = transactions.length;
  if (n === 0) return [];
  const db  = buildVerticalDB(transactions);
  const out = [];
  eclatDFS([], db, n, minSupport, out);
  return out;
}

/**
 * Generate association rules from frequent itemsets.
 * Returns only rules whose confidence >= minConfidence.
 */
function generateRules(frequentItemsets, minConfidence = 0.65) {
  // Build a quick lookup: sorted-itemset JSON → support
  const supportMap = new Map();
  frequentItemsets.forEach(({ itemset, support }) =>
    supportMap.set(JSON.stringify([...itemset].sort()), support)
  );

  const rules = [];

  for (const { itemset, support } of frequentItemsets) {
    if (itemset.length < 2) continue;
    const total = 1 << itemset.length;

    // Enumerate every non-empty proper subset as antecedent
    for (let mask = 1; mask < total - 1; mask++) {
      const ant = [], cons = [];
      for (let b = 0; b < itemset.length; b++) {
        (mask & (1 << b) ? ant : cons).push(itemset[b]);
      }

      const antKey = JSON.stringify([...ant].sort());
      const antSupport = supportMap.get(antKey);
      if (!antSupport) continue;

      const confidence = support / antSupport;
      if (confidence < minConfidence) continue;

      const lift = parseFloat((confidence / support).toFixed(4));
      rules.push({
        antecedent:  ant,
        consequent:  cons,
        support:     parseFloat(support.toFixed(4)),
        confidence:  parseFloat(confidence.toFixed(4)),
        lift,
      });
    }
  }

  return rules;
}

// ─── Public API ───────────────────────────────────────────────────────────────

const OUTCOME_ITEMS = new Set(['highly_employable', 'moderately_employable', 'low_employability']);

/**
 * Mine employability association rules from ALL student predictions in the DB.
 * Returns the top rules whose consequent is an employability outcome.
 */
async function mineEmployabilityRules(minSupport = 0.25, minConfidence = 0.60) {
  const Prediction = require('../models/Prediction');
  const docs = await Prediction.find(
    {},
    { academicScore: 1, skillsScore: 1, certificationScore: 1, softSkillsScore: 1, employabilityScore: 1 }
  ).lean();

  if (docs.length < 3) {
    return { totalTransactions: docs.length, totalFrequentItemsets: 0, rules: [] };
  }

  const transactions = docs.map(p => toItems({
    academicScore:      p.academicScore      || 0,
    skillsScore:        p.skillsScore        || 0,
    certificationScore: p.certificationScore || 0,
    softSkillsScore:    p.softSkillsScore    || 0,
    employabilityScore: p.employabilityScore || 0,
  }));

  const frequent = mineFrequentItemsets(transactions, minSupport);
  const allRules  = generateRules(frequent, minConfidence);

  // Keep only rules predicting an employability outcome
  const filtered = allRules
    .filter(r => r.consequent.some(c => OUTCOME_ITEMS.has(c)))
    .sort((a, b) => b.confidence - a.confidence || b.support - a.support)
    .slice(0, 12);

  return {
    totalTransactions:     docs.length,
    totalFrequentItemsets: frequent.length,
    rules: filtered,
  };
}

/**
 * Find which mined rules match a specific student's profile.
 * Used to personalise the rule output shown to / about a student.
 */
async function applyRulesToStudent(academicScore, skillsScore, certificationScore, softSkillsScore, employabilityScore) {
  const { rules } = await mineEmployabilityRules();
  const studentItems = new Set(toItems({ academicScore, skillsScore, certificationScore, softSkillsScore, employabilityScore }));

  return rules
    .filter(r => r.antecedent.every(item => studentItems.has(item)))
    .map(({ antecedent, consequent, confidence, support, lift }) => ({
      antecedent, consequent, confidence, support, lift,
    }));
}

module.exports = {
  toItems,
  mineFrequentItemsets,
  generateRules,
  mineEmployabilityRules,
  applyRulesToStudent,
};
