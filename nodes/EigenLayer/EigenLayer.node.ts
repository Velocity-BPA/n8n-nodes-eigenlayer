/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Strategy Manager operations
import { getStakerDeposits } from './actions/strategyManager/getStakerDeposits.operation';
import { getStakerStrategyShares } from './actions/strategyManager/getStakerStrategyShares.operation';
import { depositIntoStrategy } from './actions/strategyManager/depositIntoStrategy.operation';

// Delegation Manager operations
import { getDelegatedOperator } from './actions/delegationManager/getDelegatedOperator.operation';
import { isDelegated } from './actions/delegationManager/isDelegated.operation';
import { isOperator } from './actions/delegationManager/isOperator.operation';
import { getOperatorDetails } from './actions/delegationManager/getOperatorDetails.operation';
import { getOperatorShares } from './actions/delegationManager/getOperatorShares.operation';
import { getWithdrawableShares } from './actions/delegationManager/getWithdrawableShares.operation';
import { registerAsOperator } from './actions/delegationManager/registerAsOperator.operation';
import { delegateTo } from './actions/delegationManager/delegateTo.operation';
import { undelegate } from './actions/delegationManager/undelegate.operation';
import { queueWithdrawals } from './actions/delegationManager/queueWithdrawals.operation';
import { completeQueuedWithdrawal } from './actions/delegationManager/completeQueuedWithdrawal.operation';

// EigenPod Manager operations
import { getEigenPod } from './actions/eigenPodManager/getEigenPod.operation';
import { hasPod } from './actions/eigenPodManager/hasPod.operation';
import { getPodOwnerShares } from './actions/eigenPodManager/getPodOwnerShares.operation';
import { createPod } from './actions/eigenPodManager/createPod.operation';
import { stake } from './actions/eigenPodManager/stake.operation';

// EigenPod operations
import { getPodOwner } from './actions/eigenPod/getPodOwner.operation';
import { getValidatorStatus } from './actions/eigenPod/getValidatorStatus.operation';
import { activateRestaking } from './actions/eigenPod/activateRestaking.operation';

// AVS Directory operations
import { getOperatorAvsStatus } from './actions/avsDirectory/getOperatorAvsStatus.operation';
import { registerOperatorToAvs } from './actions/avsDirectory/registerOperatorToAvs.operation';
import { deregisterOperatorFromAvs } from './actions/avsDirectory/deregisterOperatorFromAvs.operation';

// Rewards Coordinator operations
import { getCumulativeClaimed } from './actions/rewardsCoordinator/getCumulativeClaimed.operation';
import { getClaimerFor } from './actions/rewardsCoordinator/getClaimerFor.operation';
import { processClaim } from './actions/rewardsCoordinator/processClaim.operation';
import { setClaimerFor } from './actions/rewardsCoordinator/setClaimerFor.operation';

// Allocation Manager operations
import { getEncumberedMagnitude } from './actions/allocationManager/getEncumberedMagnitude.operation';
import { getAllocation } from './actions/allocationManager/getAllocation.operation';
import { modifyAllocations } from './actions/allocationManager/modifyAllocations.operation';

// Strategy operations
import { getTotalShares } from './actions/strategy/getTotalShares.operation';
import { getUnderlyingToken } from './actions/strategy/getUnderlyingToken.operation';
import { sharesToUnderlying } from './actions/strategy/sharesToUnderlying.operation';
import { underlyingToShares } from './actions/strategy/underlyingToShares.operation';

// Multicall operations
import { batchRead } from './actions/multicall/batchRead.operation';
import { getStakerPortfolio } from './actions/multicall/getStakerPortfolio.operation';
import { getOperatorSummary } from './actions/multicall/getOperatorSummary.operation';

