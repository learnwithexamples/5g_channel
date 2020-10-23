const assert = require('assert');
const { pr_los_rma, pr_los_umi, pr_los_uma, pr_los_inh, pr_los_inf } = require('./probability_los');

// 7.4.1 pathloss
const calc_d_3D = (d_2D_out, d_2D_in, h_BS, h_UT) => Math.sqrt(Math.pow(d_2D_out + d_2D_in, 2) + Math.pow(h_BS - h_UT, 2));

const calc_d_BP = (h_BS, h_UT, fc) => 2 * Math.PI * h_BS * h_UT * fc / 0.3;

const pathloss_rma_los = (fc, d_2D, h = 5, W = 20, h_BS = 35, h_UT = 1.5) => {
  assert(fc >= 0.5 && fc <= 100);
  assert(10 <= d_2D && d_2D <= 10e3);
  assert(5 <= h && h <= 50);
  assert(5 <= W && W <= 50);
  assert(10 <= h_BS && h_BS <= 150);
  assert(1 <= h_UT && h_UT <= 10);

  const d_BP = calc_d_BP(h_BS, h_UT, fc);
  const d_3D = calc_d_3D(d_2D, 0, h_BS, h_UT);

  const calc_PL1 = (fc, d_3D, h) => 20 * Math.log10(40 * Math.PI * d_3D * fc / 3) + Math.min(0.03 * Math.pow(h, 1.72), 10) * Math.log10(d_3D) - Math.min(0.044 * Math.pow(h, 1.72), 14.77) + 0.002 * Math.log10(h) * d_3D;
  return d_2D <= d_BP ? calc_PL1(fc, d_3D, h) : calc_PL1(fc, d_BP, h) + 40 * Math.log10(d_3D / d_BP);
};

const pathloss_rma_nlos = (fc, d_2D, h = 5, W = 20, h_BS = 35, h_UT = 1.5) => {
  assert(fc >= 0.5 && fc <= 100);
  assert(10 <= d_2D && d_2D <= 5e3);
  assert(5 <= h && h <= 50);
  assert(5 <= W && W <= 50);
  assert(10 <= h_BS && h_BS <= 150);
  assert(1 <= h_UT && h_UT <= 10);

  const PL_LOS = pathloss_rma_los(fc, d_2D, h, W, h_BS, h_UT);
  const PL_NLOS = 161.04 - 7.1 * Math.log10(W) + 7.5 * Math.log10(h) - (24.37 - 3.7 * Math.pow(h / h_BS, 2)) * Math.log10(h_BS) + (43.42 - 3.1 * Math.log10(h_BS)) * (Math.log10(calc_d_3D(d_2D, 0, h_BS, h_UT)) - 3) + 20 * Math.log10(fc) - (3.2 * Math.pow(Math.log10(11.75 * h_UT), 2) - 4.97);
  return Math.max(PL_LOS, PL_NLOS);
};

const pathloss_rma = (fc, d_2D, h = 5, W = 20, h_BS = 35, h_UT = 1.5) => {
  const pr = pr_los_rma(d_2D);
  return pathloss_rma_los(fc, d_2D, h, W, h_BS, h_UT) * pr + pathloss_rma_nlos(fc, d_2D, h, W, h_BS, h_UT) * (1 - pr);
};

const pathloss_uma_los = (fc, d_2D, h_BS, h_UT, h_E = 1) => {
  assert(10 <= d_2D && d_2D <= 5000);
  assert(1.5 <= h_UT && h_UT <= 22.5);
  assert(h_BS === 25);

  const h_BS_prime = h_BS - h_E;
  const h_UT_prime = h_UT - h_E;
  assert(h_UT_prime >= 1.5);
  const d_3D = calc_d_3D(d_2D, 0, h_BS, h_UT);
  const d_BP_prime = 4 * h_BS_prime * h_UT_prime * fc / c;
  if (d_2D <= d_BP_prime) {
    return 28.0 + 22 * Math.log10(d_3D) + 20 * Math.log10(fc);
  } else {
    return 28.0 + 40 * Math.log10(d_3D) + 20 * Math.log10(fc) - 9 * Math.log10(Math.pow(d_BP_prime, 2) + Math.pow(h_BS - h_UT, 2));
  }
};
  
