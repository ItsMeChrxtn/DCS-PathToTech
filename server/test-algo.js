const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pathtotech').then(async () => {
  const { mineEmployabilityRules } = require('./services/eclatService');
  const { getClusterDistribution } = require('./services/gmmService');

  console.log('\n=== ECLAT Results ===');
  const eclat = await mineEmployabilityRules(0.20, 0.60);
  console.log(`Transactions: ${eclat.totalTransactions}`);
  console.log(`Frequent itemsets found: ${eclat.totalFrequentItemsets}`);
  console.log(`Top rules:`);
  eclat.rules.forEach((r, i) => {
    console.log(`  ${i+1}. IF [${r.antecedent.join(', ')}] THEN [${r.consequent.join(', ')}]`);
    console.log(`     support=${r.support}  confidence=${r.confidence}  lift=${r.lift}`);
  });

  console.log('\n=== GMM Cluster Distribution ===');
  const clusters = await getClusterDistribution();
  clusters.forEach(c => {
    console.log(`  Cluster ${c.clusterId}: ${c.clusterLabel}  → ${c.count} students  (weight=${c.weight}%)`);
    console.log(`    Mean scores: Academic=${c.meanScores[0]}%  Skills=${c.meanScores[1]}%  Certs=${c.meanScores[2]}%  SoftSkills=${c.meanScores[3]}%`);
  });

  mongoose.disconnect();
});
