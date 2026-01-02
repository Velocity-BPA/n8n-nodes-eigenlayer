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
import { RewardsCoordinatorABI } from '../../contracts/RewardsCoordinator.abi';
import { validateAddress } from '../../utils/addressValidation';
import { serializeResult } from '../../utils/bigNumberConversion';

export async function processClaim(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const claim = this.getNodeParameter('claim', index) as object;
	const recipient = this.getNodeParameter('recipient', index) as string;

	validateAddress(recipient, 'recipient');

	const signer = await getSigner(this, index);
	const addresses = getContractAddresses(network);
	const signerAddress = await signer.getAddress();

	const contract = new Contract(
		addresses.RewardsCoordinator,
		RewardsCoordinatorABI,
		signer,
	);

	const tx = await contract.processClaim(claim, recipient);
	const receipt = await tx.wait();

	return [
		{
			json: serializeResult({
				success: true,
				transactionHash: receipt.hash,
				blockNumber: receipt.blockNumber,
				claimer: signerAddress,
				recipient,
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