export class EigenLayer implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'EigenLayer',
		name: 'eigenLayer',
		icon: 'file:eigenlayer.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the EigenLayer restaking protocol',
		defaults: {
			name: 'EigenLayer',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'ethereumRpc',
				required: true,
			},
			{
				name: 'ethereumWallet',
				required: false,
				displayOptions: {
					show: {
						operation: [
							'depositIntoStrategy',
							'registerAsOperator',
							'delegateTo',
							'undelegate',
							'queueWithdrawals',
							'completeQueuedWithdrawal',
							'createPod',
							'stake',
							'activateRestaking',
							'registerOperatorToAvs',
							'deregisterOperatorFromAvs',
							'processClaim',
							'setClaimerFor',
							'modifyAllocations',
						],
					},
				},
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
						name: 'Strategy Manager',
						value: 'strategyManager',
						description: 'Manage strategy deposits and withdrawals',
					},
					{
						name: 'Delegation Manager',
						value: 'delegationManager',
						description: 'Manage delegations and operators',
					},
					{
						name: 'EigenPod Manager',
						value: 'eigenPodManager',
						description: 'Manage EigenPods for native ETH restaking',
					},
					{
						name: 'EigenPod',
						value: 'eigenPod',
						description: 'Individual EigenPod operations',
					},
					{
						name: 'AVS Directory',
						value: 'avsDirectory',
						description: 'Manage AVS registrations',
					},
					{
						name: 'Rewards Coordinator',
						value: 'rewardsCoordinator',
						description: 'Claim and manage rewards',
					},
					{
						name: 'Allocation Manager',
						value: 'allocationManager',
						description: 'Manage stake allocations and slashing',
					},
					{
						name: 'Strategy',
						value: 'strategy',
						description: 'Query individual strategy data',
					},
					{
						name: 'Multicall',
						value: 'multicall',
						description: 'Batch operations and aggregated queries',
					},
				],
				default: 'strategyManager',
			},
			// Strategy Manager Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['strategyManager'],
					},
				},
				options: [
					{
						name: 'Get Staker Deposits',
						value: 'getStakerDeposits',
						description: 'Get all strategy deposits for an address',
						action: 'Get staker deposits',
					},
					{
						name: 'Get Staker Strategy Shares',
						value: 'getStakerStrategyShares',
						description: 'Get shares in a specific strategy',
						action: 'Get staker strategy shares',
					},
					{
						name: 'Deposit Into Strategy',
						value: 'depositIntoStrategy',
						description: 'Deposit tokens into a whitelisted strategy',
						action: 'Deposit into strategy',
					},
				],
				default: 'getStakerDeposits',
			},
			// Delegation Manager Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['delegationManager'],
					},
				},
				options: [
					{
						name: 'Get Delegated Operator',
						value: 'getDelegatedOperator',
						description: 'Get the operator address a staker is delegated to',
						action: 'Get delegated operator',
					},
					{
						name: 'Is Delegated',
						value: 'isDelegated',
						description: 'Check if a staker is delegated',
						action: 'Is delegated',
					},
					{
						name: 'Is Operator',
						value: 'isOperator',
						description: 'Check if an address is a registered operator',
						action: 'Is operator',
					},
					{
						name: 'Get Operator Details',
						value: 'getOperatorDetails',
						description: 'Get operator configuration and metadata',
						action: 'Get operator details',
					},
					{
						name: 'Get Operator Shares',
						value: 'getOperatorShares',
						description: 'Get total shares delegated to an operator',
						action: 'Get operator shares',
					},
					{
						name: 'Get Withdrawable Shares',
						value: 'getWithdrawableShares',
						description: 'Get shares available for withdrawal',
						action: 'Get withdrawable shares',
					},
					{
						name: 'Register As Operator',
						value: 'registerAsOperator',
						description: 'Register an address as an operator',
						action: 'Register as operator',
					},
					{
						name: 'Delegate To',
						value: 'delegateTo',
						description: 'Delegate restaked assets to an operator',
						action: 'Delegate to',
					},
					{
						name: 'Undelegate',
						value: 'undelegate',
						description: 'Remove delegation and queue withdrawal',
						action: 'Undelegate',
					},
					{
						name: 'Queue Withdrawals',
						value: 'queueWithdrawals',
						description: 'Initiate withdrawal escrow',
						action: 'Queue withdrawals',
					},
					{
						name: 'Complete Queued Withdrawal',
						value: 'completeQueuedWithdrawal',
						description: 'Finalize withdrawal after delay',
						action: 'Complete queued withdrawal',
					},
				],
				default: 'getDelegatedOperator',
			},
			// EigenPod Manager Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['eigenPodManager'],
					},
				},
				options: [
					{
						name: 'Get EigenPod',
						value: 'getEigenPod',
						description: "Get a staker's EigenPod address",
						action: 'Get eigenpod',
					},
					{
						name: 'Has Pod',
						value: 'hasPod',
						description: 'Check if a staker has deployed an EigenPod',
						action: 'Has pod',
					},
					{
						name: 'Get Pod Owner Shares',
						value: 'getPodOwnerShares',
						description: 'Get beacon chain ETH shares for a pod owner',
						action: 'Get pod owner shares',
					},
					{
						name: 'Create Pod',
						value: 'createPod',
						description: 'Deploy a new EigenPod',
						action: 'Create pod',
					},
					{
						name: 'Stake',
						value: 'stake',
						description: 'Stake ETH through EigenPod',
						action: 'Stake',
					},
				],
				default: 'getEigenPod',
			},
			// EigenPod Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['eigenPod'],
					},
				},
				options: [
					{
						name: 'Get Pod Owner',
						value: 'getPodOwner',
						description: 'Get the owner of an EigenPod',
						action: 'Get pod owner',
					},
					{
						name: 'Get Validator Status',
						value: 'getValidatorStatus',
						description: 'Get validator status by public key',
						action: 'Get validator status',
					},
					{
						name: 'Activate Restaking',
						value: 'activateRestaking',
						description: 'Enable restaking for an EigenPod',
						action: 'Activate restaking',
					},
				],
				default: 'getPodOwner',
			},
			// AVS Directory Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['avsDirectory'],
					},
				},
				options: [
					{
						name: 'Get Operator AVS Status',
						value: 'getOperatorAvsStatus',
						description: "Check an operator's AVS registration status",
						action: 'Get operator avs status',
					},
					{
						name: 'Register Operator To AVS',
						value: 'registerOperatorToAvs',
						description: 'Register an operator with an AVS',
						action: 'Register operator to avs',
					},
					{
						name: 'Deregister Operator From AVS',
						value: 'deregisterOperatorFromAvs',
						description: 'Deregister an operator from an AVS',
						action: 'Deregister operator from avs',
					},
				],
				default: 'getOperatorAvsStatus',
			},
			// Rewards Coordinator Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['rewardsCoordinator'],
					},
				},
				options: [
					{
						name: 'Get Cumulative Claimed',
						value: 'getCumulativeClaimed',
						description: 'Get total rewards claimed by an earner',
						action: 'Get cumulative claimed',
					},
					{
						name: 'Get Claimer For',
						value: 'getClaimerFor',
						description: 'Get the authorized claimer for an earner',
						action: 'Get claimer for',
					},
					{
						name: 'Process Claim',
						value: 'processClaim',
						description: 'Claim earned rewards with merkle proof',
						action: 'Process claim',
					},
					{
						name: 'Set Claimer For',
						value: 'setClaimerFor',
						description: 'Designate a claimer address',
						action: 'Set claimer for',
					},
				],
				default: 'getCumulativeClaimed',
			},
			// Allocation Manager Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['allocationManager'],
					},
				},
				options: [
					{
						name: 'Get Encumbered Magnitude',
						value: 'getEncumberedMagnitude',
						description: 'Get magnitude subject to slashing',
						action: 'Get encumbered magnitude',
					},
					{
						name: 'Get Allocation',
						value: 'getAllocation',
						description: 'Get stake allocation to an operator set',
						action: 'Get allocation',
					},
					{
						name: 'Modify Allocations',
						value: 'modifyAllocations',
						description: 'Modify AVS allocations',
						action: 'Modify allocations',
					},
				],
				default: 'getEncumberedMagnitude',
			},
			// Strategy Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['strategy'],
					},
				},
				options: [
					{
						name: 'Get Total Shares',
						value: 'getTotalShares',
						description: 'Get total shares in a strategy',
						action: 'Get total shares',
					},
					{
						name: 'Get Underlying Token',
						value: 'getUnderlyingToken',
						description: "Get the strategy's underlying token address",
						action: 'Get underlying token',
					},
					{
						name: 'Shares To Underlying',
						value: 'sharesToUnderlying',
						description: 'Convert shares to underlying token amount',
						action: 'Shares to underlying',
					},
					{
						name: 'Underlying To Shares',
						value: 'underlyingToShares',
						description: 'Convert underlying token amount to shares',
						action: 'Underlying to shares',
					},
				],
				default: 'getTotalShares',
			},
			// Multicall Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['multicall'],
					},
				},
				options: [
					{
						name: 'Batch Read',
						value: 'batchRead',
						description: 'Execute multiple read calls in a single request',
						action: 'Batch read',
					},
					{
						name: 'Get Staker Portfolio',
						value: 'getStakerPortfolio',
						description: 'Get all positions for an address',
						action: 'Get staker portfolio',
					},
					{
						name: 'Get Operator Summary',
						value: 'getOperatorSummary',
						description: 'Get complete operator data snapshot',
						action: 'Get operator summary',
					},
				],
				default: 'getStakerPortfolio',
			},
			// Common parameters
			{
				displayName: 'Staker Address',
				name: 'stakerAddress',
				type: 'string',
				default: '',
				placeholder: '0x...',
				description: 'The Ethereum address of the staker',
				displayOptions: {
					show: {
						operation: [
							'getStakerDeposits',
							'getStakerStrategyShares',
							'getDelegatedOperator',
							'isDelegated',
							'getWithdrawableShares',
							'delegateTo',
							'undelegate',
							'queueWithdrawals',
							'getStakerPortfolio',
						],
					},
				},
			},
			{
				displayName: 'Operator Address',
				name: 'operatorAddress',
				type: 'string',
				default: '',
				placeholder: '0x...',
				description: 'The Ethereum address of the operator',
				displayOptions: {
					show: {
						operation: [
							'isOperator',
							'getOperatorDetails',
							'getOperatorShares',
							'delegateTo',
							'getOperatorAvsStatus',
							'registerOperatorToAvs',
							'deregisterOperatorFromAvs',
							'getEncumberedMagnitude',
							'getAllocation',
							'modifyAllocations',
							'getOperatorSummary',
						],
					},
				},
			},
			{
				displayName: 'Strategy Address',
				name: 'strategyAddress',
				type: 'string',
				default: '',
				placeholder: '0x...',
				description: 'The Ethereum address of the strategy contract',
				displayOptions: {
					show: {
						operation: [
							'getStakerStrategyShares',
							'depositIntoStrategy',
							'getOperatorShares',
							'getTotalShares',
							'getUnderlyingToken',
							'sharesToUnderlying',
							'underlyingToShares',
							'getEncumberedMagnitude',
							'getAllocation',
						],
					},
				},
			},
			{
				displayName: 'Pod Owner Address',
				name: 'podOwnerAddress',
				type: 'string',
				default: '',
				placeholder: '0x...',
				description: 'The Ethereum address of the pod owner',
				displayOptions: {
					show: {
						operation: ['getEigenPod', 'hasPod', 'getPodOwnerShares'],
					},
				},
			},
			{
				displayName: 'EigenPod Address',
				name: 'eigenPodAddress',
				type: 'string',
				default: '',
				placeholder: '0x...',
				description: 'The Ethereum address of the EigenPod',
				displayOptions: {
					show: {
						operation: ['getPodOwner', 'getValidatorStatus', 'activateRestaking'],
					},
				},
			},
			{
				displayName: 'AVS Address',
				name: 'avsAddress',
				type: 'string',
				default: '',
				placeholder: '0x...',
				description: 'The Ethereum address of the AVS',
				displayOptions: {
					show: {
						operation: [
							'getOperatorAvsStatus',
							'registerOperatorToAvs',
							'deregisterOperatorFromAvs',
							'getAllocation',
						],
					},
				},
			},
			{
				displayName: 'Earner Address',
				name: 'earnerAddress',
				type: 'string',
				default: '',
				placeholder: '0x...',
				description: 'The Ethereum address of the reward earner',
				displayOptions: {
					show: {
						operation: ['getCumulativeClaimed', 'getClaimerFor', 'processClaim', 'setClaimerFor'],
					},
				},
			},
			{
				displayName: 'Token Address',
				name: 'tokenAddress',
				type: 'string',
				default: '',
				placeholder: '0x...',
				description: 'The Ethereum address of the token',
				displayOptions: {
					show: {
						operation: ['depositIntoStrategy', 'getCumulativeClaimed'],
					},
				},
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'string',
				default: '',
				placeholder: '1000000000000000000',
				description: 'Amount in wei (or smallest unit)',
				displayOptions: {
					show: {
						operation: [
							'depositIntoStrategy',
							'stake',
							'sharesToUnderlying',
							'underlyingToShares',
						],
					},
				},
			},
			{
				displayName: 'Validator Public Key',
				name: 'validatorPubkey',
				type: 'string',
				default: '',
				placeholder: '0x...',
				description: 'The validator public key (48 bytes, hex encoded)',
				displayOptions: {
					show: {
						operation: ['getValidatorStatus', 'stake'],
					},
				},
			},
			{
				displayName: 'Claimer Address',
				name: 'claimerAddress',
				type: 'string',
				default: '',
				placeholder: '0x...',
				description: 'The address to set as claimer',
				displayOptions: {
					show: {
						operation: ['setClaimerFor'],
					},
				},
			},
			{
				displayName: 'Metadata URI',
				name: 'metadataUri',
				type: 'string',
				default: '',
				placeholder: 'https://...',
				description: 'URI for operator metadata (JSON)',
				displayOptions: {
					show: {
						operation: ['registerAsOperator'],
					},
				},
			},
			{
				displayName: 'Delegation Approver',
				name: 'delegationApprover',
				type: 'string',
				default: '0x0000000000000000000000000000000000000000',
				placeholder: '0x...',
				description: 'Address that must approve delegations (or zero address)',
				displayOptions: {
					show: {
						operation: ['registerAsOperator'],
					},
				},
			},
			{
				displayName: 'Allocation Delay',
				name: 'allocationDelay',
				type: 'number',
				default: 0,
				description: 'Delay in blocks for allocation changes',
				displayOptions: {
					show: {
						operation: ['registerAsOperator'],
					},
				},
			},
			{
				displayName: 'Strategies',
				name: 'strategies',
				type: 'string',
				default: '',
				placeholder: '0x...,0x...',
				description: 'Comma-separated list of strategy addresses',
				displayOptions: {
					show: {
						operation: ['getWithdrawableShares', 'queueWithdrawals', 'batchRead'],
					},
				},
			},
			{
				displayName: 'Withdrawal Root',
				name: 'withdrawalRoot',
				type: 'string',
				default: '',
				placeholder: '0x...',
				description: 'The withdrawal root hash (32 bytes)',
				displayOptions: {
					show: {
						operation: ['completeQueuedWithdrawal'],
					},
				},
			},
			{
				displayName: 'Receive As Tokens',
				name: 'receiveAsTokens',
				type: 'boolean',
				default: true,
				description: 'Whether to receive withdrawal as tokens (true) or shares (false)',
				displayOptions: {
					show: {
						operation: ['completeQueuedWithdrawal'],
					},
				},
			},
			{
				displayName: 'Deposit Data Root',
				name: 'depositDataRoot',
				type: 'string',
				default: '',
				placeholder: '0x...',
				description: 'The deposit data root (32 bytes)',
				displayOptions: {
					show: {
						operation: ['stake'],
					},
				},
			},
			{
				displayName: 'Signature',
				name: 'signature',
				type: 'string',
				default: '',
				placeholder: '0x...',
				description: 'The BLS signature for validator deposit',
				displayOptions: {
					show: {
						operation: ['stake'],
					},
				},
			},
			{
				displayName: 'Operator Set ID',
				name: 'operatorSetId',
				type: 'number',
				default: 0,
				description: 'The operator set identifier',
				displayOptions: {
					show: {
						operation: ['getAllocation', 'modifyAllocations'],
					},
				},
			},
			{
				displayName: 'New Magnitude',
				name: 'newMagnitude',
				type: 'string',
				default: '',
				description: 'The new magnitude value',
				displayOptions: {
					show: {
						operation: ['modifyAllocations'],
					},
				},
			},
			// Batch read configuration
			{
				displayName: 'Calls JSON',
				name: 'callsJson',
				type: 'json',
				default: '[]',
				description: 'JSON array of call definitions for batch read',
				displayOptions: {
					show: {
						operation: ['batchRead'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Log licensing notice once per execution
		this.logger.warn(
			'[Velocity BPA Licensing Notice] This n8n node is licensed under the Business Source License 1.1 (BSL 1.1). Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA. For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.',
		);

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				switch (resource) {
					case 'strategyManager':
						switch (operation) {
							case 'getStakerDeposits':
								result = await getStakerDeposits.call(this, i);
								break;
							case 'getStakerStrategyShares':
								result = await getStakerStrategyShares.call(this, i);
								break;
							case 'depositIntoStrategy':
								result = await depositIntoStrategy.call(this, i);
								break;
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unknown operation: ${operation}`,
								);
						}
						break;

					case 'delegationManager':
						switch (operation) {
							case 'getDelegatedOperator':
								result = await getDelegatedOperator.call(this, i);
								break;
							case 'isDelegated':
								result = await isDelegated.call(this, i);
								break;
							case 'isOperator':
								result = await isOperator.call(this, i);
								break;
							case 'getOperatorDetails':
								result = await getOperatorDetails.call(this, i);
								break;
							case 'getOperatorShares':
								result = await getOperatorShares.call(this, i);
								break;
							case 'getWithdrawableShares':
								result = await getWithdrawableShares.call(this, i);
								break;
							case 'registerAsOperator':
								result = await registerAsOperator.call(this, i);
								break;
							case 'delegateTo':
								result = await delegateTo.call(this, i);
								break;
							case 'undelegate':
								result = await undelegate.call(this, i);
								break;
							case 'queueWithdrawals':
								result = await queueWithdrawals.call(this, i);
								break;
							case 'completeQueuedWithdrawal':
								result = await completeQueuedWithdrawal.call(this, i);
								break;
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unknown operation: ${operation}`,
								);
						}
						break;

					case 'eigenPodManager':
						switch (operation) {
							case 'getEigenPod':
								result = await getEigenPod.call(this, i);
								break;
							case 'hasPod':
								result = await hasPod.call(this, i);
								break;
							case 'getPodOwnerShares':
								result = await getPodOwnerShares.call(this, i);
								break;
							case 'createPod':
								result = await createPod.call(this, i);
								break;
							case 'stake':
								result = await stake.call(this, i);
								break;
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unknown operation: ${operation}`,
								);
						}
						break;

					case 'eigenPod':
						switch (operation) {
							case 'getPodOwner':
								result = await getPodOwner.call(this, i);
								break;
							case 'getValidatorStatus':
								result = await getValidatorStatus.call(this, i);
								break;
							case 'activateRestaking':
								result = await activateRestaking.call(this, i);
								break;
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unknown operation: ${operation}`,
								);
						}
						break;

					case 'avsDirectory':
						switch (operation) {
							case 'getOperatorAvsStatus':
								result = await getOperatorAvsStatus.call(this, i);
								break;
							case 'registerOperatorToAvs':
								result = await registerOperatorToAvs.call(this, i);
								break;
							case 'deregisterOperatorFromAvs':
								result = await deregisterOperatorFromAvs.call(this, i);
								break;
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unknown operation: ${operation}`,
								);
						}
						break;

					case 'rewardsCoordinator':
						switch (operation) {
							case 'getCumulativeClaimed':
								result = await getCumulativeClaimed.call(this, i);
								break;
							case 'getClaimerFor':
								result = await getClaimerFor.call(this, i);
								break;
							case 'processClaim':
								result = await processClaim.call(this, i);
								break;
							case 'setClaimerFor':
								result = await setClaimerFor.call(this, i);
								break;
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unknown operation: ${operation}`,
								);
						}
						break;

					case 'allocationManager':
						switch (operation) {
							case 'getEncumberedMagnitude':
								result = await getEncumberedMagnitude.call(this, i);
								break;
							case 'getAllocation':
								result = await getAllocation.call(this, i);
								break;
							case 'modifyAllocations':
								result = await modifyAllocations.call(this, i);
								break;
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unknown operation: ${operation}`,
								);
						}
						break;

					case 'strategy':
						switch (operation) {
							case 'getTotalShares':
								result = await getTotalShares.call(this, i);
								break;
							case 'getUnderlyingToken':
								result = await getUnderlyingToken.call(this, i);
								break;
							case 'sharesToUnderlying':
								result = await sharesToUnderlying.call(this, i);
								break;
							case 'underlyingToShares':
								result = await underlyingToShares.call(this, i);
								break;
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unknown operation: ${operation}`,
								);
						}
						break;

					case 'multicall':
						switch (operation) {
							case 'batchRead':
								result = await batchRead.call(this, i);
								break;
							case 'getStakerPortfolio':
								result = await getStakerPortfolio.call(this, i);
								break;
							case 'getOperatorSummary':
								result = await getOperatorSummary.call(this, i);
								break;
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unknown operation: ${operation}`,
								);
						}
						break;

					default:
						throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : 'Unknown error',
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
