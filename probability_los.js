const assert = require('assert');

// 7.4.2 LOS probability
const pr_los_rma = d_2d_out => d_2d_out <= 10 ? 1 : Math.exp(-(d_2d_out - 10) / 1000);

const pr_los_umi = d_2d_out => d_2d_out <= 18 ? 1 : 18 / d_2d_out + Math.exp(-1 * d_2d_out / 36) * (1 - 18 / d_2d_out);

const pr_los_uma = (d_2d_out, h_UT) => {
  assert(h_UT <= 23);
  const C_prime = h_UT <= 13 ? 0 : Math.pow((h_UT - 13) / 10, 1.5);
  return d_2d_out <= 18 ? 1 : (18 / d_2d_out + Math.exp(-1 * d_2d_out / 63) * (1 - 18 / d_2d_out)) * (1 + C_prime * 5 / 4 * Math.pow(d_2d_out / 100, 3) * Math.exp(-1 * d_2d_out / 150));
};

const pr_los_inh_mixed = d_2d_in => d_2d_in <= 1.2 ? 1 : d_2d_in < 6.5 ? Math.exp(-1 * (d_2d_in - 1.2) / 4.7) : Math.exp(-1 * (d_2d_in - 6.5) / 32.6) * 0.32;

const pr_los_inh_open = d_2d_in => d_2d_in <= 5 ? 1 : d_2d_in <= 49 ? Math.exp(-1 * (d_2d_in - 5) / 70.8) : Math.exp(-1 * (d_2d_in - 49) / 211.7) * 0.54;

const pr_los_inh = (type, d_2d_in) => type === 'mixed' ? pr_los_inh_mixed(d_2d_in) : pr_los_inh_open(d_2d_in);

const pr_los_inf = (type, d_2d, h_BS = 3, h_UT = 1.5, h_c = 5, r = 0.4) => {
  if (type === 'hh') return 1;
  assert(0 <= hc && h_c <= 10);
  assert((type.toLowerCase() === 'sl' && r < 0.4) || (type.toLowerCase() === 'dl' && r >= 0.4) || (type.toLowerCase() === 'sh' && r < 0.4) || (type.toLowerCase() === 'dh' && r >= 0.4));
  const types = ['sl', 'dl', 'sh', 'dh', 'hh'];
  const d_clutters = [10, 2, 10, 2, null];
  const d_clutter = d_clutters[types.indexOf(type.toLowerCase())];
  const k_sbsce = (type === 'sl' || type === 'dl') ? -1 * d_clutter / Math.log(1 - r) : -1 * d_clutter / Math.log(1 - r) * (h_BS - h_UT) / (h_c - h_UT);
  return Math.exp(-1 * d_2d / k_sbsce);
};

module.exports = {
  pr_los_rma, pr_los_umi, pr_los_uma,
  pr_los_inh_mixed, pr_los_inh_open, pr_los_inh,
  pr_los_inf
};