const pathloss_uma_nlos = (fc, d_2D, h_BS, h_UT, h_E = 1, option = 0) => {
  assert(1.5 <= h_UT && h_UT <= 22.5);
  assert(h_BS === 25);
  assert(10 <= d_2D && d_2D <= 5000);
  const d_3D = calc_d_3D(d_2D, 0, h_BS, h_UT);
  if (option === 0) {
    const PL = 13.54 + 39.08 * Math.log10(d_3D) + 20 * Math.log10(fc) - 0.6 * (h_UT - 1.5);
    return Math.max(PL, pathloss_uma_los(fc, d_2D, h_BS, h_UT, h_E = 1));
  }
  return 32.4 + 20 * Math.log10(fc) + 30 * Math.log10(d_3D);
};

const pathloss_uma = (fc, d_2D, h_BS, h_UT, h_E = 1, option = 0) => {
  const pr = pr_los_uma(d_2D, h_UT);
  return pathloss_uma_los(fc, d_2D, h_BS, h_UT, h_E) * pr + pathloss_uma_nlos(fc, d_2D, h_BS, h_UT, h_E, option) * (1 - pr);
};

const pathloss_umi_los = (fc, d_2D, h_BS, h_UT) => {
  const d_3D = calc_d_3D(d_2D, 0, h_BS, h_UT);
  assert(10 <= d_2D && d_2D <= 5000);
  assert(1.5 <= h_UT && h_UT <= 22.5);
  assert(h_BS === 10);

  const h_BS_prime = h_BS - h_E;
  const h_UT_prime = h_UT - h_E;
  assert(h_UT_prime >= 1.5);
  const d_BP_prime = 4 * h_BS_prime * h_UT_prime * fc / c;
  if (d_2D <= d_BP_prime) {
    return 32.4 + 21 * Math.log10(d_3D) + 20 * Math.log10(fc);
  }
  return 32.4 + 40 * Math.log10(d_3D) + 20 * Math.log10(fc) - 9.5 * Math.log10(Math.pow(d_BP_prime, 2) + Math.pow(h_BS - h_UT, 2));
};

const pathloss_umi_nlos = (fc, d_2D, h_BS, h_UT, h_E = 1, option = 0) => {
  assert(1.5 <= h_UT && h_UT <= 22.5);
  assert(h_BS === 10);
  assert(10 <= d_2D && d_2D <= 5000);
  const d_3D = calc_d_3D(d_2D, 0, h_BS, h_UT);
  if (option === 0) {
    const PL = 22.4 + 35.3 * Math.log10(d_3D) + 21.3 * Math.log10(fc) - 0.3 * (h_UT - 1.5);
    return Math.max(PL, pathloss_umi_los(fc, d_2D, h_BS, h_UT, h_E = 1));
  }
  return 32.4 + 20 * Math.log10(fc) + 31.9 * Math.log10(d_3D);
};

const pathloss_umi = (fc, d_2D, h_BS, h_UT, h_E = 1, option = 0) => {
  const pr = pr_los_umi(d_2D);
  return pathloss_umi_los(fc, d_2D, h_BS, h_UT) * pr + pathloss_umi_nlos(fc, d_2D, h_BS, h_UT, h_E, option) * (1 - pr);
};

// indoor hotspot
const pathloss_inh_los = (fc, d_3D) => {
  assert(1 <= d_3D && d_3D <= 150);
  return 32.4 + 17.3 * Math.log10(d_3D) + 20 * Math.log10(fc);
};

const pathloss_inh_nlos = (fc, d_3D, option = 0) => {
  assert(1 <= d_3D && d_3D <= 150);
  if (option === 0) {
    const PL = 17.3 + 38.3 * Math.log10(d_3D) + 24.9 * Math.log10(fc);
    return Math.max(PL, pathloss_inh_los(fc, d_3D));
  }
  return 32.4 + 20 * Math.log10(fc) + 31.9 * Math.log10(d_3D);
};

const pathloss_inh = (fc, d_2D_in, h_BS, h_UT, h_E = 1, type = 'mixed', option = 0) => {
  const d_3D = calc_d_3D(0, d_2D_in, h_BS, h_UT);
  const pr = pr_los_inh(type, d_2D_in);
  return pathloss_inh_los(fc, d_3D) * pr + pathloss_inh_nlos(fc, d_3D, option) * (1 - pr);
};

