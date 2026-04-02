/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-eigenlayer/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class EigenLayer implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'EigenLayer',
    name: 'eigenlayer',
    icon: 'file:eigenlayer.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the EigenLayer API',
    defaults: {
      name: 'EigenLayer',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'eigenlayerApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Restaking',
            value: 'restaking',
          },
          {
            name: 'Delegation',
            value: 'delegation',
          },
          {
            name: 'EigenPods',
            value: 'eigenPods',
          },
          {
            name: 'OperatorRegistration',
            value: 'operatorRegistration',
          },
          {
            name: 'AVSRegistration',
            value: 'aVSRegistration',
          },
          {
            name: 'Rewards',
            value: 'rewards',
          }
        ],
        default: 'restaking',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['restaking'] } },
  options: [
    { name: 'Stake Tokens', value: 'stakeTokens', description: 'Stake ETH or LSTs into EigenLayer', action: 'Stake tokens' },
    { name: 'Get Positions', value: 'getPositions', description: 'Get restaking positions for an address', action: 'Get positions for address' },
    { name: 'Get All Positions', value: 'getAllPositions', description: 'List all restaking positions with pagination', action: 'Get all positions' },
    { name: 'Update Position', value: 'updatePosition', description: 'Update restaking position parameters', action: 'Update position' },
    { name: 'Unstake Tokens', value: 'unstakeTokens', description: 'Initiate unstaking process', action: 'Unstake tokens' },
  ],
  default: 'stakeTokens',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['delegation'] } },
  options: [
    { name: 'Delegate to Operator', value: 'delegateToOperator', description: 'Delegate restaked tokens to an operator', action: 'Delegate tokens to operator' },
    { name: 'Get Delegations', value: 'getDelegations', description: 'Get delegation details for an address', action: 'Get delegations for address' },
    { name: 'Get All Delegations', value: 'getAllDelegations', description: 'List all delegations with filtering', action: 'List all delegations' },
    { name: 'Update Delegation', value: 'updateDelegation', description: 'Modify existing delegation', action: 'Update delegation' },
    { name: 'Undelegate from Operator', value: 'undelegateFromOperator', description: 'Remove delegation from operator', action: 'Undelegate from operator' },
  ],
  default: 'delegateToOperator',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['eigenPods'] } },
	options: [
		{
			name: 'Create EigenPod',
			value: 'createEigenPod',
			description: 'Deploy new EigenPod for native ETH staking',
			action: 'Create EigenPod',
		},
		{
			name: 'Get EigenPod',
			value: 'getEigenPod',
			description: 'Get EigenPod details and status',
			action: 'Get EigenPod',
		},
		{
			name: 'Get All EigenPods',
			value: 'getAllEigenPods',
			description: 'List EigenPods with filtering options',
			action: 'Get all EigenPods',
		},
		{
			name: 'Verify Validators',
			value: 'verifyValidators',
			description: 'Verify validator credentials for EigenPod',
			action: 'Verify validators',
		},
		{
			name: 'Withdraw From EigenPod',
			value: 'withdrawFromEigenPod',
			description: 'Withdraw ETH from EigenPod',
			action: 'Withdraw from EigenPod',
		},
	],
	default: 'createEigenPod',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['operatorRegistration'] } },
  options: [
    { name: 'Register Operator', value: 'registerOperator', description: 'Register as an EigenLayer operator', action: 'Register operator' },
    { name: 'Get Operator', value: 'getOperator', description: 'Get operator details and metadata', action: 'Get operator' },
    { name: 'Get All Operators', value: 'getAllOperators', description: 'List registered operators with filtering', action: 'Get all operators' },
    { name: 'Update Operator', value: 'updateOperator', description: 'Update operator metadata and settings', action: 'Update operator' },
    { name: 'Deregister Operator', value: 'deregisterOperator', description: 'Deregister operator from EigenLayer', action: 'Deregister operator' },
  ],
  default: 'registerOperator',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['aVSRegistration'] } },
  options: [
    { name: 'Register AVS', value: 'registerAVS', description: 'Register new Actively Validated Service', action: 'Register AVS' },
    { name: 'Get AVS', value: 'getAVS', description: 'Get AVS details and registered operators', action: 'Get AVS details' },
    { name: 'Get All AVS', value: 'getAllAVS', description: 'List all registered AVS with pagination', action: 'List all AVS' },
    { name: 'Opt In To AVS', value: 'optInToAVS', description: 'Operator opts into AVS', action: 'Opt in to AVS' },
    { name: 'Opt Out Of AVS', value: 'optOutOfAVS', description: 'Operator opts out of AVS', action: 'Opt out of AVS' },
  ],
  default: 'registerAVS',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['rewards'] } },
  options: [
    { name: 'Calculate Rewards', value: 'calculateRewards', description: 'Calculate pending rewards for address', action: 'Calculate rewards' },
    { name: 'Get Reward History', value: 'getRewardHistory', description: 'Get historical reward data', action: 'Get reward history' },
    { name: 'Get All Distributions', value: 'getAllDistributions', description: 'List reward distributions across all AVS', action: 'Get all distributions' },
    { name: 'Claim Rewards', value: 'claimRewards', description: 'Claim pending rewards', action: 'Claim rewards' },
    { name: 'Get Merkle Proof', value: 'getMerkleProof', description: 'Get merkle proof for reward claim', action: 'Get merkle proof' },
  ],
  default: 'calculateRewards',
},
{
  displayName: 'Token',
  name: 'token',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['restaking'], operation: ['stakeTokens'] } },
  default: '',
  description: 'Token address to stake (ETH or LST contract address)',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['restaking'], operation: ['stakeTokens'] } },
  default: '',
  description: 'Amount to stake in Wei',
},
{
  displayName: 'Operator',
  name: 'operator',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['restaking'], operation: ['stakeTokens'] } },
  default: '',
  description: 'Operator address to delegate to',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['restaking'], operation: ['getPositions'] } },
  default: '',
  description: 'Ethereum address to get positions for',
},
{
  displayName: 'Token',
  name: 'token',
  type: 'string',
  displayOptions: { show: { resource: ['restaking'], operation: ['getPositions'] } },
  default: '',
  description: 'Filter by specific token address',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  displayOptions: { show: { resource: ['restaking'], operation: ['getAllPositions'] } },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['restaking'], operation: ['getAllPositions'] } },
  default: 20,
  description: 'Number of items per page',
},
{
  displayName: 'Token Filter',
  name: 'token',
  type: 'string',
  displayOptions: { show: { resource: ['restaking'], operation: ['getAllPositions'] } },
  default: '',
  description: 'Filter positions by token address',
},
{
  displayName: 'Position ID',
  name: 'positionId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['restaking'], operation: ['updatePosition'] } },
  default: '',
  description: 'ID of the position to update',
},
{
  displayName: 'Operator',
  name: 'operator',
  type: 'string',
  displayOptions: { show: { resource: ['restaking'], operation: ['updatePosition'] } },
  default: '',
  description: 'New operator address to delegate to',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  displayOptions: { show: { resource: ['restaking'], operation: ['updatePosition'] } },
  default: '',
  description: 'New staking amount in Wei',
},
{
  displayName: 'Token',
  name: 'token',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['restaking'], operation: ['unstakeTokens'] } },
  default: '',
  description: 'Token address to unstake',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['restaking'], operation: ['unstakeTokens'] } },
  default: '',
  description: 'Amount to unstake in Wei',
},
{
  displayName: 'Position ID',
  name: 'positionId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['restaking'], operation: ['unstakeTokens'] } },
  default: '',
  description: 'ID of the position to unstake from',
},
{
  displayName: 'Operator',
  name: 'operator',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['delegation'], operation: ['delegateToOperator'] } },
  default: '',
  description: 'Ethereum address of the operator to delegate to',
  placeholder: '0x1234567890123456789012345678901234567890',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['delegation'], operation: ['delegateToOperator'] } },
  default: '',
  description: 'Amount of tokens to delegate (in Wei)',
  placeholder: '1000000000000000000',
},
{
  displayName: 'Token',
  name: 'token',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['delegation'], operation: ['delegateToOperator'] } },
  default: '',
  description: 'Token contract address',
  placeholder: '0x1234567890123456789012345678901234567890',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['delegation'], operation: ['getDelegations'] } },
  default: '',
  description: 'Ethereum address to get delegations for',
  placeholder: '0x1234567890123456789012345678901234567890',
},
{
  displayName: 'Operator',
  name: 'operator',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['delegation'], operation: ['getDelegations', 'getAllDelegations'] } },
  default: '',
  description: 'Filter by operator address',
  placeholder: '0x1234567890123456789012345678901234567890',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['delegation'], operation: ['getAllDelegations'] } },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['delegation'], operation: ['getAllDelegations'] } },
  default: 50,
  description: 'Number of items per page',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['delegation'], operation: ['getAllDelegations'] } },
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Pending', value: 'pending' },
    { name: 'Completed', value: 'completed' },
    { name: 'Failed', value: 'failed' },
  ],
  default: '',
  description: 'Filter by delegation status',
},
{
  displayName: 'Delegation ID',
  name: 'delegationId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['delegation'], operation: ['updateDelegation', 'undelegateFromOperator'] } },
  default: '',
  description: 'ID of the delegation to modify',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['delegation'], operation: ['updateDelegation', 'undelegateFromOperator'] } },
  default: '',
  description: 'New amount for the delegation (in Wei)',
  placeholder: '1000000000000000000',
},
{
  displayName: 'Operator',
  name: 'operator',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['delegation'], operation: ['updateDelegation'] } },
  default: '',
  description: 'New operator address for the delegation',
  placeholder: '0x1234567890123456789012345678901234567890',
},
{
	displayName: 'Owner Address',
	name: 'owner',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['eigenPods'],
			operation: ['createEigenPod'],
		},
	},
	default: '',
	description: 'Ethereum address of the EigenPod owner',
	placeholder: '0x...',
},
{
	displayName: 'Withdrawal Credentials',
	name: 'withdrawalCredentials',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['eigenPods'],
			operation: ['createEigenPod'],
		},
	},
	default: '',
	description: 'Withdrawal credentials for the EigenPod',
	placeholder: '0x...',
},
{
	displayName: 'Pod Address',
	name: 'podAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['eigenPods'],
			operation: ['getEigenPod', 'verifyValidators', 'withdrawFromEigenPod'],
		},
	},
	default: '',
	description: 'Address of the EigenPod',
	placeholder: '0x...',
},
{
	displayName: 'Include Validators',
	name: 'includeValidators',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['eigenPods'],
			operation: ['getEigenPod'],
		},
	},
	default: false,
	description: 'Whether to include validator details in the response',
},
{
	displayName: 'Page',
	name: 'page',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['eigenPods'],
			operation: ['getAllEigenPods'],
		},
	},
	default: 1,
	description: 'Page number for pagination',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['eigenPods'],
			operation: ['getAllEigenPods'],
		},
	},
	default: 20,
	description: 'Number of EigenPods per page',
},
{
	displayName: 'Owner Filter',
	name: 'ownerFilter',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['eigenPods'],
			operation: ['getAllEigenPods'],
		},
	},
	default: '',
	description: 'Filter by owner address',
	placeholder: '0x...',
},
{
	displayName: 'Status Filter',
	name: 'statusFilter',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['eigenPods'],
			operation: ['getAllEigenPods'],
		},
	},
	options: [
		{
			name: 'All',
			value: '',
		},
		{
			name: 'Active',
			value: 'active',
		},
		{
			name: 'Inactive',
			value: 'inactive',
		},
		{
			name: 'Pending',
			value: 'pending',
		},
	],
	default: '',
	description: 'Filter by EigenPod status',
},
{
	displayName: 'Validator Indices',
	name: 'validatorIndices',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['eigenPods'],
			operation: ['verifyValidators'],
		},
	},
	default: '',
	description: 'Comma-separated list of validator indices to verify',
	placeholder: '1,2,3',
},
{
	displayName: 'Proofs',
	name: 'proofs',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['eigenPods'],
			operation: ['verifyValidators'],
		},
	},
	default: '',
	description: 'Merkle proofs for validator verification',
},
{
	displayName: 'Amount',
	name: 'amount',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['eigenPods'],
			operation: ['withdrawFromEigenPod'],
		},
	},
	default: '',
	description: 'Amount to withdraw in Wei',
	placeholder: '1000000000000000000',
},
{
	displayName: 'Recipient',
	name: 'recipient',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['eigenPods'],
			operation: ['withdrawFromEigenPod'],
		},
	},
	default: '',
	description: 'Recipient address for the withdrawal',
	placeholder: '0x...',
},
{
  displayName: 'Operator Address',
  name: 'operatorAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['operatorRegistration'],
      operation: ['registerOperator', 'getOperator', 'updateOperator', 'deregisterOperator'],
    },
  },
  default: '',
  placeholder: '0x742d35Cc6634C0532925a3b8D40',
  description: 'Ethereum address of the operator',
},
{
  displayName: 'Metadata URI',
  name: 'metadataURI',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['operatorRegistration'],
      operation: ['registerOperator'],
    },
  },
  default: '',
  placeholder: 'https://metadata.example.com/operator.json',
  description: 'URI pointing to operator metadata JSON',
},
{
  displayName: 'Delegation Approver',
  name: 'delegationApprover',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['operatorRegistration'],
      operation: ['registerOperator'],
    },
  },
  default: '',
  placeholder: '0x742d35Cc6634C0532925a3b8D40',
  description: 'Address that can approve delegations (optional)',
},
{
  displayName: 'Include AVS',
  name: 'includeAVS',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['operatorRegistration'],
      operation: ['getOperator'],
    },
  },
  default: false,
  description: 'Whether to include AVS participation details',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['operatorRegistration'],
      operation: ['getAllOperators'],
    },
  },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['operatorRegistration'],
      operation: ['getAllOperators'],
    },
  },
  default: 20,
  description: 'Number of operators to return per page',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  options: [
    { name: 'All', value: '' },
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
    { name: 'Slashed', value: 'slashed' },
  ],
  displayOptions: {
    show: {
      resource: ['operatorRegistration'],
      operation: ['getAllOperators'],
    },
  },
  default: '',
  description: 'Filter operators by status',
},
{
  displayName: 'Minimum Stake',
  name: 'minStake',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['operatorRegistration'],
      operation: ['getAllOperators'],
    },
  },
  default: '',
  placeholder: '1000000000000000000',
  description: 'Minimum stake amount in Wei',
},
{
  displayName: 'Metadata URI',
  name: 'metadataURI',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['operatorRegistration'],
      operation: ['updateOperator'],
    },
  },
  default: '',
  placeholder: 'https://metadata.example.com/operator.json',
  description: 'Updated URI pointing to operator metadata JSON',
},
{
  displayName: 'Delegation Approver',
  name: 'delegationApprover',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['operatorRegistration'],
      operation: ['updateOperator'],
    },
  },
  default: '',
  placeholder: '0x742d35Cc6634C0532925a3b8D40',
  description: 'Updated address that can approve delegations',
},
{
  displayName: 'AVS Address',
  name: 'avsAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['aVSRegistration'], operation: ['registerAVS', 'getAVS', 'optInToAVS', 'optOutOfAVS'] } },
  default: '',
  description: 'Ethereum address of the Actively Validated Service',
},
{
  displayName: 'Metadata URI',
  name: 'metadataURI',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['aVSRegistration'], operation: ['registerAVS'] } },
  default: '',
  description: 'URI pointing to the AVS metadata',
},
{
  displayName: 'Reward Token',
  name: 'rewardToken',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['aVSRegistration'], operation: ['registerAVS'] } },
  default: '',
  description: 'Ethereum address of the reward token',
},
{
  displayName: 'Include Operators',
  name: 'includeOperators',
  type: 'boolean',
  displayOptions: { show: { resource: ['aVSRegistration'], operation: ['getAVS'] } },
  default: false,
  description: 'Whether to include registered operators in the response',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  displayOptions: { show: { resource: ['aVSRegistration'], operation: ['getAllAVS'] } },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['aVSRegistration'], operation: ['getAllAVS'] } },
  default: 100,
  description: 'Number of results per page',
},
{
  displayName: 'Category',
  name: 'category',
  type: 'string',
  displayOptions: { show: { resource: ['aVSRegistration'], operation: ['getAllAVS'] } },
  default: '',
  description: 'Filter AVS by category',
},
{
  displayName: 'Minimum Stake',
  name: 'minStake',
  type: 'string',
  displayOptions: { show: { resource: ['aVSRegistration'], operation: ['getAllAVS'] } },
  default: '',
  description: 'Minimum stake amount filter (in Wei)',
},
{
  displayName: 'Operator Address',
  name: 'operatorAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['aVSRegistration'], operation: ['optInToAVS', 'optOutOfAVS'] } },
  default: '',
  description: 'Ethereum address of the operator',
},
{
  displayName: 'Signature',
  name: 'signature',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['aVSRegistration'], operation: ['optInToAVS'] } },
  default: '',
  description: 'Operator signature for opt-in authorization',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['rewards'], operation: ['calculateRewards'] } },
  default: '',
  placeholder: '0x...',
  description: 'Ethereum address to calculate rewards for',
},
{
  displayName: 'Token',
  name: 'token',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['rewards'], operation: ['calculateRewards'] } },
  default: '',
  description: 'Token address for specific token rewards',
},
{
  displayName: 'Period',
  name: 'period',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['rewards'], operation: ['calculateRewards'] } },
  default: '',
  description: 'Time period for reward calculation',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['rewards'], operation: ['getRewardHistory'] } },
  default: '',
  placeholder: '0x...',
  description: 'Ethereum address to get reward history for',
},
{
  displayName: 'Start Date',
  name: 'startDate',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['rewards'], operation: ['getRewardHistory'] } },
  default: '',
  description: 'Start date for reward history (ISO format)',
},
{
  displayName: 'End Date',
  name: 'endDate',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['rewards'], operation: ['getRewardHistory'] } },
  default: '',
  description: 'End date for reward history (ISO format)',
},
{
  displayName: 'Token',
  name: 'token',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['rewards'], operation: ['getRewardHistory'] } },
  default: '',
  description: 'Token address for specific token rewards',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['rewards'], operation: ['getAllDistributions'] } },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['rewards'], operation: ['getAllDistributions'] } },
  default: 100,
  description: 'Number of items per page',
},
{
  displayName: 'AVS',
  name: 'avs',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['rewards'], operation: ['getAllDistributions'] } },
  default: '',
  description: 'AVS address to filter distributions',
},
{
  displayName: 'Token',
  name: 'token',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['rewards'], operation: ['getAllDistributions'] } },
  default: '',
  description: 'Token address for specific token distributions',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['rewards'], operation: ['claimRewards'] } },
  default: '',
  placeholder: '0x...',
  description: 'Address claiming rewards',
},
{
  displayName: 'Tokens',
  name: 'tokens',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['rewards'], operation: ['claimRewards'] } },
  default: '',
  description: 'Comma-separated list of token addresses to claim',
},
{
  displayName: 'Merkle Proofs',
  name: 'merkleProofs',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['rewards'], operation: ['claimRewards'] } },
  default: '{}',
  description: 'JSON object containing merkle proofs for each token',
},
{
  displayName: 'Root',
  name: 'root',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['rewards'], operation: ['getMerkleProof'] } },
  default: '',
  description: 'Merkle tree root hash',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['rewards'], operation: ['getMerkleProof'] } },
  default: '',
  placeholder: '0x...',
  description: 'Address to generate proof for',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['rewards'], operation: ['getMerkleProof'] } },
  default: '',
  description: 'Reward amount to generate proof for',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'restaking':
        return [await executeRestakingOperations.call(this, items)];
      case 'delegation':
        return [await executeDelegationOperations.call(this, items)];
      case 'eigenPods':
        return [await executeEigenPodsOperations.call(this, items)];
      case 'operatorRegistration':
        return [await executeOperatorRegistrationOperations.call(this, items)];
      case 'aVSRegistration':
        return [await executeAVSRegistrationOperations.call(this, items)];
      case 'rewards':
        return [await executeRewardsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeRestakingOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('eigenlayerApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'stakeTokens': {
          const token = this.getNodeParameter('token', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const operator = this.getNodeParameter('operator', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/restaking/stake`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              token,
              amount,
              operator,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPositions': {
          const address = this.getNodeParameter('address', i) as string;
          const token = this.getNodeParameter('token', i) as string;

          let url = `${credentials.baseUrl}/restaking/positions/${address}`;
          const queryParams: string[] = [];

          if (token) {
            queryParams.push(`token=${encodeURIComponent(token)}`);
          }

          if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
          }

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllPositions': {
          const page = this.getNodeParameter('page', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;
          const token = this.getNodeParameter('token', i) as string;

          const queryParams: string[] = [];
          queryParams.push(`page=${page}`);
          queryParams.push(`limit=${limit}`);

          if (token) {
            queryParams.push(`token=${encodeURIComponent(token)}`);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/restaking/positions?${queryParams.join('&')}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updatePosition': {
          const positionId = this.getNodeParameter('positionId', i) as string;
          const operator = this.getNodeParameter('operator', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;

          const body: any = {};
          if (operator) body.operator = operator;
          if (amount) body.amount = amount;

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/restaking/positions/${positionId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'unstakeTokens': {
          const token = this.getNodeParameter('token', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const positionId = this.getNodeParameter('positionId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/restaking/unstake`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              token,
              amount,
              positionId,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.response) {
          throw new NodeApiError(this.getNode(), error.response.body || error.response, { 
            message: error.message,
            httpCode: error.response.statusCode?.toString() || 'unknown',
          });
        }
        throw new NodeOperationError(this.getNode(), error.message || 'Unknown error occurred');
      }
    }
  }

  return returnData;
}

