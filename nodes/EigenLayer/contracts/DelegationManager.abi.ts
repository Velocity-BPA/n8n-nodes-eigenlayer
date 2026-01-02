/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const DelegationManagerABI = [
  // Read Functions
  'function delegatedTo(address staker) external view returns (address)',
  'function isDelegated(address staker) external view returns (bool)',
  'function isOperator(address operator) external view returns (bool)',
  'function operatorDetails(address operator) external view returns (tuple(address __deprecated_earningsReceiver, address delegationApprover, uint32 __deprecated_stakerOptOutWindowBlocks))',
  'function operatorShares(address operator, address strategy) external view returns (uint256)',
  'function getWithdrawableShares(address staker, address[] strategies) external view returns (uint256[] withdrawableShares, uint256[] depositShares)',
  'function cumulativeWithdrawalsQueued(address staker) external view returns (uint256)',
  'function calculateWithdrawalRoot(tuple(address staker, address delegatedTo, address withdrawer, uint256 nonce, uint32 startBlock, address[] strategies, tuple(uint256 scaledShares)[] scaledSharesToWithdraw) withdrawal) external pure returns (bytes32)',
  'function pendingWithdrawals(bytes32 withdrawalRoot) external view returns (bool)',
  'function minWithdrawalDelayBlocks() external view returns (uint32)',
  'function getOperatorShares(address operator, address[] strategies) external view returns (uint256[])',
  'function stakerNonce(address staker) external view returns (uint256)',
  'function delegationApprover(address operator) external view returns (address)',
  'function stakerOptOutWindowBlocks(address operator) external view returns (uint256)',
  'function owner() external view returns (address)',
  'function paused() external view returns (uint256)',
  'function getDepositedShares(address staker) external view returns (address[] strategies, uint256[] shares)',
  
  // Write Functions
  'function registerAsOperator(tuple(address __deprecated_earningsReceiver, address delegationApprover, uint32 __deprecated_stakerOptOutWindowBlocks) registeringOperatorDetails, uint32 allocationDelay, string metadataURI) external',
  'function modifyOperatorDetails(tuple(address __deprecated_earningsReceiver, address delegationApprover, uint32 __deprecated_stakerOptOutWindowBlocks) newOperatorDetails) external',
  'function updateOperatorMetadataURI(string metadataURI) external',
  'function delegateTo(address operator, tuple(bytes signature, uint256 expiry) approverSignatureAndExpiry, bytes32 approverSalt) external',
  'function delegateToBySignature(address staker, address operator, tuple(bytes signature, uint256 expiry) stakerSignatureAndExpiry, tuple(bytes signature, uint256 expiry) approverSignatureAndExpiry, bytes32 approverSalt) external',
  'function undelegate(address staker) external returns (bytes32[])',
  'function queueWithdrawals(tuple(address[] strategies, uint256[] shares, address withdrawer)[] params) external returns (bytes32[])',
  'function completeQueuedWithdrawal(tuple(address staker, address delegatedTo, address withdrawer, uint256 nonce, uint32 startBlock, address[] strategies, tuple(uint256 scaledShares)[] scaledSharesToWithdraw) withdrawal, address[] tokens, bool receiveAsTokens) external',
  'function completeQueuedWithdrawals(tuple(address staker, address delegatedTo, address withdrawer, uint256 nonce, uint32 startBlock, address[] strategies, tuple(uint256 scaledShares)[] scaledSharesToWithdraw)[] withdrawals, address[][] tokens, bool[] receiveAsTokens) external',
  
  // Events
  'event OperatorRegistered(address indexed operator, tuple(address __deprecated_earningsReceiver, address delegationApprover, uint32 __deprecated_stakerOptOutWindowBlocks) operatorDetails)',
  'event OperatorDetailsModified(address indexed operator, tuple(address __deprecated_earningsReceiver, address delegationApprover, uint32 __deprecated_stakerOptOutWindowBlocks) newOperatorDetails)',
  'event OperatorMetadataURIUpdated(address indexed operator, string metadataURI)',
  'event StakerDelegated(address indexed staker, address indexed operator)',
  'event StakerUndelegated(address indexed staker, address indexed operator)',
  'event StakerForceUndelegated(address indexed staker, address indexed operator)',
  'event WithdrawalQueued(bytes32 withdrawalRoot, tuple(address staker, address delegatedTo, address withdrawer, uint256 nonce, uint32 startBlock, address[] strategies, tuple(uint256 scaledShares)[] scaledSharesToWithdraw) withdrawal)',
  'event WithdrawalCompleted(bytes32 withdrawalRoot)',
  'event OperatorSharesIncreased(address indexed operator, address staker, address strategy, uint256 shares)',
  'event OperatorSharesDecreased(address indexed operator, address staker, address strategy, uint256 shares)',
] as const;
