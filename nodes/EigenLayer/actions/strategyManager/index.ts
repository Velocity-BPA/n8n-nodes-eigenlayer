/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Contract } from 'ethers';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getProvider, getSigner } from '../../transport';
import { StrategyManagerABI, IERC20ABI } from '../../contracts';
import { getContractAddresses, STRATEGY_INFO } from '../../constants';
import { validateAddress, formatUnits, parseUnits, serializeResult } from '../../utils';
import { estimateGas, waitForTransaction } from '../../utils/gasEstimation';

export { getStakerDeposits } from './getStakerDeposits.operation';

export async function getStakerStrategyShares(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const stakerAddress = this.getNodeParameter('stakerAddress', index) as string;
  const strategyAddress = this.getNodeParameter('strategyAddress', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedStaker = validateAddress(stakerAddress, 'stakerAddress');
  const validatedStrategy = validateAddress(strategyAddress, 'strategyAddress');

  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);
  const strategyManager = new Contract(addresses.StrategyManager, StrategyManagerABI, provider);

  const shares = await strategyManager.stakerDepositShares(validatedStaker, validatedStrategy);

  const strategyInfo = Object.values(STRATEGY_INFO).find(
    (s) => s.address.toLowerCase() === validatedStrategy.toLowerCase()
  );

  return [{
    json: serializeResult({
      staker: validatedStaker,
      strategy: validatedStrategy,
      strategyName: strategyInfo?.name || 'Unknown',
      shares: shares.toString(),
      sharesFormatted: formatUnits(shares, 18),
      network,
    }),
  }];
}

export async function getStrategyWhitelistedStatus(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const strategyAddress = this.getNodeParameter('strategyAddress', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedStrategy = validateAddress(strategyAddress, 'strategyAddress');

  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);
  const strategyManager = new Contract(addresses.StrategyManager, StrategyManagerABI, provider);

  const isWhitelisted = await strategyManager.strategyIsWhitelistedForDeposit(validatedStrategy);

  return [{
    json: {
      strategy: validatedStrategy,
      isWhitelisted,
      network,
    },
  }];
}

export async function getNonces(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const stakerAddress = this.getNodeParameter('stakerAddress', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedStaker = validateAddress(stakerAddress, 'stakerAddress');

  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);
  const strategyManager = new Contract(addresses.StrategyManager, StrategyManagerABI, provider);

  const nonce = await strategyManager.nonces(validatedStaker);

  return [{
    json: {
      staker: validatedStaker,
      nonce: nonce.toString(),
      network,
    },
  }];
}

export async function depositIntoStrategy(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const strategyAddress = this.getNodeParameter('strategyAddress', index) as string;
  const tokenAddress = this.getNodeParameter('tokenAddress', index) as string;
  const amount = this.getNodeParameter('amount', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedStrategy = validateAddress(strategyAddress, 'strategyAddress');
  const validatedToken = validateAddress(tokenAddress, 'tokenAddress');
  const amountWei = parseUnits(amount, 18);

  const signer = await getSigner(this, index);
  const addresses = getContractAddresses(network);

  // First approve the token transfer
  const tokenContract = new Contract(validatedToken, IERC20ABI, signer);
  const approveTx = await tokenContract.approve(addresses.StrategyManager, amountWei);
  await waitForTransaction(approveTx);

  // Then deposit
  const strategyManager = new Contract(addresses.StrategyManager, StrategyManagerABI, signer);
  const gasLimit = await estimateGas(strategyManager, 'depositIntoStrategy', [
    validatedStrategy,
    validatedToken,
    amountWei,
  ]);

  const tx = await strategyManager.depositIntoStrategy(
    validatedStrategy,
    validatedToken,
    amountWei,
    { gasLimit }
  );

  const receipt = await waitForTransaction(tx);

  return [{
    json: serializeResult({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      strategy: validatedStrategy,
      token: validatedToken,
      amount,
      amountWei: amountWei.toString(),
      network,
    }),
  }];
}
