/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const EigenPodABI = [
  // Read Functions
  'function podOwner() external view returns (address)',
  'function restakedExecutionLayerGwei() external view returns (uint64)',
  'function withdrawableRestakedExecutionLayerGwei() external view returns (uint64)',
  'function nonBeaconChainETHBalanceWei() external view returns (uint256)',
  'function validatorStatus(bytes32 pubkeyHash) external view returns (uint8)',
  'function validatorPubkeyHashToInfo(bytes32 pubkeyHash) external view returns (tuple(uint64 validatorIndex, uint64 restakedBalanceGwei, uint64 lastCheckpointedAt, uint8 status))',
  'function hasRestaked() external view returns (bool)',
  'function mostRecentWithdrawalTimestamp() external view returns (uint64)',
  'function proofSubmitter() external view returns (address)',
  'function eigenPodManager() external view returns (address)',
  'function ethPOS() external view returns (address)',
  'function activeValidatorCount() external view returns (uint256)',
  'function lastCheckpointTimestamp() external view returns (uint64)',
  'function currentCheckpointTimestamp() external view returns (uint64)',
  'function currentCheckpoint() external view returns (tuple(bytes32 beaconBlockRoot, uint24 proofsRemaining, uint64 podBalanceGwei, int128 balanceDeltasGwei))',
  
  // Write Functions
  'function verifyWithdrawalCredentials(uint64 beaconTimestamp, tuple(bytes32 beaconStateRoot, bytes proof) stateRootProof, uint40[] validatorIndices, bytes[] validatorFieldsProofs, bytes32[][] validatorFields) external',
  'function verifyBalanceUpdates(uint64 beaconTimestamp, tuple(bytes32 beaconStateRoot, bytes proof) stateRootProof, uint40[] validatorIndices, bytes[] validatorFieldsProofs, bytes32[][] validatorFields) external',
  'function verifyAndProcessWithdrawals(uint64 beaconTimestamp, tuple(bytes32 beaconStateRoot, bytes proof) stateRootProof, tuple(bytes proof, uint64 slot, uint64 executionPayloadTimestamp, bytes32 executionPayloadRoot, bytes32 pubkeyHash, uint64 validatorIndex)[] withdrawalProofs, bytes[] validatorFieldsProofs, bytes32[][] validatorFields, bytes32[][] withdrawalFields) external',
  'function withdrawNonBeaconChainETHBalanceWei(address recipient, uint256 amountToWithdraw) external',
  'function recoverTokens(address[] tokenList, uint256[] amountsToWithdraw, address recipient) external',
  'function activateRestaking() external',
  'function setProofSubmitter(address newProofSubmitter) external',
  'function startCheckpoint(bool revertIfNoBalance) external',
  'function verifyCheckpointProofs(tuple(bytes32 beaconBlockRoot, uint24 proofsRemaining, uint64 podBalanceGwei, int128 balanceDeltasGwei) checkpointProof, tuple(bytes32[] validatorProof, bytes32[] validatorFields, bytes32 balanceRoot, bytes32 balanceProof)[] balanceProofs) external',
  
  // Events
  'event EigenPodStaked(bytes pubkey)',
  'event ValidatorRestaked(uint40 validatorIndex)',
  'event ValidatorBalanceUpdated(uint40 validatorIndex, uint64 balanceTimestamp, uint64 newValidatorBalanceGwei)',
  'event FullWithdrawalRedeemed(uint40 validatorIndex, uint64 withdrawalTimestamp, address indexed recipient, uint64 withdrawalAmountGwei)',
  'event PartialWithdrawalRedeemed(uint40 validatorIndex, uint64 withdrawalTimestamp, address indexed recipient, uint64 partialWithdrawalAmountGwei)',
  'event RestakedBeaconChainETHWithdrawn(address indexed recipient, uint256 amount)',
  'event NonBeaconChainETHReceived(uint256 amountReceived)',
  'event NonBeaconChainETHWithdrawn(address indexed recipient, uint256 amountWithdrawn)',
  'event RestakingActivated(address indexed podOwner)',
  'event ProofSubmitterUpdated(address prevProofSubmitter, address newProofSubmitter)',
  'event CheckpointCreated(uint64 indexed checkpointTimestamp, bytes32 indexed beaconBlockRoot, uint256 validatorCount)',
  'event CheckpointFinalized(uint64 indexed checkpointTimestamp, int256 totalShareDeltaWei)',
] as const;
