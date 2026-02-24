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
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Operators',
            value: 'operators',
          },
          {
            name: 'Delegations',
            value: 'delegations',
          },
          {
            name: 'EigenPods',
            value: 'eigenPods',
          },
          {
            name: 'AVS',
            value: 'aVS',
          },
          {
            name: 'Restaking',
            value: 'restaking',
          },
          {
            name: 'Rewards',
            value: 'rewards',
          }
        ],
        default: 'operators',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['operators'],
    },
  },
  options: [
    {
      name: 'Get All Operators',
      value: 'getAllOperators',
      description: 'Retrieve list of all operators',
      action: 'Get all operators',
    },
    {
      name: 'Get Operator',
      value: 'getOperator',
      description: 'Get specific operator details',
      action: 'Get operator details',
    },
    {
      name: 'Get Operator Delegations',
      value: 'getOperatorDelegations',
      description: 'Get delegations for an operator',
      action: 'Get operator delegations',
    },
    {
      name: 'Get Operator AVS',
      value: 'getOperatorAVS',
      description: 'Get AVS registrations for an operator',
      action: 'Get operator AVS registrations',
    },
  ],
  default: 'getAllOperators',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['delegations'],
    },
  },
  options: [
    {
      name: 'Get All Delegations',
      value: 'getAllDelegations',
      description: 'Retrieve all delegations',
      action: 'Get all delegations',
    },
    {
      name: 'Get Staker Delegations',
      value: 'getStakerDelegations',
      description: 'Get delegations for a specific staker',
      action: 'Get staker delegations',
    },
    {
      name: 'Get Delegated Operator',
      value: 'getDelegatedOperator',
      description: 'Get operator that staker has delegated to',
      action: 'Get delegated operator',
    },
    {
      name: 'Get Delegation Rewards',
      value: 'getDelegationRewards',
      description: 'Get delegation reward information',
      action: 'Get delegation rewards',
    },
  ],
  default: 'getAllDelegations',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['eigenPods'],
    },
  },
  options: [
    {
      name: 'Get All EigenPods',
      value: 'getAllEigenPods',
      description: 'Retrieve list of EigenPods',
      action: 'Get all EigenPods',
    },
    {
      name: 'Get EigenPod',
      value: 'getEigenPod',
      description: 'Get specific EigenPod details',
      action: 'Get EigenPod details',
    },
    {
      name: 'Get EigenPod Validators',
      value: 'getEigenPodValidators',
      description: 'Get validators for an EigenPod',
      action: 'Get EigenPod validators',
    },
    {
      name: 'Get EigenPod Withdrawals',
      value: 'getEigenPodWithdrawals',
      description: 'Get withdrawal history for EigenPod',
      action: 'Get EigenPod withdrawals',
    },
  ],
  default: 'getAllEigenPods',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['aVS'],
    },
  },
  options: [
    {
      name: 'Get All AVS',
      value: 'getAllAVS',
      description: 'Retrieve list of all Actively Validated Services',
      action: 'Get all AVS',
    },
    {
      name: 'Get AVS',
      value: 'getAVS',
      description: 'Get specific AVS details by address',
      action: 'Get AVS details',
    },
    {
      name: 'Get AVS Operators',
      value: 'getAVSOperators',
      description: 'Get operators registered to an AVS',
      action: 'Get AVS operators',
    },
    {
      name: 'Get AVS Rewards',
      value: 'getAVSRewards',
      description: 'Get reward information for an AVS',
      action: 'Get AVS rewards',
    },
  ],
  default: 'getAllAVS',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['restaking'],
    },
  },
  options: [
    {
      name: 'Get Strategies',
      value: 'getStrategies',
      description: 'Get available restaking strategies',
      action: 'Get available restaking strategies',
    },
    {
      name: 'Get Deposits',
      value: 'getDeposits',
      description: 'Get deposit history',
      action: 'Get deposit history',
    },
    {
      name: 'Get Withdrawals',
      value: 'getWithdrawals',
      description: 'Get withdrawal history',
      action: 'Get withdrawal history',
    },
    {
      name: 'Get Staker Balances',
      value: 'getStakerBalances',
      description: 'Get staking balances for a staker',
      action: 'Get staker balances',
    },
  ],
  default: 'getStrategies',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['rewards'],
    },
  },
  options: [
    {
      name: 'Get All Rewards',
      value: 'getAllRewards',
      description: 'Get rewards across the protocol',
      action: 'Get all rewards',
    },
    {
      name: 'Get Address Rewards',
      value: 'getAddressRewards',
      description: 'Get rewards for specific address',
      action: 'Get address rewards',
    },
    {
      name: 'Get Reward Distributions',
      value: 'getRewardDistributions',
      description: 'Get reward distribution events',
      action: 'Get reward distributions',
    },
    {
      name: 'Get Reward Claims',
      value: 'getRewardClaims',
      description: 'Get reward claim history',
      action: 'Get reward claims',
    },
  ],
  default: 'getAllRewards',
},
      // Parameter definitions
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['operators'],
      operation: ['getAllOperators'],
    },
  },
  default: 100,
  description: 'Maximum number of operators to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['operators'],
      operation: ['getAllOperators'],
    },
  },
  default: 0,
  description: 'Number of operators to skip',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['operators'],
      operation: ['getAllOperators'],
    },
  },
  options: [
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Inactive',
      value: 'inactive',
    },
  ],
  default: '',
  description: 'Filter operators by status',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['operators'],
      operation: ['getOperator'],
    },
  },
  default: '',
  description: 'The Ethereum address of the operator',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['operators'],
      operation: ['getOperatorDelegations'],
    },
  },
  default: '',
  description: 'The Ethereum address of the operator',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['operators'],
      operation: ['getOperatorDelegations'],
    },
  },
  default: 100,
  description: 'Maximum number of delegations to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['operators'],
      operation: ['getOperatorDelegations'],
    },
  },
  default: 0,
  description: 'Number of delegations to skip',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['operators'],
      operation: ['getOperatorAVS'],
    },
  },
  default: '',
  description: 'The Ethereum address of the operator',
},
{
  displayName: 'Staker Address',
  name: 'staker',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['delegations'],
      operation: ['getAllDelegations'],
    },
  },
  default: '',
  description: 'Filter delegations by staker address',
},
{
  displayName: 'Operator Address',
  name: 'operator',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['delegations'],
      operation: ['getAllDelegations'],
    },
  },
  default: '',
  description: 'Filter delegations by operator address',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['delegations'],
      operation: ['getAllDelegations'],
    },
  },
  default: 100,
  description: 'Maximum number of delegations to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['delegations'],
      operation: ['getAllDelegations'],
    },
  },
  default: 0,
  description: 'Number of delegations to skip',
},
{
  displayName: 'Staker Address',
  name: 'staker',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegations'],
      operation: ['getStakerDelegations'],
    },
  },
  default: '',
  description: 'The staker address to get delegations for',
  placeholder: '0x1234567890123456789012345678901234567890',
},
{
  displayName: 'Staker Address',
  name: 'staker',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegations'],
      operation: ['getDelegatedOperator'],
    },
  },
  default: '',
  description: 'The staker address to get the delegated operator for',
  placeholder: '0x1234567890123456789012345678901234567890',
},
{
  displayName: 'Staker Address',
  name: 'staker',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['delegations'],
      operation: ['getDelegationRewards'],
    },
  },
  default: '',
  description: 'Filter rewards by staker address',
  placeholder: '0x1234567890123456789012345678901234567890',
},
{
  displayName: 'Operator Address',
  name: 'operator',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['delegations'],
      operation: ['getDelegationRewards'],
    },
  },
  default: '',
  description: 'Filter rewards by operator address',
  placeholder: '0x1234567890123456789012345678901234567890',
},
{
  displayName: 'Owner Address',
  name: 'owner',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['eigenPods'],
      operation: ['getAllEigenPods'],
    },
  },
  default: '',
  description: 'Filter EigenPods by owner address',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['eigenPods'],
      operation: ['getAllEigenPods'],
    },
  },
  options: [
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Inactive',
      value: 'inactive',
    },
    {
      name: 'All',
      value: '',
    },
  ],
  default: '',
  description: 'Filter EigenPods by status',
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
  typeOptions: {
    minValue: 1,
    maxValue: 1000,
  },
  default: 100,
  description: 'Maximum number of EigenPods to retrieve',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['eigenPods'],
      operation: ['getAllEigenPods'],
    },
  },
  typeOptions: {
    minValue: 0,
  },
  default: 0,
  description: 'Number of EigenPods to skip',
},
{
  displayName: 'EigenPod Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['eigenPods'],
      operation: ['getEigenPod'],
    },
  },
  default: '',
  description: 'The EigenPod contract address',
  placeholder: '0x...',
},
{
  displayName: 'EigenPod Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['eigenPods'],
      operation: ['getEigenPodValidators'],
    },
  },
  default: '',
  description: 'The EigenPod contract address',
  placeholder: '0x...',
},
{
  displayName: 'Validator Status',
  name: 'validatorStatus',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['eigenPods'],
      operation: ['getEigenPodValidators'],
    },
  },
  options: [
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Exited',
      value: 'exited',
    },
    {
      name: 'Slashed',
      value: 'slashed',
    },
    {
      name: 'All',
      value: '',
    },
  ],
  default: '',
  description: 'Filter validators by status',
},
{
  displayName: 'EigenPod Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['eigenPods'],
      operation: ['getEigenPodWithdrawals'],
    },
  },
  default: '',
  description: 'The EigenPod contract address',
  placeholder: '0x...',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['aVS'],
      operation: ['getAllAVS'],
    },
  },
  default: 100,
  description: 'Maximum number of AVS to return',
  typeOptions: {
    minValue: 1,
    maxValue: 1000,
  },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['aVS'],
      operation: ['getAllAVS'],
    },
  },
  default: 0,
  description: 'Number of AVS to skip',
  typeOptions: {
    minValue: 0,
  },
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['aVS'],
      operation: ['getAllAVS'],
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
  ],
  default: '',
  description: 'Filter AVS by status',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['aVS'],
      operation: ['getAVS'],
    },
  },
  default: '',
  description: 'The Ethereum address of the AVS',
  placeholder: '0x...',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['aVS'],
      operation: ['getAVSOperators'],
    },
  },
  default: '',
  description: 'The Ethereum address of the AVS',
  placeholder: '0x...',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['aVS'],
      operation: ['getAVSOperators'],
    },
  },
  default: 100,
  description: 'Maximum number of operators to return',
  typeOptions: {
    minValue: 1,
    maxValue: 1000,
  },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['aVS'],
      operation: ['getAVSOperators'],
    },
  },
  default: 0,
  description: 'Number of operators to skip',
  typeOptions: {
    minValue: 0,
  },
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['aVS'],
      operation: ['getAVSRewards'],
    },
  },
  default: '',
  description: 'The Ethereum address of the AVS',
  placeholder: '0x...',
},
{
  displayName: 'Epoch',
  name: 'epoch',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['aVS'],
      operation: ['getAVSRewards'],
    },
  },
  default: 0,
  description: 'The epoch number for reward information. If 0, returns latest epoch',
  typeOptions: {
    minValue: 0,
  },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['restaking'],
      operation: ['getStrategies'],
    },
  },
  default: 100,
  description: 'Maximum number of strategies to return',
  typeOptions: {
    minValue: 1,
    maxValue: 1000,
  },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['restaking'],
      operation: ['getStrategies'],
    },
  },
  default: 0,
  description: 'Number of strategies to skip',
  typeOptions: {
    minValue: 0,
  },
},
{
  displayName: 'Staker Address',
  name: 'staker',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['restaking'],
      operation: ['getDeposits'],
    },
  },
  default: '',
  description: 'Ethereum address of the staker to filter deposits',
  placeholder: '0x...',
},
{
  displayName: 'Strategy Address',
  name: 'strategy',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['restaking'],
      operation: ['getDeposits'],
    },
  },
  default: '',
  description: 'Strategy contract address to filter deposits',
  placeholder: '0x...',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['restaking'],
      operation: ['getDeposits'],
    },
  },
  default: 100,
  description: 'Maximum number of deposits to return',
  typeOptions: {
    minValue: 1,
    maxValue: 1000,
  },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['restaking'],
      operation: ['getDeposits'],
    },
  },
  default: 0,
  description: 'Number of deposits to skip',
  typeOptions: {
    minValue: 0,
  },
},
{
  displayName: 'Staker Address',
  name: 'staker',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['restaking'],
      operation: ['getWithdrawals'],
    },
  },
  default: '',
  description: 'Ethereum address of the staker to filter withdrawals',
  placeholder: '0x...',
},
{
  displayName: 'Strategy Address',
  name: 'strategy',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['restaking'],
      operation: ['getWithdrawals'],
    },
  },
  default: '',
  description: 'Strategy contract address to filter withdrawals',
  placeholder: '0x...',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['restaking'],
      operation: ['getWithdrawals'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'Pending',
      value: 'pending',
    },
    {
      name: 'Completed',
      value: 'completed',
    },
    {
      name: 'Failed',
      value: 'failed',
    },
  ],
  default: '',
  description: 'Filter withdrawals by status',
},
{
  displayName: 'Staker Address',
  name: 'staker',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['restaking'],
      operation: ['getStakerBalances'],
    },
  },
  default: '',
  description: 'Ethereum address of the staker',
  placeholder: '0x...',
},
{
  displayName: 'Strategy Address',
  name: 'strategy',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['restaking'],
      operation: ['getStakerBalances'],
    },
  },
  default: '',
  description: 'Strategy contract address to filter balances',
  placeholder: '0x...',
},
{
  displayName: 'Recipient',
  name: 'recipient',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getAllRewards'],
    },
  },
  default: '',
  description: 'Filter rewards by recipient address',
},
{
  displayName: 'AVS',
  name: 'avs',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getAllRewards'],
    },
  },
  default: '',
  description: 'Filter rewards by AVS address',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getAllRewards'],
    },
  },
  default: 100,
  description: 'Maximum number of records to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getAllRewards'],
    },
  },
  default: 0,
  description: 'Number of records to skip',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getAddressRewards'],
    },
  },
  default: '',
  description: 'The Ethereum address to get rewards for',
},
{
  displayName: 'Epoch',
  name: 'epoch',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getAddressRewards', 'getRewardDistributions'],
    },
  },
  default: 0,
  description: 'Filter by specific epoch',
},
{
  displayName: 'AVS',
  name: 'avs',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getRewardDistributions'],
    },
  },
  default: '',
  description: 'Filter distributions by AVS address',
},
{
  displayName: 'Recipient',
  name: 'recipient',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getRewardClaims'],
    },
  },
  default: '',
  description: 'Filter claims by recipient address',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'Pending',
      value: 'pending',
    },
    {
      name: 'Completed',
      value: 'completed',
    },
    {
      name: 'Failed',
      value: 'failed',
    },
  ],
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getRewardClaims'],
    },
  },
  default: '',
  description: 'Filter claims by status',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'operators':
        return [await executeOperatorsOperations.call(this, items)];
      case 'delegations':
        return [await executeDelegationsOperations.call(this, items)];
      case 'eigenPods':
        return [await executeEigenPodsOperations.call(this, items)];
      case 'aVS':
        return [await executeAVSOperations.call(this, items)];
      case 'restaking':
        return [await executeRestakingOperations.call(this, items)];
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

