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
import { DelegationManagerABI } from '../../contracts/DelegationManager.abi';
import { validateAddress } from '../../utils/addressValidation';
import { serializeResult, formatUnits } from '../../utils/bigNumberConversion';

export async function getOperatorSummary(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const operatorAddress = this.getNodeParameter('operatorAddress', index) as string;

	validateAddress(operatorAddress, 'operatorAddress');

	const provider = await getProvider(this, index);
	const addresses = getContractAddresses(network);

	const delegationManager = new Contract(addresses.DelegationManager, DelegationManagerABI, provider);

	// Check if operator
	const isOperator = await delegationManager.isOperator(operatorAddress);
	if (!isOperator) {
		return [
			{
				json: serializeResult({
					operator: operatorAddress,
					network,
					isOperator: false,
					error: 'Address is not a registered operator',
				}),
				pairedItem: { item: index },
			},
		];
	}

	// Get operator details
	const details = await delegationManager.operatorDetails(operatorAddress);

	// Get shares for each strategy
	const strategyShares = [];
	for (const [key, info] of Object.entries(STRATEGY_INFO)) {
		try {
			const shares = await delegationManager.operatorShares(operatorAddress, info.address);
			if (shares > 0n) {
				strategyShares.push({
					strategy: info.address,
					name: info.name,
					symbol: info.symbol,
					shares: shares.toString(),
					sharesFormatted: formatUnits(shares, 18),
				});
			}
		} catch {
			// Skip if strategy not available
		}
	}

	return [
		{
			json: serializeResult({
				operator: operatorAddress,
				network,
				isOperator: true,
				details: {
					delegationApprover: details.delegationApprover || details[0],
					stakerOptOutWindowBlocks: (details.stakerOptOutWindowBlocks || details[1])?.toString(),
				},
				totalStrategies: strategyShares.length,
				strategyShares,
			}),
			pairedItem: { item: index },
		},
	];
}
