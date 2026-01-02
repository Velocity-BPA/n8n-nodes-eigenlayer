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

export async function registerAsOperator(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const metadataURI = this.getNodeParameter('metadataURI', index, '') as string;
	const delegationApprover = this.getNodeParameter('delegationApprover', index, '0x0000000000000000000000000000000000000000') as string;
	const allocationDelay = this.getNodeParameter('allocationDelay', index, 0) as number;

	if (delegationApprover !== '0x0000000000000000000000000000000000000000') {
		validateAddress(delegationApprover, 'delegationApprover');
	}

	const signer = await getSigner(this, index);
	const addresses = getContractAddresses(network);
	const signerAddress = await signer.getAddress();

	const contract = new Contract(
		addresses.DelegationManager,
		DelegationManagerABI,
		signer,
	);

	const operatorDetails = {
		delegationApprover,
		stakerOptOutWindowBlocks: 0,
	};

	const tx = await contract.registerAsOperator(operatorDetails, allocationDelay, metadataURI);
	const receipt = await tx.wait();

	return [
		{
			json: serializeResult({
				success: true,
				transactionHash: receipt.hash,
				blockNumber: receipt.blockNumber,
				operator: signerAddress,
				metadataURI,
				delegationApprover,
				network,
			}),
			pairedItem: { item: index },
		},
	];
}