async function executeDelegationOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('eigenlayerApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'delegateToOperator': {
          const operator = this.getNodeParameter('operator', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const token = this.getNodeParameter('token', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/delegation/delegate`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              operator,
              amount,
              token,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDelegations': {
          const address = this.getNodeParameter('address', i) as string;
          const operator = this.getNodeParameter('operator', i) as string;

          let url = `${credentials.baseUrl}/delegation/delegations/${address}`;
          const params: string[] = [];

          if (operator) {
            params.push(`operator=${encodeURIComponent(operator)}`);
          }

          if (params.length > 0) {
            url += `?${params.join('&')}`;
          }

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllDelegations': {
          const page = this.getNodeParameter('page', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;
          const operator = this.getNodeParameter('operator', i) as string;
          const status = this.getNodeParameter('status', i) as string;

          let url = `${credentials.baseUrl}/delegation/delegations`;
          const params: string[] = [];

          if (page) {
            params.push(`page=${page}`);
          }
          if (limit) {
            params.push(`limit=${limit}`);
          }
          if (operator) {
            params.push(`operator=${encodeURIComponent(operator)}`);
          }
          if (status) {
            params.push(`status=${status}`);
          }

          if (params.length > 0) {
            url += `?${params.join('&')}`;
          }

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateDelegation': {
          const delegationId = this.getNodeParameter('delegationId', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const operator = this.getNodeParameter('operator', i) as string;

          const body: any = { amount };
          if (operator) {
            body.operator = operator;
          }

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/delegation/delegations/${delegationId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'undelegateFromOperator': {
          const delegationId = this.getNodeParameter('delegationId', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/delegation/undelegate`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              delegationId,
              amount,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.response) {
          throw new NodeApiError(this.getNode(), error.response.body || error.response, { 
            message: error.message,
            httpCode: error.response.statusCode?.toString() || 'unknown',
          });
        }
        throw new NodeOperationError(this.getNode(), error.message || 'Unknown error occurred');
      }
    }
  }

  return returnData;
}

