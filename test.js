const assert = require('assert');
const { pathloss_rma_los, pathloss_rma_nlos, pathloss_rma, pathloss_uma_los, pathloss_uma_nlos, pathloss_uma, pathloss_umi_los, pathloss_umi_nlos, pathloss_umi, pathloss_inh_los, pathloss_inh_nlos, pathloss_inh, pathloss_inf_los, pathloss_inf_nlos, pathloss_inf, pathloss } = require('./pathloss');
const { pr_los_rma, pr_los_umi, pr_los_uma, pr_los_inh_mixed, pr_los_inh_open, pr_los_inf } = require('./probability_los');

console.log(pathloss_rma_los(2, 100))

// RMa
console.log(pathloss_rma(2, 800, 35, 1.5, 20, 5))
console.log(pathloss_rma_los(2, 800, 35, 1.5, 20, 5))
console.log(pathloss_rma_nlos(2, 800, 35, 1.5, 20, 5))

// UMa
console.log(pathloss_uma(2, 800, 25, 1.5, 1))
console.log(pathloss_uma_los(2, 800, 25, 1.5, 1, 0))
console.log(pathloss_uma_nlos(2, 800, 25, 1.5, 1, 0))

// UMi
console.log(pathloss_umi_los(2, 800, 10, 1.5));
console.log(pathloss_umi_nlos(2, 800, 10, 1.5, 0));
console.log(pathloss_umi(2, 800, 10, 1.5, 0));

// InH
console.log(pathloss_inh_los(2, 80));
console.log(pathloss_inh_nlos(2, 80, 0));
console.log(pathloss_inh(2, 80, 79, 'mixed', 0));
console.log(pathloss_inh(2, 80, 79, 'open', 0));

// InF
console.log(pathloss_inf_los(2, 80));
console.log(pathloss_inf_los(2, 80, 'sl'));
console.log(pathloss_inf_los(2, 80, 'dl'));
console.log(pathloss_inf_los(2, 80, 'sh'));
console.log(pathloss_inf_los(2, 80, 'dh'));
console.log(pathloss_inf_los(2, 80, 'hh'));
console.log(pathloss_inf(2, 80, 3, 1.5, 5, 0.3, 'sl'));
console.log(pathloss_inf(2, 80, 3, 1.5, 5, 0.7, 'dl'));
console.log(pathloss_inf(2, 80, 3, 1.5, 5, 0.3, 'sh'));
console.log(pathloss_inf(2, 80, 3, 1.5, 5, 0.7, 'dh'));
console.log(pathloss_inf(2, 80, 3, 1.5, 5, 0.3, 'hh'));
