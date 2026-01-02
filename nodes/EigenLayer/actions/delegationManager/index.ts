/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Contract, ZeroAddress } from 'ethers';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getProvider, getSigner } from '../../transport';
import { DelegationManagerABI } from '../../contracts';
import { getContractAddresses, WITHDRAWAL_DELAY_BLOCKS } from '../../constants';
import { validateAddress, validateAddresses, formatUnits, serializeResult, isZeroAddress } from '../../utils';
import { estimateGas, waitForTransaction } from '../../utils/gasEstimation';
import { emptySignature, generateSalt } from '../../utils/signatureHelpers';

export async function getDelegatedOperator(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const stakerAddress = this.getNodeParameter('stakerAddress', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedStaker = validateAddress(stakerAddress, 'stakerAddress');

  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);
  const delegationManager = new Contract(addresses.DelegationManager, DelegationManagerABI, provider);

  const operator = await delegationManager.delegatedTo(validatedStaker);

  return [{
    json: {
      staker: validatedStaker,
      delegatedTo: operator,
      isDelegated: !isZeroAddress(operator),
      network,
    },
  }];
}

export async function isDelegated(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const stakerAddress = this.getNodeParameter('stakerAddress', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedStaker = validateAddress(stakerAddress, 'stakerAddress');

  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);
  const delegationManager = new Contract(addresses.DelegationManager, DelegationManagerABI, provider);

  const delegated = await delegationManager.isDelegated(validatedStaker);

  return [{
    json: {
      staker: validatedStaker,
      isDelegated: delegated,
      network,
    },
  }];
}

export async function isOperator(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const operatorAddress = this.getNodeParameter('operatorAddress', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedOperator = validateAddress(operatorAddress, 'operatorAddress');

  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);
  const delegationManager = new Contract(addresses.DelegationManager, DelegationManagerABI, provider);

  const operator = await delegationManager.isOperator(validatedOperator);

  return [{
    json: {
      address: validatedOperator,
      isOperator: operator,
      network,
    },
  }];
}

export async function getOperatorDetails(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const operatorAddress = this.getNodeParameter('operatorAddress', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedOperator = validateAddress(operatorAddress, 'operatorAddress');

  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);
  const delegationManager = new Contract(addresses.DelegationManager, DelegationManagerABI, provider);

  const [details, isOp] = await Promise.all([
    delegationManager.operatorDetails(validatedOperator),
    delegationManager.isOperator(validatedOperator),
  ]);

  return [{
    json: serializeResult({
      operator: validatedOperator,
      isOperator: isOp,
      delegationApprover: details.delegationApprover || details[1],
      earningsReceiver: details.__deprecated_earningsReceiver || details[0],
      network,
    }),
  }];
}

export async function getOperatorShares(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const operatorAddress = this.getNodeParameter('operatorAddress', index) as string;
  const strategyAddress = this.getNodeParameter('strategyAddress', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedOperator = validateAddress(operatorAddress, 'operatorAddress');
  const validatedStrategy = validateAddress(strategyAddress, 'strategyAddress');

  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);
  const delegationManager = new Contract(addresses.DelegationManager, DelegationManagerABI, provider);

  const shares = await delegationManager.operatorShares(validatedOperator, validatedStrategy);

  return [{
    json: serializeResult({
      operator: validatedOperator,
      strategy: validatedStrategy,
      shares: shares.toString(),
      sharesFormatted: formatUnits(shares, 18),
      network,
    }),
  }];
}

export async function getWithdrawableShares(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const stakerAddress = this.getNodeParameter('stakerAddress', index) as string;
  const strategiesInput = this.getNodeParameter('strategies', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedStaker = validateAddress(stakerAddress, 'stakerAddress');
  const strategies = validateAddresses(
    strategiesInput.split(',').map((s) => s.trim()),
    'strategies'
  );

  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);
  const delegationManager = new Contract(addresses.DelegationManager, DelegationManagerABI, provider);

  const [withdrawableShares, depositShares] = await delegationManager.getWithdrawableShares(
    validatedStaker,
    strategies
  );

  const results = strategies.map((strategy, i) => ({
    strategy,
    withdrawableShares: withdrawableShares[i].toString(),
    withdrawableFormatted: formatUnits(withdrawableShares[i], 18),
    depositShares: depositShares[i].toString(),
    depositFormatted: formatUnits(depositShares[i], 18),
  }));

  return [{
    json: serializeResult({
      staker: validatedStaker,
      shares: results,
      network,
    }),
  }];
}