async function executeEigenPodsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('eigenlayerApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createEigenPod': {
					const owner = this.getNodeParameter('owner', i) as string;
					const withdrawalCredentials = this.getNodeParameter('withdrawalCredentials', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/eigenpods/create`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							owner,
							withdrawalCredentials,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getEigenPod': {
					const podAddress = this.getNodeParameter('podAddress', i) as string;
					const includeValidators = this.getNodeParameter('includeValidators', i) as boolean;

					const queryParams: any = {};
					if (includeValidators) {
						queryParams.includeValidators = 'true';
					}

					const queryString = new URLSearchParams(queryParams).toString();
					const url = `${credentials.baseUrl}/eigenpods/${podAddress}${queryString ? `?${queryString}` : ''}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllEigenPods': {
					const page = this.getNodeParameter('page', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;
					const ownerFilter = this.getNodeParameter('ownerFilter', i) as string;
					const statusFilter = this.getNodeParameter('statusFilter', i) as string;

					const queryParams: any = {
						page: page.toString(),
						limit: limit.toString(),
					};

					if (ownerFilter) {
						queryParams.owner = ownerFilter;
					}
					if (statusFilter) {
						queryParams.status = statusFilter;
					}

					const queryString = new URLSearchParams(queryParams).toString();
					const url = `${credentials.baseUrl}/eigenpods?${queryString}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'verifyValidators': {
					const podAddress = this.getNodeParameter('podAddress', i) as string;
					const validatorIndices = this.getNodeParameter('validatorIndices', i) as string;
					const proofs = this.getNodeParameter('proofs', i) as string;

					let parsedProofs: any;
					try {
						parsedProofs = typeof proofs === 'string' ? JSON.parse(proofs) : proofs;
					} catch (error: any) {
						throw new NodeOperationError(this.getNode(), `Invalid JSON in proofs parameter: ${error.message}`, { itemIndex: i });
					}

					const indices = validatorIndices.split(',').map(index => parseInt(index.trim(), 10));

					const options: any = {
						method: 'PATCH',
						url: `${credentials.baseUrl}/eigenpods/${podAddress}/verify`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							validatorIndices: indices,
							proofs: parsedProofs,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'withdrawFromEigenPod': {
					const podAddress = this.getNodeParameter('podAddress', i) as string;
					const amount = this.getNodeParameter('amount', i) as string;
					const recipient = this.getNodeParameter('recipient', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/eigenpods/${podAddress}/withdraw`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							amount,
							recipient,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
        if (error.response) {
          throw new NodeApiError(this.getNode(), error.response.body || error.response, { 
            message: error.message,
            httpCode: error.response.statusCode?.toString() || 'unknown',
          });
        }
        throw new NodeOperationError(this.getNode(), error.message || 'Unknown error occurred');
			}
		}
	}

	return returnData;
}

