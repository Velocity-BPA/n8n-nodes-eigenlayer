/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const HOLESKY_ADDRESSES = {
  // Core Protocol Contracts
  DelegationManager: '0xA44151489861Fe9e3055d95adC98FbD462B948e7',
  StrategyManager: '0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6',
  EigenPodManager: '0x30770d7E3e71112d7A6b7259542D1f680a70e315',
  AVSDirectory: '0x055733000064333CaDDbC92763c58BF0192fFeBf',
  RewardsCoordinator: '0xAcc1fb458a1317E886dB376Fc8141540537E68fE',
  AllocationManager: '0x78469728304326CBc65f8f95FA756B0B73164462',
  StrategyFactory: '0x9c01252B580efD11a05C00Aa42Dd58b6D4D227d4',
} as const;

export const HOLESKY_STRATEGIES = {
  // Holesky testnet has different strategy addresses
  // These can be populated as needed for testing
} as const;

export const HOLESKY_CHAIN_ID = 17000;