// indoor femto cell
const pathloss_inf_los = (fc, d_3D) => {
  assert(1 <= d_3D && d_3D <= 600);
  return 31.84 + 21.5 * Math.log10(d_3D) + 19 * Math.log10(fc);
};

const pathloss_inf_nlos = (fc, d_3D, type) => {
  assert(1 <= d_3D && d_3D <= 600);
  if (type.toLowerCase() === 'sl') {
    return Math.max(33 + 25.5 * Math.log10(d_3D) + 20 * Math.log10(fc), pathloss_inf_los(fc, d_3D));
  }
  if (type.toLowerCase() === 'dl') {
    const PL_SL = Math.max(33 + 25.5 * Math.log10(d_3D) + 20 * Math.log10(fc), pathloss_inf_los(fc, d_3D));
    return Math.max(18.6 + 35.7 * Math.log10(d_3D) + 20 * Math.log10(fc), pathloss_inf_los(fc, d_3D), PL_SL);
  }
  if (type.toLowerCase() === 'sh') {
    return Math.max(32.4 + 23 * Math.log10(d_3D) + 20 * Math.log10(fc), pathloss_inf_los(fc, d_3D));
  }
  if (type.toLowerCase() === 'dh') {
    return Math.max(33.63 + 21.9 * Math.log10(d_3D) + 20 * Math.log10(fc), pathloss_inf_los(fc, d_3D));
  }
  return null;
};

const pathloss_inf = (fc, d_2D_in, h_BS, h_UT, h_E = 1, h_c, r, type = 'sh') => {
  const d_3D = calc_d_3D(0, d_2D_in, h_BS, h_UT);
  const pr = pr_los_inf(type, d_2d_in, h_c, r, h_BS, h_UT);
  return pathloss_inf_los(fc, d_3D) * pr + pathloss_inf_nlos(fc, d_3D, type) * (1 - pr);
};

// all models
const pathloss = (scenario, los, fc, h_BS, h_UT, W, h, d_2D_out, d_2D_in, type = 'mixed', option = 0, h_c = 1, r = 0.4) => { // los, nlos, auto
  scenario = scenario.toLowerCase();
  los = low.toLowerCase();
  type = type.toLowerCase();
  if (scenario === 'rma') {
    return los === 'los' ? pathloss_rma_los(fc, d_2D, h, W, h_BS, h_UT) : los === 'nlos' ? pathloss_rma_nlos(fc, d_2D, h, W, h_BS, h_UT) : pathloss_rma(fc, d_2D, h, W, h_BS, h_UT);
  }
  if (scenario === 'uma') {
    return los === 'los' ? pathloss_uma_los(fc, d_2D_out, h_BS, h_UT, h_E) : los === 'nlos' ? pathloss_uma_nlos(fc, d_2D_out, h_BS, h_UT, h_E, option) : pathloss_uma(fc, d_2D_out, h_BS, h_UT, h_E, option);
  }
  if (scenario === 'umi') {
    return los === 'los' ? pathloss_umi_los(fc, d_2D, h_BS, h_UT) : los === 'nlos' ? pathloss_umi_nlos(fc, d_2D, h_BS, h_UT, h_E, option) : pathloss_umi(fc, d_2D, h_BS, h_UT, h_E, option); 
  }
  const d_3D = calc_d_3D(d_2D_out, d_2D_in, h_BS, h_UT);
  if (scenario === 'inh') {
    return los === 'los' ? pathloss_inh_los(fc, d_3D) : los === 'nlos' ? pathloss_inh_nlos(fc, d_3D, option) : pathloss_inh(fc, d_2D_in, h_BS, h_UT, h_E, type, option);
  }
  if (scenario === 'inf') {
    return los === 'los' ? pathloss_inf_los(fc, d_3D) : los === 'nlos' ? pathloss_inf_nlos(fc, d_3D, type) : pathloss_inf(fc, d_2D_in, h_BS, h_UT, h_E, h_c, r, type);
  }
  return null;
};

module.exports = {
  calc_d_3D,
  calc_d_BP,
  pathloss_rma_los, pathloss_rma_nlos, pathloss_rma,
  pathloss_uma_los, pathloss_uma_nlos, pathloss_uma,
  pathloss_umi_los, pathloss_umi_nlos, pathloss_umi,
  pathloss_inh_los, pathloss_inh_nlos, pathloss_inh,
  pathloss_inf_los, pathloss_inf_nlos, pathloss_inf,
  pathloss
};