async function executeOperatorRegistrationOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('eigenlayerApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'registerOperator': {
          const operatorAddress = this.getNodeParameter('operatorAddress', i) as string;
          const metadataURI = this.getNodeParameter('metadataURI', i) as string;
          const delegationApprover = this.getNodeParameter('delegationApprover', i) as string;

          const body: any = {
            operatorAddress,
            metadataURI,
          };

          if (delegationApprover) {
            body.delegationApprover = delegationApprover;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/operators/register`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOperator': {
          const operatorAddress = this.getNodeParameter('operatorAddress', i) as string;
          const includeAVS = this.getNodeParameter('includeAVS', i) as boolean;

          const queryParams = new URLSearchParams();
          if (includeAVS) {
            queryParams.append('includeAVS', 'true');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/operators/${operatorAddress}${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllOperators': {
          const page = this.getNodeParameter('page', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;
          const status = this.getNodeParameter('status', i) as string;
          const minStake = this.getNodeParameter('minStake', i) as string;

          const queryParams = new URLSearchParams();
          queryParams.append('page', page.toString());
          queryParams.append('limit', limit.toString());

          if (status) {
            queryParams.append('status', status);
          }
          if (minStake) {
            queryParams.append('minStake', minStake);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/operators?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateOperator': {
          const operatorAddress = this.getNodeParameter('operatorAddress', i) as string;
          const metadataURI = this.getNodeParameter('metadataURI', i) as string;
          const delegationApprover = this.getNodeParameter('delegationApprover', i) as string;

          const body: any = {};

          if (metadataURI) {
            body.metadataURI = metadataURI;
          }
          if (delegationApprover) {
            body.delegationApprover = delegationApprover;
          }

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/operators/${operatorAddress}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deregisterOperator': {
          const operatorAddress = this.getNodeParameter('operatorAddress', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/operators/${operatorAddress}/deregister`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.response) {
          throw new NodeApiError(this.getNode(), error.response.body || error.response, { 
            message: error.message,
            httpCode: error.response.statusCode?.toString() || 'unknown',
          });
        }
        throw new NodeOperationError(this.getNode(), error.message || 'Unknown error occurred');
      }
    }
  }

  return returnData;
}

