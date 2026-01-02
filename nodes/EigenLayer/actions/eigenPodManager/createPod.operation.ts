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
import { EigenPodManagerABI } from '../../contracts/EigenPodManager.abi';
import { serializeResult } from '../../utils/bigNumberConversion';

export async function createPod(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;

	const signer = await getSigner(this, index);
	const addresses = getContractAddresses(network);
	const signerAddress = await signer.getAddress();

	const contract = new Contract(
		addresses.EigenPodManager,
		EigenPodManagerABI,
		signer,
	);

	const tx = await contract.createPod();
	const receipt = await tx.wait();

	// Get pod address from event
	const podAddress = await contract.ownerToPod(signerAddress);

	return [
		{
			json: serializeResult({
				success: true,
				transactionHash: receipt.hash,
				blockNumber: receipt.blockNumber,
				owner: signerAddress,
				eigenPod: podAddress,
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
