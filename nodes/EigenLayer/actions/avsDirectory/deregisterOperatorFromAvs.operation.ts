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
import { AVSDirectoryABI } from '../../contracts/AVSDirectory.abi';
import { validateAddress } from '../../utils/addressValidation';
import { serializeResult } from '../../utils/bigNumberConversion';

export async function deregisterOperatorFromAvs(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const avsAddress = this.getNodeParameter('avsAddress', index) as string;

	validateAddress(avsAddress, 'avsAddress');

	const signer = await getSigner(this, index);
	const addresses = getContractAddresses(network);
	const signerAddress = await signer.getAddress();

	const contract = new Contract(
		addresses.AVSDirectory,
		AVSDirectoryABI,
		signer,
	);

	const tx = await contract.deregisterOperatorFromAVS(signerAddress);
	const receipt = await tx.wait();

	return [
		{
			json: serializeResult({
				success: true,
				transactionHash: receipt.hash,
				blockNumber: receipt.blockNumber,
				operator: signerAddress,
				avs: avsAddress,
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
