/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const AllocationManagerABI = [
  // Read Functions
  'function getEncumberedMagnitude(address operator, address strategy) external view returns (uint64)',
  'function getMaxMagnitude(address operator, address strategy) external view returns (uint64)',
  'function getAllocation(address operator, tuple(address avs, uint32 operatorSetId) operatorSet, address strategy) external view returns (tuple(uint64 currentMagnitude, int128 pendingDiff, uint32 effectBlock))',
  'function getMinimumSlashableStake(tuple(address avs, uint32 operatorSetId) operatorSet, address[] operators, address[] strategies, uint32 futureBlock) external view returns (uint256[][] slashableStake)',
  'function getAllocationDelay(address operator) external view returns (bool isSet, uint32 delay)',
  'function getSlashableMagnitude(address operator, tuple(address avs, uint32 operatorSetId) operatorSet, address strategy, uint32 timestamp) external view returns (uint64)',
  'function getPendingAllocations(address operator, address strategy, tuple(address avs, uint32 operatorSetId)[] operatorSets) external view returns (tuple(uint64 currentMagnitude, int128 pendingDiff, uint32 effectBlock)[])',
  'function getPendingDeallocations(address operator, address strategy, tuple(address avs, uint32 operatorSetId)[] operatorSets) external view returns (tuple(uint64 currentMagnitude, int128 pendingDiff, uint32 effectBlock)[])',
  'function getAllocatedMagnitude(address operator, tuple(address avs, uint32 operatorSetId) operatorSet, address strategy) external view returns (uint64)',
  'function getAllocatedStrategies(address operator, tuple(address avs, uint32 operatorSetId) operatorSet) external view returns (address[])',
  'function getAllocatableMagnitude(address operator, address strategy) external view returns (uint64)',
  'function DEALLOCATION_DELAY() external view returns (uint32)',
  'function ALLOCATION_CONFIGURATION_DELAY() external view returns (uint32)',
  'function delegation() external view returns (address)',
  'function avsDirectory() external view returns (address)',
  'function owner() external view returns (address)',
  'function paused() external view returns (uint256)',
  
  // Write Functions
  'function slashOperator(address avs, tuple(address operator, uint32 operatorSetId, address[] strategies, uint256 wadToSlash, string description) params) external',
  'function modifyAllocations(address operator, tuple(tuple(address avs, uint32 operatorSetId) operatorSet, address[] strategies, uint64[] newMagnitudes)[] params) external',
  'function setAllocationDelay(address operator, uint32 delay) external',
  'function clearDeallocationQueue(address operator, address[] strategies, uint16[] numToClear) external',
  
  // Events
  'event OperatorSlashed(address indexed operator, tuple(address avs, uint32 operatorSetId) operatorSet, address[] strategies, uint256[] wadSlashed, string description)',
  'event AllocationUpdated(address indexed operator, tuple(address avs, uint32 operatorSetId) operatorSet, address strategy, uint64 magnitude, uint32 effectBlock)',
  'event AllocationDelaySet(address indexed operator, uint32 delay, uint32 effectBlock)',
  'event EncumberedMagnitudeUpdated(address indexed operator, address strategy, uint64 encumberedMagnitude)',
  'event MaxMagnitudeUpdated(address indexed operator, address strategy, uint64 maxMagnitude)',
  'event OperatorSetMagnitudeUpdated(address indexed operator, tuple(address avs, uint32 operatorSetId) operatorSet, address strategy, uint64 magnitude)',
] as const;
