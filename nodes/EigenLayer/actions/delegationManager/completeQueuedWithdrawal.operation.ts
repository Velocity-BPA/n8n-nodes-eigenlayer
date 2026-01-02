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
import { serializeResult } from '../../utils/bigNumberConversion';

export async function completeQueuedWithdrawal(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const withdrawalRoot = this.getNodeParameter('withdrawalRoot', index) as string;
	const receiveAsTokens = this.getNodeParameter('receiveAsTokens', index, true) as boolean;

	const signer = await getSigner(this, index);
	const addresses = getContractAddresses(network);

	const contract = new Contract(
		addresses.DelegationManager,
		DelegationManagerABI,
		signer,
	);

	// This is a simplified version - in production you'd pass the full withdrawal struct
	const tx = await contract.completeQueuedWithdrawal(
		{ staker: await signer.getAddress(), delegatedTo: addresses.DelegationManager, withdrawer: await signer.getAddress(), nonce: 0, startBlock: 0, strategies: [], shares: [] },
		[],
		receiveAsTokens,
	);
	const receipt = await tx.wait();

	return [
		{
			json: serializeResult({
				success: true,
				transactionHash: receipt.hash,
				blockNumber: receipt.blockNumber,
				withdrawalRoot,
				receiveAsTokens,
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
