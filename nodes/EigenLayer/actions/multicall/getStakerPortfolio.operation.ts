/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Contract } from 'ethers';
import { getProvider } from '../../transport/rpcProvider';
import { getContractAddresses, STRATEGY_INFO, type NetworkType } from '../../constants';
import { StrategyManagerABI } from '../../contracts/StrategyManager.abi';
import { DelegationManagerABI } from '../../contracts/DelegationManager.abi';
import { validateAddress } from '../../utils/addressValidation';
import { serializeResult, formatUnits } from '../../utils/bigNumberConversion';

export async function getStakerPortfolio(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const stakerAddress = this.getNodeParameter('stakerAddress', index) as string;

	validateAddress(stakerAddress, 'stakerAddress');

	const provider = await getProvider(this, index);
	const addresses = getContractAddresses(network);

	const strategyManager = new Contract(addresses.StrategyManager, StrategyManagerABI, provider);
	const delegationManager = new Contract(addresses.DelegationManager, DelegationManagerABI, provider);

	// Get deposits
	const [strategies, shares] = await strategyManager.getDeposits(stakerAddress);

	// Get delegation status
	const delegatedTo = await delegationManager.delegatedTo(stakerAddress);
	const isDelegated = delegatedTo !== '0x0000000000000000000000000000000000000000';

	// Format deposits
	const deposits = strategies.map((strategy: string, i: number) => {
		const shareAmount = shares[i] as bigint;
		const strategyInfo = Object.values(STRATEGY_INFO).find(
			(s) => s.address.toLowerCase() === strategy.toLowerCase()
		);
		return {
			strategy,
			name: strategyInfo?.name || 'Unknown',
			symbol: strategyInfo?.symbol || 'UNKNOWN',
			shares: shareAmount.toString(),
			sharesFormatted: formatUnits(shareAmount, 18),
		};
	});

	return [
		{
			json: serializeResult({
				staker: stakerAddress,
				network,
				isDelegated,
				delegatedTo: isDelegated ? delegatedTo : null,
				totalStrategies: deposits.length,
				deposits,
			}),
			pairedItem: { item: index },
		},
	];
}