export async function getMinWithdrawalDelayBlocks(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);
  const delegationManager = new Contract(addresses.DelegationManager, DelegationManagerABI, provider);

  const delayBlocks = await delegationManager.minWithdrawalDelayBlocks();
  const estimatedDays = Math.ceil(Number(delayBlocks) * 12 / 86400);

  return [{
    json: {
      minWithdrawalDelayBlocks: delayBlocks.toString(),
      estimatedDays,
      defaultDelayBlocks: WITHDRAWAL_DELAY_BLOCKS,
      network,
    },
  }];
}

export async function registerAsOperator(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const delegationApprover = this.getNodeParameter('delegationApprover', index, '') as string;
  const allocationDelay = this.getNodeParameter('allocationDelay', index, 1) as number;
  const metadataURI = this.getNodeParameter('metadataURI', index, '') as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedApprover = delegationApprover ? validateAddress(delegationApprover, 'delegationApprover') : ZeroAddress;

  const signer = await getSigner(this, index);
  const addresses = getContractAddresses(network);
  const delegationManager = new Contract(addresses.DelegationManager, DelegationManagerABI, signer);

  const operatorDetails = {
    __deprecated_earningsReceiver: ZeroAddress,
    delegationApprover: validatedApprover,
    __deprecated_stakerOptOutWindowBlocks: 0,
  };

  const gasLimit = await estimateGas(delegationManager, 'registerAsOperator', [
    operatorDetails,
    allocationDelay,
    metadataURI,
  ]);

  const tx = await delegationManager.registerAsOperator(
    operatorDetails,
    allocationDelay,
    metadataURI,
    { gasLimit }
  );

  const receipt = await waitForTransaction(tx);

  return [{
    json: serializeResult({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      operator: await signer.getAddress(),
      delegationApprover: validatedApprover,
      metadataURI,
      network,
    }),
  }];
}

export async function delegateTo(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const operatorAddress = this.getNodeParameter('operatorAddress', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedOperator = validateAddress(operatorAddress, 'operatorAddress');

  const signer = await getSigner(this, index);
  const addresses = getContractAddresses(network);
  const delegationManager = new Contract(addresses.DelegationManager, DelegationManagerABI, signer);

  const approverSig = emptySignature();
  const approverSalt = generateSalt();

  const gasLimit = await estimateGas(delegationManager, 'delegateTo', [
    validatedOperator,
    approverSig,
    approverSalt,
  ]);

  const tx = await delegationManager.delegateTo(
    validatedOperator,
    approverSig,
    approverSalt,
    { gasLimit }
  );

  const receipt = await waitForTransaction(tx);

  return [{
    json: serializeResult({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      staker: await signer.getAddress(),
      operator: validatedOperator,
      network,
    }),
  }];
}

export async function undelegate(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const stakerAddress = this.getNodeParameter('stakerAddress', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedStaker = validateAddress(stakerAddress, 'stakerAddress');

  const signer = await getSigner(this, index);
  const addresses = getContractAddresses(network);
  const delegationManager = new Contract(addresses.DelegationManager, DelegationManagerABI, signer);

  const gasLimit = await estimateGas(delegationManager, 'undelegate', [validatedStaker]);

  const tx = await delegationManager.undelegate(validatedStaker, { gasLimit });
  const receipt = await waitForTransaction(tx);

  return [{
    json: serializeResult({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      staker: validatedStaker,
      network,
    }),
  }];
}

export async function queueWithdrawals(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const strategiesInput = this.getNodeParameter('strategies', index) as string;
  const sharesInput = this.getNodeParameter('shares', index) as string;
  const withdrawer = this.getNodeParameter('withdrawer', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const strategies = validateAddresses(
    strategiesInput.split(',').map((s) => s.trim()),
    'strategies'
  );
  const shares = sharesInput.split(',').map((s) => BigInt(s.trim()));
  const validatedWithdrawer = validateAddress(withdrawer, 'withdrawer');

  if (strategies.length !== shares.length) {
    throw new Error('Strategies and shares arrays must have the same length');
  }

  const signer = await getSigner(this, index);
  const addresses = getContractAddresses(network);
  const delegationManager = new Contract(addresses.DelegationManager, DelegationManagerABI, signer);

  const params = [{
    strategies,
    shares,
    withdrawer: validatedWithdrawer,
  }];

  const gasLimit = await estimateGas(delegationManager, 'queueWithdrawals', [params]);

  const tx = await delegationManager.queueWithdrawals(params, { gasLimit });
  const receipt = await waitForTransaction(tx);

  return [{
    json: serializeResult({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      withdrawer: validatedWithdrawer,
      strategies,
      shares: shares.map((s) => s.toString()),
      estimatedCompletionBlocks: WITHDRAWAL_DELAY_BLOCKS,
      network,
    }),
  }];
}
