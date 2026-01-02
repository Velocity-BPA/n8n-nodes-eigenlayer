/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const RewardsCoordinatorABI = [
  // Read Functions
  'function cumulativeClaimed(address earner, address token) external view returns (uint256)',
  'function claimerFor(address earner) external view returns (address)',
  'function rewardsUpdater() external view returns (address)',
  'function activationDelay() external view returns (uint32)',
  'function currRewardsCalculationEndTimestamp() external view returns (uint32)',
  'function CALCULATION_INTERVAL_SECONDS() external view returns (uint32)',
  'function MAX_REWARDS_DURATION() external view returns (uint32)',
  'function MAX_RETROACTIVE_LENGTH() external view returns (uint32)',
  'function MAX_FUTURE_LENGTH() external view returns (uint32)',
  'function GENESIS_REWARDS_TIMESTAMP() external view returns (uint32)',
  'function getCurrentDistributionRoot() external view returns (tuple(bytes32 root, uint32 rewardsCalculationEndTimestamp, uint32 activatedAt, bool disabled))',
  'function getDistributionRootAtIndex(uint256 index) external view returns (tuple(bytes32 root, uint32 rewardsCalculationEndTimestamp, uint32 activatedAt, bool disabled))',
  'function getDistributionRootsLength() external view returns (uint256)',
  'function getCurrentClaimableDistributionRoot() external view returns (tuple(bytes32 root, uint32 rewardsCalculationEndTimestamp, uint32 activatedAt, bool disabled))',
  'function getRootIndexFromHash(bytes32 rootHash) external view returns (uint32)',
  'function checkClaim(tuple(uint32 rootIndex, uint32 earnerIndex, bytes earnerTreeProof, tuple(address earner, bytes32 earnerTokenRoot) earnerLeaf, uint32[] tokenIndices, bytes[] tokenTreeProofs, tuple(address token, uint256 cumulativeEarnings)[] tokenLeaves) claim) external view returns (bool)',
  'function calculateEarnerLeafHash(tuple(address earner, bytes32 earnerTokenRoot) leaf) external pure returns (bytes32)',
  'function calculateTokenLeafHash(tuple(address token, uint256 cumulativeEarnings) leaf) external pure returns (bytes32)',
  'function owner() external view returns (address)',
  'function paused() external view returns (uint256)',
  'function delegationManager() external view returns (address)',
  'function strategyManager() external view returns (address)',
  
  // Write Functions
  'function processClaim(tuple(uint32 rootIndex, uint32 earnerIndex, bytes earnerTreeProof, tuple(address earner, bytes32 earnerTokenRoot) earnerLeaf, uint32[] tokenIndices, bytes[] tokenTreeProofs, tuple(address token, uint256 cumulativeEarnings)[] tokenLeaves) claim, address recipient) external',
  'function processClaims(tuple(uint32 rootIndex, uint32 earnerIndex, bytes earnerTreeProof, tuple(address earner, bytes32 earnerTokenRoot) earnerLeaf, uint32[] tokenIndices, bytes[] tokenTreeProofs, tuple(address token, uint256 cumulativeEarnings)[] tokenLeaves)[] claims, address recipient) external',
  'function setClaimerFor(address claimer) external',
  'function submitRoot(bytes32 root, uint32 rewardsCalculationEndTimestamp) external',
  'function disableRoot(uint32 rootIndex) external',
  'function setRewardsUpdater(address newRewardsUpdater) external',
  'function setActivationDelay(uint32 newActivationDelay) external',
  'function setRewardsForAllSubmitter(address submitter, bool newValue) external',
  'function createAVSRewardsSubmission(tuple(address[] strategiesAndMultipliers, address token, uint256 amount, uint32 startTimestamp, uint32 duration)[] rewardsSubmissions) external',
  'function createRewardsForAllSubmission(tuple(address[] strategiesAndMultipliers, address token, uint256 amount, uint32 startTimestamp, uint32 duration)[] rewardsSubmissions) external',
  'function createRewardsForAllEarners(tuple(address[] strategiesAndMultipliers, address token, uint256 amount, uint32 startTimestamp, uint32 duration)[] rewardsSubmissions) external',
  
  // Events
  'event RewardsClaimed(bytes32 root, address indexed earner, address indexed claimer, address indexed recipient, address token, uint256 claimedAmount)',
  'event ClaimerForSet(address indexed earner, address indexed oldClaimer, address indexed claimer)',
  'event DistributionRootSubmitted(uint32 indexed rootIndex, bytes32 indexed root, uint32 indexed rewardsCalculationEndTimestamp, uint32 activatedAt)',
  'event DistributionRootDisabled(uint32 indexed rootIndex)',
  'event RewardsUpdaterSet(address indexed oldRewardsUpdater, address indexed newRewardsUpdater)',
  'event ActivationDelaySet(uint32 oldActivationDelay, uint32 newActivationDelay)',
  'event AVSRewardsSubmissionCreated(address indexed avs, uint256 indexed submissionNonce, bytes32 indexed rewardsSubmissionHash, tuple(address[] strategiesAndMultipliers, address token, uint256 amount, uint32 startTimestamp, uint32 duration) rewardsSubmission)',
  'event RewardsSubmissionForAllCreated(address indexed submitter, uint256 indexed submissionNonce, bytes32 indexed rewardsSubmissionHash, tuple(address[] strategiesAndMultipliers, address token, uint256 amount, uint32 startTimestamp, uint32 duration) rewardsSubmission)',
  'event RewardsSubmissionForAllEarnersCreated(address indexed tokenHopper, uint256 indexed submissionNonce, bytes32 indexed rewardsSubmissionHash, tuple(address[] strategiesAndMultipliers, address token, uint256 amount, uint32 startTimestamp, uint32 duration) rewardsSubmission)',
] as const;
