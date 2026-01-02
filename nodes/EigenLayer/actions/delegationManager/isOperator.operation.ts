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
import { DelegationManagerABI } from '../../contracts/DelegationManager.abi';
import { validateAddress } from '../../utils/addressValidation';
import { serializeResult } from '../../utils/bigNumberConversion';

export async function isOperator(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const operatorAddress = this.getNodeParameter('operatorAddress', index) as string;
	validateAddress(operatorAddress, 'operatorAddress');
	const provider = await getProvider(this, index);
	const addresses = getContractAddresses(network);

	const contract = new Contract(
		addresses.DelegationManager,
		DelegationManagerABI,
		provider,
	);

	const isOp = await contract.isOperator(operatorAddress);

	return [
		{
			json: serializeResult({
				operator: operatorAddress,
				isOperator: isOp,
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
