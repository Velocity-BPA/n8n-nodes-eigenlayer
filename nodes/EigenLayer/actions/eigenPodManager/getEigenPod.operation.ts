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
import { EigenPodManagerABI } from '../../contracts/EigenPodManager.abi';
import { validateAddress } from '../../utils/addressValidation';
import { serializeResult } from '../../utils/bigNumberConversion';

export async function getEigenPod(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const ownerAddress = this.getNodeParameter('ownerAddress', index) as string;
	validateAddress(ownerAddress, 'ownerAddress');
	const provider = await getProvider(this, index);
	const addresses = getContractAddresses(network);

	const contract = new Contract(
		addresses.EigenPodManager,
		EigenPodManagerABI,
		provider,
	);

	const pod = await contract.ownerToPod(ownerAddress);

	return [
		{
			json: serializeResult({
				owner: ownerAddress,
				eigenPod: pod,
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
