/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IPollFunctions,
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
} from 'n8n-workflow';
import { Contract, EventLog, JsonRpcProvider } from 'ethers';
import { getContractAddresses, type NetworkType } from './constants';
import { DelegationManagerABI } from './contracts/DelegationManager.abi';
import { StrategyManagerABI } from './contracts/StrategyManager.abi';
import { EigenPodManagerABI } from './contracts/EigenPodManager.abi';
import { AVSDirectoryABI } from './contracts/AVSDirectory.abi';
import { RewardsCoordinatorABI } from './contracts/RewardsCoordinator.abi';
import { formatUnits } from './utils/bigNumberConversion';

export class EigenLayerTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'EigenLayer Trigger',
		name: 'eigenLayerTrigger',
		icon: 'file:eigenlayer.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Triggers on EigenLayer blockchain events',
		defaults: {
			name: 'EigenLayer Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'ethereumRpc',
				required: true,
			},
		],
		polling: true,
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Deposit',
						value: 'Deposit',
						description: 'New deposits into strategies',
					},
					{
						name: 'Operator Registered',
						value: 'OperatorRegistered',
						description: 'New operator registrations',
					},
					{
						name: 'Staker Delegated',
						value: 'StakerDelegated',
						description: 'Delegation to operators',
					},
					{
						name: 'Staker Undelegated',
						value: 'StakerUndelegated',
						description: 'Undelegation events',
					},
					{
						name: 'Withdrawal Queued',
						value: 'WithdrawalQueued',
						description: 'Withdrawal initiated',
					},
					{
						name: 'Withdrawal Completed',
						value: 'WithdrawalCompleted',
						description: 'Withdrawal finalized',
					},
					{
						name: 'Pod Deployed',
						value: 'PodDeployed',
						description: 'New EigenPod deployment',
					},
					{
						name: 'AVS Registration Updated',
						value: 'OperatorAVSRegistrationStatusUpdated',
						description: 'Operator AVS registration changes',
					},
					{
						name: 'Rewards Claimed',
						value: 'RewardsClaimed',
						description: 'Reward distribution claims',
					},
				],
				default: 'Deposit',
			},
			{
				displayName: 'Filter by Address',
				name: 'filterAddress',
				type: 'string',
				default: '',
				placeholder: '0x...',
				description: 'Filter events by specific address (optional)',
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const credentials = await this.getCredentials('ethereumRpc');
		const event = this.getNodeParameter('event') as string;
		const filterAddress = this.getNodeParameter('filterAddress') as string;

		const network = credentials.network as NetworkType;
		const addresses = getContractAddresses(network);

		// Build RPC URL
		let rpcUrl: string;
		const provider = credentials.provider as string;
		const apiKey = credentials.apiKey as string;
		const customRpcUrl = credentials.customRpcUrl as string;

		if (provider === 'custom') {
			rpcUrl = customRpcUrl;
		} else if (provider === 'alchemy') {
			const subdomain = network === 'mainnet' ? 'eth-mainnet' : 'eth-holesky';
			rpcUrl = `https://${subdomain}.g.alchemy.com/v2/${apiKey}`;
		} else if (provider === 'infura') {
			const subdomain = network === 'mainnet' ? 'mainnet' : 'holesky';
			rpcUrl = `https://${subdomain}.infura.io/v3/${apiKey}`;
		} else if (provider === 'quicknode') {
			rpcUrl = apiKey;
		} else {
			throw new Error(`Unsupported provider: ${provider}`);
		}

		const chainId = network === 'mainnet' ? 1 : 17000;
		const ethersProvider = new JsonRpcProvider(rpcUrl, chainId, { staticNetwork: true });

		// Log licensing notice
		this.logger.warn(
			'[Velocity BPA Licensing Notice] This n8n node is licensed under the Business Source License 1.1 (BSL 1.1). Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA. For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.',
		);

		// Get last processed block from workflow static data
		const staticData = this.getWorkflowStaticData('node');
		const lastBlock = (staticData.lastBlock as number) || 0;

		// Get current block
		const currentBlock = await ethersProvider.getBlockNumber();

		// If no new blocks, return empty
		if (currentBlock <= lastBlock) {
			return null;
		}

		// Determine which contract and event to query
		let contract: Contract;
		let eventName: string;

		switch (event) {
			case 'Deposit':
				contract = new Contract(addresses.StrategyManager, StrategyManagerABI, ethersProvider);
				eventName = 'Deposit';
				break;
			case 'OperatorRegistered':
			case 'StakerDelegated':
			case 'StakerUndelegated':
			case 'WithdrawalQueued':
			case 'WithdrawalCompleted':
				contract = new Contract(addresses.DelegationManager, DelegationManagerABI, ethersProvider);
				eventName = event;
				break;
			case 'PodDeployed':
				contract = new Contract(addresses.EigenPodManager, EigenPodManagerABI, ethersProvider);
				eventName = event;
				break;
			case 'OperatorAVSRegistrationStatusUpdated':
				contract = new Contract(addresses.AVSDirectory, AVSDirectoryABI, ethersProvider);
				eventName = event;
				break;
			case 'RewardsClaimed':
				contract = new Contract(addresses.RewardsCoordinator, RewardsCoordinatorABI, ethersProvider);
				eventName = event;
				break;
			default:
				throw new Error(`Unknown event type: ${event}`);
		}

		// Query events from last processed block
		const fromBlock = lastBlock > 0 ? lastBlock + 1 : currentBlock - 1000; // Max 1000 blocks back
		const eventFilter = contract.filters[eventName]?.();

		if (!eventFilter) {
			throw new Error(`Event filter not found for: ${eventName}`);
		}

		const events = await contract.queryFilter(eventFilter, fromBlock, currentBlock);

		// Update last processed block
		staticData.lastBlock = currentBlock;

		// Filter by address if specified
		let filteredEvents = events;
		if (filterAddress) {
			const normalizedFilter = filterAddress.toLowerCase();
			filteredEvents = events.filter((e) => {
				if (e instanceof EventLog && e.args) {
					return Object.values(e.args).some(
						(arg) =>
							typeof arg === 'string' && arg.toLowerCase() === normalizedFilter,
					);
				}
				return false;
			});
		}

		// If no events, return null
		if (filteredEvents.length === 0) {
			return null;
		}

		// Format events for output
		const outputItems: INodeExecutionData[] = filteredEvents.map((e) => {
			const eventLog = e as EventLog;
			const args = eventLog.args || [];

			// Build event data based on event type
			let eventData: Record<string, unknown> = {};

			switch (event) {
				case 'Deposit':
					eventData = {
						staker: args[0],
						token: args[1],
						strategy: args[2],
						shares: args[3]?.toString(),
						sharesFormatted: formatUnits(args[3] || 0n, 18),
					};
					break;
				case 'OperatorRegistered':
					eventData = {
						operator: args[0],
						operatorDetails: args[1],
					};
					break;
				case 'StakerDelegated':
					eventData = {
						staker: args[0],
						operator: args[1],
					};
					break;
				case 'StakerUndelegated':
					eventData = {
						staker: args[0],
						operator: args[1],
					};
					break;
				case 'WithdrawalQueued':
					eventData = {
						withdrawalRoot: args[0],
						withdrawal: args[1],
					};
					break;
				case 'WithdrawalCompleted':
					eventData = {
						withdrawalRoot: args[0],
					};
					break;
				case 'PodDeployed':
					eventData = {
						eigenPod: args[0],
						podOwner: args[1],
					};
					break;
				case 'OperatorAVSRegistrationStatusUpdated':
					eventData = {
						operator: args[0],
						avs: args[1],
						status: Number(args[2]),
					};
					break;
				case 'RewardsClaimed':
					eventData = {
						root: args[0],
						earner: args[1],
						claimer: args[2],
						recipient: args[3],
						token: args[4],
						claimedAmount: args[5]?.toString(),
					};
					break;
			}

			return {
				json: {
					event: eventName,
					network,
					blockNumber: eventLog.blockNumber,
					transactionHash: eventLog.transactionHash,
					logIndex: eventLog.index,
					...eventData,
				},
			};
		});

		return [outputItems];
	}
}
