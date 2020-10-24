# 5g_channel
5G NR channel model: currently only implemented pathloss (7.4.1) and LOS probability (7.4.2)

# Reference
  3GPP TR 38.901 V16: Study on channel model for frequencies from 0.5 to 100 GHz, Chapter 7 Channel model(s) for 0.5-100 GHz

# Usage
  Option 1: import all functions
    `const g5_channel = require('5g-channel');`
    `g5_channel.pathloss.pathloss_rma_los(2, 400); // 2 GHz, 400m distance`
    `g5_channel.prLos.pr_los_rma(400);`

  Option 2: selective import
    `const { pathloss_rma_los } = require('5g-channel/pathloss');`
    `pathloss_rma_los(2, 400)`

# Includes: pathloss and line-of-sight probability for the following scenarios
  ## Rural Macro
    LOS probability: `pr_los_rma(d_2d_out)`
    Pathloss: 
      - LOS: `pathloss_rma_los(fc, d_2D, h_BS, h_UT, W, h)`
      - NLOS: `pathloss_rma_nlos(fc, d_2D, h_BS, h_UT, W, h)`
      - Average: `pathloss_rma(fc, d_2D, h_BS, h_UT, W, h)`

  ## Urban Macro
    LOS probability: `pr_los_uma(d_2d_out, h_UT)`
    Pathloss:
      - LOS: `pathloss_uma_los(fc, d_2D, h_BS, h_UT, h_E)`
      - NLOS: `pathloss_uma_nlos(fc, d_2D, h_BS, h_UT, h_E, option)`
      - Average: `pathloss_uma(fc, d_2D, h_BS, h_UT, h_E, option)`

  ## Urban Micro-streen canyon
    LOS probability: `pr_los_umi(d_2d_out)`
    Pathloss:
      - LOS: `pathloss_umi_los(fc, d_2D, h_BS, h_UT)`
      - NLOS: `pathloss_umi_nlos(fc, d_2D, h_BS, h_UT, option)`
      - Average: `pathloss_umi(fc, d_2D, h_BS, h_UT, option)`

  ## Indoor-office (InH)
    LOS probability:
      - mixed office: `pr_los_inh_mixed(d_2d_in)`
      - open office: LOS probability: `pr_los_inh_open(d_2d_in)`
      - both types: LOS probability: `pr_los_inh(type, d_2d_in)`
    Pathloss:
      - LOS: `pathloss_inh_los(fc, d_3D)`
      - NLOS: `pathloss_inh_nlos(fc, d_3D, option)`
      - Average: `pathloss_inh(fc, d_3D, d_2D, type, option)`

  ## Infoor Factory (InF)
    LOS probability: `pr_los_inf(type, d_2d, h_BS, h_UT, h_c, r)`
    Pathloss:
      - LOS: `pathloss_inf_los(fc, d_3D)`
      - NLOS: `pathloss_inf_nlos(fc, d_3D, type)`
      - Average: `pathloss_inf(fc, d_3D, h_BS, h_UT, h_c, r, type)`

    ### Different types of InF
    a) InF-SL (sparse clutter, low BS)
    b) InF-DL (dense clutter, low BS)
    c) InF-SH (sparse clutter, high BS)
    d) InF-DH (dense clutter, high BS)
    e) InF-HH (high Tx, high Rx)

  ## A top-level pathloss function for all scenarios
    `pathloss(scenario, los, fc, h_BS, h_UT, W, h, d_2D, type, option, h_c, r)`
