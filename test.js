const assert = require('assert');
const { calc_d_3D, calc_d_BP, pathloss_rma_los, pathloss_rma_nlos, pathloss_uma_los, pathloss_uma_nlos, pathloss_umi_los, pathloss_umi_nlos, pathloss_inh_los, pathloss_inh_nlos, pathloss_inf_los, pathloss_inf_nlos, pathloss } = require('./pathloss');
const { pr_los_rma, pr_los_umi, pr_los_uma, pr_los_inh_mixed, pr_los_inh_open, pr_los_inf } = require('./probability_los');

assert(Math.round(calc_d_3D(100, 0, 10, 1.5)) === 100);
assert(Math.round(calc_d_3D(100, 30, 25, 1.5)) === 132);
console.log(pathloss_rma_los(2, 100))
