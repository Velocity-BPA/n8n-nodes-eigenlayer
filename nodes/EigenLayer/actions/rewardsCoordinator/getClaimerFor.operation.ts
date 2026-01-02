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
import { RewardsCoordinatorABI } from '../../contracts/RewardsCoordinator.abi';
import { validateAddress } from '../../utils/addressValidation';
import { serializeResult } from '../../utils/bigNumberConversion';

export async function getClaimerFor(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const earnerAddress = this.getNodeParameter('earnerAddress', index) as string;
	validateAddress(earnerAddress, 'earnerAddress');
	const provider = await getProvider(this, index);
	const addresses = getContractAddresses(network);

	const contract = new Contract(
		addresses.RewardsCoordinator,
		RewardsCoordinatorABI,
		provider,
	);

	const claimer = await contract.claimerFor(earnerAddress);

	return [
		{
			json: serializeResult({
				earner: earnerAddress,
				claimer,
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
