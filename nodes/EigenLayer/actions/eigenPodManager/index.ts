/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Contract } from 'ethers';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getProvider, getSigner } from '../../transport';
import { EigenPodManagerABI } from '../../contracts';
import { getContractAddresses } from '../../constants';
import { validateAddress, formatUnits, serializeResult, isZeroAddress } from '../../utils';
import { estimateGas, waitForTransaction } from '../../utils/gasEstimation';

export async function getEigenPod(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const podOwnerAddress = this.getNodeParameter('podOwnerAddress', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedOwner = validateAddress(podOwnerAddress, 'podOwnerAddress');

  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);
  const eigenPodManager = new Contract(addresses.EigenPodManager, EigenPodManagerABI, provider);

  const [podAddress, hasPodResult] = await Promise.all([
    eigenPodManager.ownerToPod(validatedOwner),
    eigenPodManager.hasPod(validatedOwner),
  ]);

  return [{
    json: {
      podOwner: validatedOwner,
      eigenPod: podAddress,
      hasPod: hasPodResult,
      isPodDeployed: !isZeroAddress(podAddress),
      network,
    },
  }];
}

export async function hasPod(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const podOwnerAddress = this.getNodeParameter('podOwnerAddress', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedOwner = validateAddress(podOwnerAddress, 'podOwnerAddress');

  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);
  const eigenPodManager = new Contract(addresses.EigenPodManager, EigenPodManagerABI, provider);

  const result = await eigenPodManager.hasPod(validatedOwner);

  return [{
    json: {
      podOwner: validatedOwner,
      hasPod: result,
      network,
    },
  }];
}

export async function getPodOwnerShares(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const podOwnerAddress = this.getNodeParameter('podOwnerAddress', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const validatedOwner = validateAddress(podOwnerAddress, 'podOwnerAddress');

  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);
  const eigenPodManager = new Contract(addresses.EigenPodManager, EigenPodManagerABI, provider);

  const shares = await eigenPodManager.podOwnerDepositShares(validatedOwner);

  return [{
    json: serializeResult({
      podOwner: validatedOwner,
      shares: shares.toString(),
      sharesFormatted: formatUnits(shares < 0n ? -shares : shares, 18),
      isNegative: shares < 0n,
      network,
    }),
  }];
}

export async function getBeaconChainETHStrategy(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);
  const eigenPodManager = new Contract(addresses.EigenPodManager, EigenPodManagerABI, provider);

  const strategyAddress = await eigenPodManager.beaconChainETHStrategy();

  return [{
    json: {
      beaconChainETHStrategy: strategyAddress,
      network,
    },
  }];
}

export async function getNumPods(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const provider = await getProvider(this, index);
  const addresses = getContractAddresses(network);
  const eigenPodManager = new Contract(addresses.EigenPodManager, EigenPodManagerABI, provider);

  const numPods = await eigenPodManager.numPods();

  return [{
    json: serializeResult({
      totalPods: numPods.toString(),
      network,
    }),
  }];
}

export async function createPod(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const signer = await getSigner(this, index);
  const addresses = getContractAddresses(network);
  const eigenPodManager = new Contract(addresses.EigenPodManager, EigenPodManagerABI, signer);

  const gasLimit = await estimateGas(eigenPodManager, 'createPod', []);
  const tx = await eigenPodManager.createPod({ gasLimit });
  const receipt = await waitForTransaction(tx);

  // Get the new pod address
  const podOwner = await signer.getAddress();
  const podAddress = await eigenPodManager.ownerToPod(podOwner);

  return [{
    json: serializeResult({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      podOwner,
      eigenPod: podAddress,
      network,
    }),
  }];
}

export async function stake(
  this: IExecuteFunctions,
  index: number
): Promise<INodeExecutionData[]> {
  const pubkey = this.getNodeParameter('pubkey', index) as string;
  const signature = this.getNodeParameter('signature', index) as string;
  const depositDataRoot = this.getNodeParameter('depositDataRoot', index) as string;
  const network = this.getNodeParameter('network', index, 'mainnet') as 'mainnet' | 'holesky';

  const signer = await getSigner(this, index);
  const addresses = getContractAddresses(network);
  const eigenPodManager = new Contract(addresses.EigenPodManager, EigenPodManagerABI, signer);

  // 32 ETH deposit amount
  const depositAmount = 32n * 10n ** 18n;

  const gasLimit = await estimateGas(
    eigenPodManager,
    'stake',
    [pubkey, signature, depositDataRoot],
    { value: depositAmount }
  );

  const tx = await eigenPodManager.stake(pubkey, signature, depositDataRoot, {
    gasLimit,
    value: depositAmount,
  });

  const receipt = await waitForTransaction(tx);

  return [{
    json: serializeResult({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      depositAmount: '32',
      pubkey,
      network,
    }),
  }];
}
