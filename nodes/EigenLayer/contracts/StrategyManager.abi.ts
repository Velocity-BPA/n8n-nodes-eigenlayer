/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const StrategyManagerABI = [
  // Read Functions
  'function stakerDepositShares(address staker, address strategy) external view returns (uint256)',
  'function getDeposits(address staker) external view returns (address[] strategies, uint256[] shares)',
  'function stakerStrategyListLength(address staker) external view returns (uint256)',
  'function strategyIsWhitelistedForDeposit(address strategy) external view returns (bool)',
  'function nonces(address staker) external view returns (uint256)',
  'function thirdPartyTransfersForbidden(address strategy) external view returns (bool)',
  'function delegation() external view returns (address)',
  'function eigenPodManager() external view returns (address)',
  'function strategyWhitelister() external view returns (address)',
  'function owner() external view returns (address)',
  'function paused() external view returns (uint256)',
  'function stakerStrategyShares(address staker, address strategy) external view returns (uint256)',
  
  // Write Functions
  'function depositIntoStrategy(address strategy, address token, uint256 amount) external returns (uint256 shares)',
  'function depositIntoStrategyWithSignature(address strategy, address token, uint256 amount, address staker, uint256 expiry, bytes signature) external returns (uint256 shares)',
  'function removeShares(address staker, address strategy, uint256 shares) external',
  'function addShares(address staker, address token, address strategy, uint256 shares) external',
  'function withdrawSharesAsTokens(address staker, address strategy, address token, uint256 shares) external',
  
  // Events
  'event Deposit(address staker, address token, address strategy, uint256 shares)',
  'event StrategyWhitelisterChanged(address previousAddress, address newAddress)',
  'event StrategyAddedToDepositWhitelist(address strategy)',
  'event StrategyRemovedFromDepositWhitelist(address strategy)',
] as const;
