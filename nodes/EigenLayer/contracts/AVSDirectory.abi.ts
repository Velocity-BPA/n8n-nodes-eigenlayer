/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const AVSDirectoryABI = [
  // Read Functions
  'function operatorSaltIsSpent(address operator, bytes32 salt) external view returns (bool)',
  'function calculateOperatorAVSRegistrationDigestHash(address operator, address avs, bytes32 salt, uint256 expiry) external view returns (bytes32)',
  'function avsOperatorStatus(address avs, address operator) external view returns (uint8)',
  'function OPERATOR_AVS_REGISTRATION_TYPEHASH() external view returns (bytes32)',
  'function delegation() external view returns (address)',
  'function owner() external view returns (address)',
  'function paused() external view returns (uint256)',
  'function becomeOperatorSetAVS() external view returns (bool)',
  'function isOperatorSetAVS(address avs) external view returns (bool)',
  'function getNumOperatorSetsOfOperator(address operator) external view returns (uint256)',
  'function getOperatorSetsOfOperator(address operator, uint256 start, uint256 length) external view returns (tuple(address avs, uint32 operatorSetId)[])',
  'function isMember(address operator, tuple(address avs, uint32 operatorSetId) operatorSet) external view returns (bool)',
  
  // Write Functions
  'function registerOperatorToAVS(address operator, tuple(bytes signature, bytes32 salt, uint256 expiry) operatorSignature) external',
  'function deregisterOperatorFromAVS(address operator) external',
  'function updateAVSMetadataURI(string metadataURI) external',
  'function registerOperatorToOperatorSets(address operator, uint32[] operatorSetIds, tuple(bytes signature, bytes32 salt, uint256 expiry) operatorSignature) external',
  'function deregisterOperatorFromOperatorSets(address operator, uint32[] operatorSetIds) external',
  'function forceDeregisterFromOperatorSets(address operator, address avs, uint32[] operatorSetIds, tuple(bytes signature, bytes32 salt, uint256 expiry) operatorSignature) external',
  'function createOperatorSets(uint32[] operatorSetIds) external',
  'function migrateOperatorsToOperatorSets(uint32[][] operatorSetIds, address[] operators) external',
  
  // Events
  'event AVSMetadataURIUpdated(address indexed avs, string metadataURI)',
  'event OperatorAVSRegistrationStatusUpdated(address indexed operator, address indexed avs, uint8 status)',
  'event OperatorAddedToOperatorSet(address indexed operator, tuple(address avs, uint32 operatorSetId) operatorSet)',
  'event OperatorRemovedFromOperatorSet(address indexed operator, tuple(address avs, uint32 operatorSetId) operatorSet)',
  'event OperatorSetCreated(tuple(address avs, uint32 operatorSetId) operatorSet)',
  'event AVSMigratedToOperatorSets(address indexed avs)',
  'event OperatorMigratedToOperatorSets(address indexed operator, address indexed avs, uint32[] operatorSetIds)',
] as const;
