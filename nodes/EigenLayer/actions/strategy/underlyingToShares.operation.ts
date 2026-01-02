/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Contract } from 'ethers';
import { getProvider } from '../../transport/rpcProvider';
import { getContractAddresses, type NetworkType } from '../../constants';
import { StrategyABI } from '../../contracts/Strategy.abi';
import { validateAddress } from '../../utils/addressValidation';
import { serializeResult } from '../../utils/bigNumberConversion';

export async function underlyingToShares(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const strategyAddress = this.getNodeParameter('strategyAddress', index) as string;
	const amount = this.getNodeParameter('amount', index) as string;
	validateAddress(strategyAddress, 'strategyAddress');
	const provider = await getProvider(this, index);
	const addresses = getContractAddresses(network);

	const contract = new Contract(
		addresses.StrategyManager,
		StrategyABI,
		provider,
	);

	const strategyContract = new Contract(strategyAddress, StrategyABI, provider);
	const shares = await strategyContract.underlyingToShares(BigInt(amount));

	return [
		{
			json: serializeResult({
				strategy: strategyAddress,
				amount,
				shares: shares.toString(),
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
