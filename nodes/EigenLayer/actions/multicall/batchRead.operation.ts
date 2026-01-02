/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Contract, Interface } from 'ethers';
import { getProvider } from '../../transport/rpcProvider';
import { getContractAddresses, type NetworkType } from '../../constants';
import { serializeResult } from '../../utils/bigNumberConversion';
import { MULTICALL3_ADDRESS } from '../../transport/multicall';

const MULTICALL3_ABI = [
	{
		inputs: [{ components: [{ name: 'target', type: 'address' }, { name: 'allowFailure', type: 'bool' }, { name: 'callData', type: 'bytes' }], name: 'calls', type: 'tuple[]' }],
		name: 'aggregate3',
		outputs: [{ components: [{ name: 'success', type: 'bool' }, { name: 'returnData', type: 'bytes' }], name: 'returnData', type: 'tuple[]' }],
		stateMutability: 'payable',
		type: 'function',
	},
];

export async function batchRead(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const network = this.getNodeParameter('network', index, 'mainnet') as NetworkType;
	const calls = this.getNodeParameter('calls', index) as Array<{ target: string; callData: string }>;

	const provider = await getProvider(this, index);

	const multicall = new Contract(MULTICALL3_ADDRESS, MULTICALL3_ABI, provider);

	const formattedCalls = calls.map((call) => ({
		target: call.target,
		allowFailure: true,
		callData: call.callData,
	}));

	const results = await multicall.aggregate3(formattedCalls);

	const formattedResults = results.map((result: { success: boolean; returnData: string }, i: number) => ({
		index: i,
		success: result.success,
		returnData: result.returnData,
	}));

	return [
		{
			json: serializeResult({
				network,
				callCount: calls.length,
				results: formattedResults,
			}),
			pairedItem: { item: index },
		},
	];
}
