/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const StrategyABI = [
  // Read Functions
  'function totalShares() external view returns (uint256)',
  'function underlyingToken() external view returns (address)',
  'function sharesToUnderlying(uint256 amountShares) external view returns (uint256)',
  'function underlyingToShares(uint256 amountUnderlying) external view returns (uint256)',
  'function userUnderlying(address user) external view returns (uint256)',
  'function userUnderlyingView(address user) external view returns (uint256)',
  'function shares(address user) external view returns (uint256)',
  'function explanation() external view returns (string)',
  'function strategyManager() external view returns (address)',
  'function paused() external view returns (uint256)',
  
  // Write Functions (deposit/withdraw typically handled by StrategyManager)
  'function deposit(address token, uint256 amount) external returns (uint256)',
  'function withdraw(address recipient, address token, uint256 amountShares) external',
  
  // Events
  'event ExchangeRateEmitted(uint256 rate)',
  'event StrategyTokenSet(address token, uint8 decimals)',
] as const;
