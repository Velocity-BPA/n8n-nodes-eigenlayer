/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Contract, parseEther } from 'ethers';
import { getSigner } from '../../transport/signer';
import { getContractAddresses, type NetworkType } from '../../constants';
import { EigenPodManagerABI } from '../../contracts/EigenPodManager.abi';
import { serializeResult } from '../../utils/bigNumberConversion';

export async function stake(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const pubkey = this.getNodeParameter('pubkey', index) as string;
	const signature = this.getNodeParameter('signature', index) as string;
	const depositDataRoot = this.getNodeParameter('depositDataRoot', index) as string;

	const signer = await getSigner(this, index);
	const addresses = getContractAddresses(network);
	const signerAddress = await signer.getAddress();

	const contract = new Contract(
		addresses.EigenPodManager,
		EigenPodManagerABI,
		signer,
	);

	const tx = await contract.stake(pubkey, signature, depositDataRoot, {
		value: parseEther('32'),
	});
	const receipt = await tx.wait();

	return [
		{
			json: serializeResult({
				success: true,
				transactionHash: receipt.hash,
				blockNumber: receipt.blockNumber,
				owner: signerAddress,
				pubkey,
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