async function executeOperatorsOperations(
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
        case 'getAllOperators': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const status = this.getNodeParameter('status', i) as string;

          const queryParams: any = {};
          if (limit) queryParams.limit = limit.toString();
          if (offset) queryParams.offset = offset.toString();
          if (status) queryParams.status = status;

          const queryString = new URLSearchParams(queryParams).toString();
          const url = queryString ? 
            `${credentials.baseUrl}/operators?${queryString}` : 
            `${credentials.baseUrl}/operators`;

          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOperator': {
          const address = this.getNodeParameter('address', i) as string;

          if (!address) {
            throw new NodeOperationError(this.getNode(), 'Address is required');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/operators/${address}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOperatorDelegations': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          if (!address) {
            throw new NodeOperationError(this.getNode(), 'Address is required');
          }

          const queryParams: any = {};
          if (limit) queryParams.limit = limit.toString();
          if (offset) queryParams.offset = offset.toString();

          const queryString = new URLSearchParams(queryParams).toString();
          const url = queryString ? 
            `${credentials.baseUrl}/operators/${address}/delegations?${queryString}` : 
            `${credentials.baseUrl}/operators/${address}/delegations`;

          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOperatorAVS': {
          const address = this.getNodeParameter('address', i) as string;

          if (!address) {
            throw new NodeOperationError(this.getNode(), 'Address is required');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/operators/${address}/avs`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
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
          json: { error: error.message || 'Unknown error occurred' },
          pairedItem: { item: i }
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

async function executeDelegationsOperations(
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
        case 'getAllDelegations': {
          const staker = this.getNodeParameter('staker', i, '') as string;
          const operator = this.getNodeParameter('operator', i, '') as string;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams: any = {};
          if (staker) queryParams.staker = staker;
          if (operator) queryParams.operator = operator;
          if (limit) queryParams.limit = limit.toString();
          if (offset) queryParams.offset = offset.toString();

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/delegations${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getStakerDelegations': {
          const staker = this.getNodeParameter('staker', i) as string;
          
          if (!staker) {
            throw new NodeOperationError(this.getNode(), 'Staker address is required');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/delegations/${staker}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDelegatedOperator': {
          const staker = this.getNodeParameter('staker', i) as string;
          
          if (!staker) {
            throw new NodeOperationError(this.getNode(), 'Staker address is required');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/delegations/${staker}/operator`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDelegationRewards': {
          const staker = this.getNodeParameter('staker', i, '') as string;
          const operator = this.getNodeParameter('operator', i, '') as string;

          const queryParams: any = {};
          if (staker) queryParams.staker = staker;
          if (operator) queryParams.operator = operator;

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/delegations/rewards${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
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
        pairedItem: { item: i } 
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
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
        case 'getAllEigenPods': {
          const owner = this.getNodeParameter('owner', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const params = new URLSearchParams();
          if (owner) params.append('owner', owner);
          if (status) params.append('status', status);
          params.append('limit', limit.toString());
          params.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/eigenpods?${params.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getEigenPod': {
          const address = this.getNodeParameter('address', i) as string;

          if (!address || !address.startsWith('0x')) {
            throw new NodeOperationError(
              this.getNode(),
              'Invalid EigenPod address. Must be a valid Ethereum address starting with 0x',
            );
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/eigenpods/${address}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getEigenPodValidators': {
          const address = this.getNodeParameter('address', i) as string;
          const validatorStatus = this.getNodeParameter('validatorStatus', i) as string;

          if (!address || !address.startsWith('0x')) {
            throw new NodeOperationError(
              this.getNode(),
              'Invalid EigenPod address. Must be a valid Ethereum address starting with 0x',
            );
          }

          const params = new URLSearchParams();
          if (validatorStatus) params.append('status', validatorStatus);

          const queryString = params.toString() ? `?${params.toString()}` : '';
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/eigenpods/${address}/validators${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getEigenPodWithdrawals': {
          const address = this.getNodeParameter('address', i) as string;

          if (!address || !address.startsWith('0x')) {
            throw new NodeOperationError(
              this.getNode(),
              'Invalid EigenPod address. Must be a valid Ethereum address starting with 0x',
            );
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/eigenpods/${address}/withdrawals`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
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
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeAVSOperations(
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
        case 'getAllAVS': {
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          const status = this.getNodeParameter('status', i, '') as string;

          const queryParams: any = {
            limit: limit.toString(),
            offset: offset.toString(),
          };

          if (status) {
            queryParams.status = status;
          }

          const queryString = new URLSearchParams(queryParams).toString();

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/avs?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAVS': {
          const address = this.getNodeParameter('address', i) as string;

          if (!address) {
            throw new NodeOperationError(this.getNode(), 'AVS address is required');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/avs/${address}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAVSOperators': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          if (!address) {
            throw new NodeOperationError(this.getNode(), 'AVS address is required');
          }

          const queryParams = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/avs/${address}/operators?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAVSRewards': {
          const address = this.getNodeParameter('address', i) as string;
          const epoch = this.getNodeParameter('epoch', i, 0) as number;

          if (!address) {
            throw new NodeOperationError(this.getNode(), 'AVS address is required');
          }

          const queryParams: any = {};
          if (epoch > 0) {
            queryParams.epoch = epoch.toString();
          }

          const queryString = Object.keys(queryParams).length > 0 
            ? `?${new URLSearchParams(queryParams).toString()}`
            : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/avs/${address}/rewards${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
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
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

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
        case 'getStrategies': {
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams = new URLSearchParams();
          if (limit) queryParams.append('limit', limit.toString());
          if (offset) queryParams.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/restaking/strategies${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDeposits': {
          const staker = this.getNodeParameter('staker', i, '') as string;
          const strategy = this.getNodeParameter('strategy', i, '') as string;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams = new URLSearchParams();
          if (staker) queryParams.append('staker', staker);
          if (strategy) queryParams.append('strategy', strategy);
          if (limit) queryParams.append('limit', limit.toString());
          if (offset) queryParams.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/restaking/deposits${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getWithdrawals': {
          const staker = this.getNodeParameter('staker', i, '') as string;
          const strategy = this.getNodeParameter('strategy', i, '') as string;
          const status = this.getNodeParameter('status', i, '') as string;

          const queryParams = new URLSearchParams();
          if (staker) queryParams.append('staker', staker);
          if (strategy) queryParams.append('strategy', strategy);
          if (status) queryParams.append('status', status);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/restaking/withdrawals${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getStakerBalances': {
          const staker = this.getNodeParameter('staker', i) as string;
          const strategy = this.getNodeParameter('strategy', i, '') as string;

          if (!staker) {
            throw new NodeOperationError(this.getNode(), 'Staker address is required');
          }

          const queryParams = new URLSearchParams();
          if (strategy) queryParams.append('strategy', strategy);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/restaking/balances/${staker}${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
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
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeRewardsOperations(
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
        case 'getAllRewards': {
          const recipient = this.getNodeParameter('recipient', i) as string;
          const avs = this.getNodeParameter('avs', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const params = new URLSearchParams();
          if (recipient) params.append('recipient', recipient);
          if (avs) params.append('avs', avs);
          if (limit) params.append('limit', limit.toString());
          if (offset) params.append('offset', offset.toString());

          const queryString = params.toString();
          const url = `${credentials.baseUrl}/rewards${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAddressRewards': {
          const address = this.getNodeParameter('address', i) as string;
          const epoch = this.getNodeParameter('epoch', i) as number;

          const params = new URLSearchParams();
          if (epoch) params.append('epoch', epoch.toString());

          const queryString = params.toString();
          const url = `${credentials.baseUrl}/rewards/${address}${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getRewardDistributions': {
          const avs = this.getNodeParameter('avs', i) as string;
          const epoch = this.getNodeParameter('epoch', i) as number;

          const params = new URLSearchParams();
          if (avs) params.append('avs', avs);
          if (epoch) params.append('epoch', epoch.toString());

          const queryString = params.toString();
          const url = `${credentials.baseUrl}/rewards/distributions${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getRewardClaims': {
          const recipient = this.getNodeParameter('recipient', i) as string;
          const status = this.getNodeParameter('status', i) as string;

          const params = new URLSearchParams();
          if (recipient) params.append('recipient', recipient);
          if (status) params.append('status', status);

          const queryString = params.toString();
          const url = `${credentials.baseUrl}/rewards/claims${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
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
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}
