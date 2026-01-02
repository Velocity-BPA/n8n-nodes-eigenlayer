/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const EigenPodManagerABI = [
  // Read Functions
  'function ownerToPod(address podOwner) external view returns (address)',
  'function hasPod(address podOwner) external view returns (bool)',
  'function podOwnerDepositShares(address podOwner) external view returns (int256)',
  'function numPods() external view returns (uint256)',
  'function beaconChainETHStrategy() external view returns (address)',
  'function eigenPodBeacon() external view returns (address)',
  'function maxPods() external view returns (uint256)',
  'function denebForkTimestamp() external view returns (uint64)',
  'function owner() external view returns (address)',
  'function paused() external view returns (uint256)',
  'function ethPOS() external view returns (address)',
  'function delegationManager() external view returns (address)',
  'function strategyManager() external view returns (address)',
  
  // Write Functions
  'function createPod() external returns (address)',
  'function stake(bytes pubkey, bytes signature, bytes32 depositDataRoot) external payable',
  'function recordBeaconChainETHBalanceUpdate(address podOwner, int256 sharesDelta, uint64 proportionOfOldBalance) external',
  'function addShares(address staker, uint256 shares) external returns (uint256)',
  'function removeShares(address staker, uint256 shares) external',
  'function withdrawSharesAsTokens(address podOwner, address destination, uint256 shares) external',
  
  // Events
  'event PodDeployed(address indexed eigenPod, address indexed podOwner)',
  'event BeaconChainETHDeposited(address indexed podOwner, uint256 amount)',
  'event BeaconChainETHWithdrawalCompleted(address indexed podOwner, uint256 shares, uint96 nonce, address delegatedAddress, address withdrawer, bytes32 withdrawalRoot)',
  'event PodSharesUpdated(address indexed podOwner, int256 sharesDelta)',
  'event NewTotalShares(address indexed podOwner, int256 newTotalShares)',
] as const;
