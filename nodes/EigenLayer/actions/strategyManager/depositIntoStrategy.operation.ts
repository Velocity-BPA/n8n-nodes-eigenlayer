/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Contract, MaxUint256 } from 'ethers';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getProvider, getSigner } from '../../transport';
import { StrategyManagerABI, IERC20ABI } from '../../contracts';
import { getContractAddresses, STRATEGY_INFO } from '../../constants';
import { validateAddress, formatUnits, parseUnits, serializeResult } from '../../utils';

export async function depositIntoStrategy(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const strategyAddress = this.getNodeParameter('strategyAddress', index) as string;
  const tokenAddress = this.getNodeParameter('tokenAddress', index) as string;
  const amount = this.getNodeParameter('amount', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';
  const approveFirst = this.getNodeParameter('approveFirst', index, true) as boolean;

  const validatedStrategy = validateAddress(strategyAddress, 'strategyAddress');
  const validatedToken = validateAddress(tokenAddress, 'tokenAddress');

  const signer = await getSigner(this, index);
  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);

  const strategyManager = new Contract(addresses.StrategyManager, StrategyManagerABI, signer);
  const token = new Contract(validatedToken, IERC20ABI, signer);

  // Get token decimals
  const decimals = await token.decimals();
  const amountWei = parseUnits(amount, Number(decimals));

  // Check and approve if needed
  const signerAddress = await signer.getAddress();
  
  if (approveFirst) {
    const currentAllowance = await token.allowance(signerAddress, addresses.StrategyManager) as bigint;
    
    if (currentAllowance < amountWei) {
      const approveTx = await token.approve(addresses.StrategyManager, MaxUint256);
      await approveTx.wait();
    }
  }

  // Deposit into strategy
  const tx = await strategyManager.depositIntoStrategy(
    validatedStrategy,
    validatedToken,
    amountWei
  );
  
  const receipt = await tx.wait();

  const strategyInfo = Object.values(STRATEGY_INFO).find(
    (s) => s.address.toLowerCase() === validatedStrategy.toLowerCase()
  );

  return [
    {
      json: serializeResult({
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        strategy: validatedStrategy,
        strategyName: strategyInfo?.name || 'Unknown Strategy',
        token: validatedToken,
        amount: amount,
        amountWei: amountWei.toString(),
        depositor: signerAddress,
        network,
      }),
    },
  ];
}
