/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Contract, ZeroHash } from 'ethers';
import { getSigner } from '../../transport/signer';
import { getContractAddresses, type NetworkType } from '../../constants';
import { DelegationManagerABI } from '../../contracts/DelegationManager.abi';
import { validateAddress } from '../../utils/addressValidation';
import { serializeResult } from '../../utils/bigNumberConversion';

export async function delegateTo(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const operatorAddress = this.getNodeParameter('operatorAddress', index) as string;
	
	validateAddress(operatorAddress, 'operatorAddress');

	const signer = await getSigner(this, index);
	const addresses = getContractAddresses(network);
	const signerAddress = await signer.getAddress();

	const contract = new Contract(
		addresses.DelegationManager,
		DelegationManagerABI,
		signer,
	);

	// Empty signature with max expiry for direct delegation
	const emptySignature = {
		signature: '0x',
		expiry: BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
	};

	const tx = await contract.delegateTo(operatorAddress, emptySignature, ZeroHash);
	const receipt = await tx.wait();

	return [
		{
			json: serializeResult({
				success: true,
				transactionHash: receipt.hash,
				blockNumber: receipt.blockNumber,
				staker: signerAddress,
				operator: operatorAddress,
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
