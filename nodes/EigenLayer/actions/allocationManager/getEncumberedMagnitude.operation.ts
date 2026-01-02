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
import { AllocationManagerABI } from '../../contracts/AllocationManager.abi';
import { validateAddress } from '../../utils/addressValidation';
import { serializeResult } from '../../utils/bigNumberConversion';

export async function getEncumberedMagnitude(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const operatorAddress = this.getNodeParameter('operatorAddress', index) as string;
	const strategyAddress = this.getNodeParameter('strategyAddress', index) as string;
	validateAddress(operatorAddress, 'operatorAddress');
	validateAddress(strategyAddress, 'strategyAddress');
	const provider = await getProvider(this, index);
	const addresses = getContractAddresses(network);

	const contract = new Contract(
		addresses.AllocationManager,
		AllocationManagerABI,
		provider,
	);

	const magnitude = await contract.encumberedMagnitude(operatorAddress, strategyAddress);

	return [
		{
			json: serializeResult({
				operator: operatorAddress,
				strategy: strategyAddress,
				encumberedMagnitude: magnitude.toString(),
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
