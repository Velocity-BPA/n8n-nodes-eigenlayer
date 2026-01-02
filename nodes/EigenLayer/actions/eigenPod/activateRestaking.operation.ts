/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Contract } from 'ethers';
import { getSigner } from '../../transport/signer';
import { type NetworkType } from '../../constants';
import { EigenPodABI } from '../../contracts/EigenPod.abi';
import { validateAddress } from '../../utils/addressValidation';
import { serializeResult } from '../../utils/bigNumberConversion';

export async function activateRestaking(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const podAddress = this.getNodeParameter('podAddress', index) as string;

	validateAddress(podAddress, 'podAddress');

	const signer = await getSigner(this, index);

	const contract = new Contract(
		podAddress,
		EigenPodABI,
		signer,
	);

	const tx = await contract.activateRestaking();
	const receipt = await tx.wait();

	return [
		{
			json: serializeResult({
				success: true,
				transactionHash: receipt.hash,
				blockNumber: receipt.blockNumber,
				pod: podAddress,
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
