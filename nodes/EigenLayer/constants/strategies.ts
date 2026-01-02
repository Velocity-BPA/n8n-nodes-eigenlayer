/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { MAINNET_STRATEGIES } from './addresses.mainnet';

export interface StrategyInfo {
  name: string;
  symbol: string;
  address: string;
  underlyingToken: string;
  description: string;
}

export const STRATEGY_INFO: Record<string, StrategyInfo> = {
  stETH: {
    name: 'Lido Staked ETH Strategy',
    symbol: 'stETH',
    address: MAINNET_STRATEGIES.stETH,
    underlyingToken: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    description: 'Strategy for Lido stETH liquid staking token',
  },
  rETH: {
    name: 'Rocket Pool ETH Strategy',
    symbol: 'rETH',
    address: MAINNET_STRATEGIES.rETH,
    underlyingToken: '0xae78736Cd615f374D3085123A210448E74Fc6393',
    description: 'Strategy for Rocket Pool rETH liquid staking token',
  },
  cbETH: {
    name: 'Coinbase Wrapped Staked ETH Strategy',
    symbol: 'cbETH',
    address: MAINNET_STRATEGIES.cbETH,
    underlyingToken: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704',
    description: 'Strategy for Coinbase cbETH liquid staking token',
  },
  wBETH: {
    name: 'Wrapped Binance Beacon ETH Strategy',
    symbol: 'wBETH',
    address: MAINNET_STRATEGIES.wBETH,
    underlyingToken: '0xa2E3356610840701BDf5611a53974510Ae27E2e1',
    description: 'Strategy for Binance wBETH liquid staking token',
  },
  osETH: {
    name: 'StakeWise ETH Strategy',
    symbol: 'osETH',
    address: MAINNET_STRATEGIES.osETH,
    underlyingToken: '0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38',
    description: 'Strategy for StakeWise osETH liquid staking token',
  },
  swETH: {
    name: 'Swell ETH Strategy',
    symbol: 'swETH',
    address: MAINNET_STRATEGIES.swETH,
    underlyingToken: '0xf951E335afb289353dc249e82926178EaC7DEd78',
    description: 'Strategy for Swell swETH liquid staking token',
  },
  AnkrETH: {
    name: 'Ankr Staked ETH Strategy',
    symbol: 'ankrETH',
    address: MAINNET_STRATEGIES.AnkrETH,
    underlyingToken: '0xE95A203B1a91a908F9B9CE46459d101078c2c3cb',
    description: 'Strategy for Ankr ankrETH liquid staking token',
  },
  OETH: {
    name: 'Origin ETH Strategy',
    symbol: 'OETH',
    address: MAINNET_STRATEGIES.OETH,
    underlyingToken: '0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3',
    description: 'Strategy for Origin OETH liquid staking token',
  },
  sfrxETH: {
    name: 'Frax Staked ETH Strategy',
    symbol: 'sfrxETH',
    address: MAINNET_STRATEGIES.sfrxETH,
    underlyingToken: '0xac3E018457B222d93114458476f3E3416Abbe38F',
    description: 'Strategy for Frax sfrxETH liquid staking token',
  },
  lsETH: {
    name: 'Liquid Staked ETH Strategy',
    symbol: 'lsETH',
    address: MAINNET_STRATEGIES.lsETH,
    underlyingToken: '0x8c1BEd5b9a0928467c9B1341Da1D7BD5e10b6549',
    description: 'Strategy for Liquid Collective lsETH liquid staking token',
  },
  mETH: {
    name: 'Mantle Staked ETH Strategy',
    symbol: 'mETH',
    address: MAINNET_STRATEGIES.mETH,
    underlyingToken: '0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa',
    description: 'Strategy for Mantle mETH liquid staking token',
  },
  EIGEN: {
    name: 'EIGEN Token Strategy',
    symbol: 'EIGEN',
    address: MAINNET_STRATEGIES.EIGEN,
    underlyingToken: '0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83',
    description: 'Strategy for EIGEN governance token',
  },
};

export const WITHDRAWAL_DELAY_BLOCKS = 100800; // ~14 days on mainnet
export const MIN_WITHDRAWAL_DELAY_BLOCKS = 50400; // ~7 days minimum
