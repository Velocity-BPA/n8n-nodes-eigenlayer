/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Contract } from 'ethers';
import { getSigner } from '../../transport/signer';
import { getContractAddresses, type NetworkType } from '../../constants';
import { AllocationManagerABI } from '../../contracts/AllocationManager.abi';
import { validateAddress } from '../../utils/addressValidation';
import { serializeResult } from '../../utils/bigNumberConversion';

export async function modifyAllocations(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const operatorAddress = this.getNodeParameter('operatorAddress', index) as string;
	const strategyAddress = this.getNodeParameter('strategyAddress', index) as string;
	const operatorSetId = this.getNodeParameter('operatorSetId', index) as number;
	const newMagnitude = this.getNodeParameter('newMagnitude', index) as string;

	validateAddress(operatorAddress, 'operatorAddress');
	validateAddress(strategyAddress, 'strategyAddress');

	const signer = await getSigner(this, index);
	const addresses = getContractAddresses(network);
	const signerAddress = await signer.getAddress();

	const contract = new Contract(
		addresses.AllocationManager,
		AllocationManagerABI,
		signer,
	);

	const allocations = [{
		strategy: strategyAddress,
		operatorSets: [{ avs: signerAddress, operatorSetId }],
		newMagnitudes: [BigInt(newMagnitude)],
	}];

	const tx = await contract.modifyAllocations(operatorAddress, allocations);
	const receipt = await tx.wait();

	return [
		{
			json: serializeResult({
				success: true,
				transactionHash: receipt.hash,
				blockNumber: receipt.blockNumber,
				operator: operatorAddress,
				strategy: strategyAddress,
				operatorSetId,
				newMagnitude,
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
