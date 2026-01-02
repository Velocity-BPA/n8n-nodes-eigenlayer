/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ethers, Contract, Provider, TransactionReceipt, ContractTransactionResponse } from 'ethers';

export interface GasEstimate {
  gasLimit: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  gasPrice?: bigint;
}

export interface TransactionOptions {
  gasLimit?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  gasPrice?: bigint;
  nonce?: number;
  value?: bigint;
}

/**
 * Estimates gas for a transaction with a safety buffer
 */
export async function estimateGas(
  contract: Contract,
  method: string,
  args: unknown[],
  options: { bufferPercent?: number; value?: bigint } = {}
): Promise<bigint> {
  const { bufferPercent = 20, value } = options;
  
  try {
    const estimatedGas = await contract[method].estimateGas(...args, value ? { value } : {});
    // Add safety buffer
    const buffer = (estimatedGas * BigInt(bufferPercent)) / BigInt(100);
    return estimatedGas + buffer;
  } catch (error) {
    throw new Error(`Gas estimation failed for ${method}: ${(error as Error).message}`);
  }
}

/**
 * Gets current gas prices from the network
 */
export async function getGasPrices(provider: Provider): Promise<{
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  gasPrice: bigint;
}> {
  const feeData = await provider.getFeeData();
  
  return {
    maxFeePerGas: feeData.maxFeePerGas ?? BigInt(0),
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ?? BigInt(0),
    gasPrice: feeData.gasPrice ?? BigInt(0),
  };
}

/**
 * Determines if network supports EIP-1559
 */
export async function supportsEIP1559(provider: Provider): Promise<boolean> {
  const feeData = await provider.getFeeData();
  return feeData.maxFeePerGas !== null;
}

/**
 * Builds transaction options with proper gas settings
 */
export async function buildTransactionOptions(
  provider: Provider,
  gasLimit: bigint,
  customOptions?: Partial<TransactionOptions>
): Promise<TransactionOptions> {
  const options: TransactionOptions = {
    gasLimit,
    ...customOptions,
  };
  
  // If gas prices not provided, get from network
  if (!options.gasPrice && !options.maxFeePerGas) {
    const eip1559 = await supportsEIP1559(provider);
    const gasPrices = await getGasPrices(provider);
    
    if (eip1559) {
      options.maxFeePerGas = gasPrices.maxFeePerGas;
      options.maxPriorityFeePerGas = gasPrices.maxPriorityFeePerGas;
    } else {
      options.gasPrice = gasPrices.gasPrice;
    }
  }
  
  return options;
}

/**
 * Waits for transaction confirmation and returns receipt
 */
export async function waitForTransaction(
  tx: ContractTransactionResponse,
  confirmations = 1,
  timeout = 300000 // 5 minutes
): Promise<TransactionReceipt> {
  const receipt = await Promise.race([
    tx.wait(confirmations),
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Transaction confirmation timeout')), timeout)
    ),
  ]);
  
  if (!receipt) {
    throw new Error('Transaction failed - no receipt returned');
  }
  
  if (receipt.status === 0) {
    throw new Error('Transaction reverted');
  }
  
  return receipt;
}

/**
 * Formats gas cost for display
 */
export function formatGasCost(gasUsed: bigint, gasPrice: bigint): string {
  const costWei = gasUsed * gasPrice;
  return ethers.formatEther(costWei);
}

/**
 * Parses transaction error for better error messages
 */
export function parseTransactionError(error: unknown): string {
  const err = error as Error & { 
    code?: string; 
    reason?: string;
    data?: string;
    transaction?: unknown;
  };
  
  // Common error codes
  if (err.code === 'INSUFFICIENT_FUNDS') {
    return 'Insufficient funds for gas + value';
  }
  if (err.code === 'NONCE_EXPIRED') {
    return 'Transaction nonce has already been used';
  }
  if (err.code === 'REPLACEMENT_UNDERPRICED') {
    return 'Replacement transaction underpriced';
  }
  if (err.code === 'UNPREDICTABLE_GAS_LIMIT') {
    return err.reason || 'Transaction would revert - check your parameters';
  }
  if (err.code === 'ACTION_REJECTED') {
    return 'Transaction was rejected';
  }
  
  // Try to extract revert reason
  if (err.reason) {
    return `Transaction would revert: ${err.reason}`;
  }
  
  return err.message || 'Unknown transaction error';
}
