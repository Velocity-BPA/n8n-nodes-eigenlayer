/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Contract } from 'ethers';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getProvider } from '../../transport';
import { StrategyManagerABI } from '../../contracts';
import { getContractAddresses, STRATEGY_INFO } from '../../constants';
import { validateAddress, formatUnits, serializeResult } from '../../utils';

export async function getStakerDeposits(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const stakerAddress = this.getNodeParameter('stakerAddress', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedStaker = validateAddress(stakerAddress, 'stakerAddress');

  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);
  const strategyManager = new Contract(addresses.StrategyManager, StrategyManagerABI, provider);

  const [strategies, shares] = await strategyManager.getDeposits(validatedStaker);

  const deposits = strategies.map((strategyAddr: string, i: number) => {
    const shareAmount = shares[i] as bigint;
    const strategyInfo = Object.values(STRATEGY_INFO).find(
      (s) => s.address.toLowerCase() === strategyAddr.toLowerCase()
    );

    return {
      strategy: strategyAddr,
      name: strategyInfo?.name || 'Unknown Strategy',
      symbol: strategyInfo?.symbol || 'UNKNOWN',
      shares: shareAmount.toString(),
      sharesFormatted: formatUnits(shareAmount, 18),
    };
  });

  return [
    {
      json: serializeResult({
        staker: validatedStaker,
        network,
        totalStrategies: deposits.length,
        deposits,
      }),
    },
  ];
}
