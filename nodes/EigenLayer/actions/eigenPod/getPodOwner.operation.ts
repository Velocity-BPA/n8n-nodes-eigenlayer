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
import { EigenPodABI } from '../../contracts/EigenPod.abi';
import { validateAddress } from '../../utils/addressValidation';
import { serializeResult } from '../../utils/bigNumberConversion';

export async function getPodOwner(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const podAddress = this.getNodeParameter('podAddress', index) as string;
	validateAddress(podAddress, 'podAddress');
	const provider = await getProvider(this, index);
	const addresses = getContractAddresses(network);

	const contract = new Contract(
		addresses.EigenPodManager,
		EigenPodABI,
		provider,
	);

	const podContract = new Contract(podAddress, EigenPodABI, provider);
	const owner = await podContract.podOwner();

	return [
		{
			json: serializeResult({
				pod: podAddress,
				owner,
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