async function executeAVSRegistrationOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('eigenlayerApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'registerAVS': {
          const avsAddress = this.getNodeParameter('avsAddress', i) as string;
          const metadataURI = this.getNodeParameter('metadataURI', i) as string;
          const rewardToken = this.getNodeParameter('rewardToken', i) as string;

          const body = {
            avsAddress,
            metadataURI,
            rewardToken,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/avs/register`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAVS': {
          const avsAddress = this.getNodeParameter('avsAddress', i) as string;
          const includeOperators = this.getNodeParameter('includeOperators', i) as boolean;

          const queryParams: any = {};
          if (includeOperators) {
            queryParams.includeOperators = 'true';
          }

          const queryString = Object.keys(queryParams).length > 0 
            ? '?' + new URLSearchParams(queryParams).toString() 
            : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/avs/${avsAddress}${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllAVS': {
          const page = this.getNodeParameter('page', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;
          const category = this.getNodeParameter('category', i) as string;
          const minStake = this.getNodeParameter('minStake', i) as string;

          const queryParams: any = {
            page: page.toString(),
            limit: limit.toString(),
          };

          if (category) {
            queryParams.category = category;
          }
          if (minStake) {
            queryParams.minStake = minStake;
          }

          const queryString = '?' + new URLSearchParams(queryParams).toString();