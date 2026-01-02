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
import { DelegationManagerABI } from '../../contracts/DelegationManager.abi';
import { validateAddress } from '../../utils/addressValidation';
import { serializeResult } from '../../utils/bigNumberConversion';

export async function queueWithdrawals(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const strategies = this.getNodeParameter('strategies', index) as string[];
	const shares = this.getNodeParameter('shares', index) as string[];

	strategies.forEach((s, i) => validateAddress(s, `strategies[${i}]`));

	const signer = await getSigner(this, index);
	const addresses = getContractAddresses(network);
	const signerAddress = await signer.getAddress();

	const contract = new Contract(
		addresses.DelegationManager,
		DelegationManagerABI,
		signer,
	);

	const params = [{
		strategies,
		shares: shares.map(s => BigInt(s)),
		withdrawer: signerAddress,
	}];

	const tx = await contract.queueWithdrawals(params);
	const receipt = await tx.wait();

	return [
		{
			json: serializeResult({
				success: true,
				transactionHash: receipt.hash,
				blockNumber: receipt.blockNumber,
				staker: signerAddress,
				strategies,
				shares,
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
