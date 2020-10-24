const assert = require('assert');
const { pathloss_rma_los, pathloss_rma_nlos, pathloss_rma, pathloss_uma_los, pathloss_uma_nlos, pathloss_uma, pathloss_umi_los, pathloss_umi_nlos, pathloss_umi, pathloss_inh_los, pathloss_inh_nlos, pathloss_inh, pathloss_inf_los, pathloss_inf_nlos, pathloss_inf, pathloss } = require('./pathloss');
const { pr_los_rma, pr_los_umi, pr_los_uma, pr_los_inh_mixed, pr_los_inh_open, pr_los_inf } = require('./probability_los');

console.log(pathloss_rma_los(2, 100))

// pathloss_rma = (fc, d_2D, h_BS = 35, h_UT = 1.5, W = 20, h = 5)
console.log(pathloss_rma(2, 800, 20, 1.5, 20, 5))
console.log(pathloss_rma_los(2, 800, 20, 1.5, 20, 5))
console.log(pathloss_rma_nlos(2, 800, 20, 1.5, 20, 5))

