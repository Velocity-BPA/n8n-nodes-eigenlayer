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

export async function getAllocation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operatorAddress = this.getNodeParameter('operatorAddress', index) as string;
	const strategyAddress = this.getNodeParameter('strategyAddress', index) as string;
	const avsAddress = this.getNodeParameter('avsAddress', index) as string;
	const operatorSetId = this.getNodeParameter('operatorSetId', index) as number;
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;

	validateAddress(operatorAddress, 'Operator address');
	validateAddress(strategyAddress, 'Strategy address');
	validateAddress(avsAddress, 'AVS address');

	const provider = await getProvider(this, index);
	const addresses = getContractAddresses(network);

	const allocationManager = new Contract(
		addresses.AllocationManager,
		AllocationManagerABI,
		provider,
	);

	const operatorSet = {
		avs: avsAddress,
		operatorSetId,
	};

	const allocation = await allocationManager.getAllocation(
		operatorAddress,
		operatorSet,
		strategyAddress,
	);

	return [
		{
			json: serializeResult({
				operator: operatorAddress,
				strategy: strategyAddress,
				avs: avsAddress,
				operatorSetId,
				allocation: {
					currentMagnitude: allocation.currentMagnitude?.toString() || '0',
					pendingDiff: allocation.pendingDiff?.toString() || '0',
					effectBlock: allocation.effectBlock?.toString() || '0',
				},
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
