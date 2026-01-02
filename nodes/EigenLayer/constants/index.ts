/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export * from './addresses.mainnet';
export * from './addresses.holesky';
export * from './strategies';

export type NetworkType = 'mainnet' | 'holesky';

export interface ContractAddresses {
  DelegationManager: string;
  StrategyManager: string;
  EigenPodManager: string;
  AVSDirectory: string;
  RewardsCoordinator: string;
  AllocationManager: string;
  StrategyFactory: string;
}

import { MAINNET_ADDRESSES, MAINNET_CHAIN_ID, MAINNET_STRATEGIES } from './addresses.mainnet';
import { HOLESKY_ADDRESSES, HOLESKY_CHAIN_ID } from './addresses.holesky';

export function getContractAddresses(network: NetworkType | string): ContractAddresses {
  switch (network) {
    case 'mainnet':
      return MAINNET_ADDRESSES;
    case 'holesky':
      return HOLESKY_ADDRESSES;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}

export function getContractAddress(contractName: keyof ContractAddresses, chainId: number): string {
  const addresses = chainId === 1 ? MAINNET_ADDRESSES : chainId === 17000 ? HOLESKY_ADDRESSES : null;
  if (!addresses) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return addresses[contractName];
}

export function getChainId(network: NetworkType | string): number {
  switch (network) {
    case 'mainnet':
      return MAINNET_CHAIN_ID;
    case 'holesky':
      return HOLESKY_CHAIN_ID;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}

// Strategy metadata for test compatibility
export interface StrategyMetadataItem {
  name: string;
  symbol: string;
  strategyAddress: string;
  tokenAddress: string;
  decimals: number;
}

export const STRATEGY_METADATA: StrategyMetadataItem[] = [
  { name: 'Lido Staked ETH', symbol: 'stETH', strategyAddress: MAINNET_STRATEGIES.stETH, tokenAddress: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', decimals: 18 },
  { name: 'Rocket Pool ETH', symbol: 'rETH', strategyAddress: MAINNET_STRATEGIES.rETH, tokenAddress: '0xae78736Cd615f374D3085123A210448E74Fc6393', decimals: 18 },
  { name: 'Coinbase Wrapped Staked ETH', symbol: 'cbETH', strategyAddress: MAINNET_STRATEGIES.cbETH, tokenAddress: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704', decimals: 18 },
  { name: 'Wrapped Binance Beacon ETH', symbol: 'wBETH', strategyAddress: MAINNET_STRATEGIES.wBETH, tokenAddress: '0xa2E3356610840701BDf5611a53974510Ae27E2e1', decimals: 18 },
  { name: 'StakeWise ETH', symbol: 'osETH', strategyAddress: MAINNET_STRATEGIES.osETH, tokenAddress: '0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38', decimals: 18 },
  { name: 'Swell ETH', symbol: 'swETH', strategyAddress: MAINNET_STRATEGIES.swETH, tokenAddress: '0xf951E335afb289353dc249e82926178EaC7DEd78', decimals: 18 },
  { name: 'Ankr Staked ETH', symbol: 'ankrETH', strategyAddress: MAINNET_STRATEGIES.AnkrETH, tokenAddress: '0xE95A203B1a91a908F9B9CE46459d101078c2c3cb', decimals: 18 },
  { name: 'Origin ETH', symbol: 'OETH', strategyAddress: MAINNET_STRATEGIES.OETH, tokenAddress: '0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3', decimals: 18 },
  { name: 'Frax Staked ETH', symbol: 'sfrxETH', strategyAddress: MAINNET_STRATEGIES.sfrxETH, tokenAddress: '0xac3E018457B222d93114458476f3E3416Abbe38F', decimals: 18 },
  { name: 'Liquid Staked ETH', symbol: 'lsETH', strategyAddress: MAINNET_STRATEGIES.lsETH, tokenAddress: '0x8c1BEd5b9a0928467c9B1341Da1D7BD5e10b6549', decimals: 18 },
  { name: 'Mantle Staked ETH', symbol: 'mETH', strategyAddress: MAINNET_STRATEGIES.mETH, tokenAddress: '0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa', decimals: 18 },
  { name: 'EIGEN Token', symbol: 'EIGEN', strategyAddress: MAINNET_STRATEGIES.EIGEN, tokenAddress: '0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83', decimals: 18 },
];

export function getStrategyMetadata(strategyAddress: string): StrategyMetadataItem | undefined {
  return STRATEGY_METADATA.find(s => s.strategyAddress.toLowerCase() === strategyAddress.toLowerCase());
}
