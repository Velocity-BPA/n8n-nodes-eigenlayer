/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ethers } from 'ethers';

/**
 * Converts a BigInt to a human-readable decimal string
 */
export function formatUnits(value: bigint | string, decimals = 18): string {
  return ethers.formatUnits(value, decimals);
}

/**
 * Converts a decimal string to BigInt with specified decimals
 */
export function parseUnits(value: string, decimals = 18): bigint {
  return ethers.parseUnits(value, decimals);
}

/**
 * Formats ETH value (18 decimals)
 */
export function formatEther(value: bigint | string): string {
  return ethers.formatEther(value);
}

/**
 * Parses ETH value to wei
 */
export function parseEther(value: string): bigint {
  return ethers.parseEther(value);
}

/**
 * Converts Gwei to Wei
 */
export function gweiToWei(gwei: bigint | number): bigint {
  return BigInt(gwei) * BigInt(1e9);
}

/**
 * Converts Wei to Gwei
 */
export function weiToGwei(wei: bigint): bigint {
  return wei / BigInt(1e9);
}

/**
 * Formats a BigInt value for display with optional formatting options
 */
export function formatBigInt(
  value: bigint,
  options: {
    decimals?: number;
    precision?: number;
    symbol?: string;
  } = {}
): string {
  const { decimals = 18, precision = 6, symbol } = options;
  
  const formatted = formatUnits(value, decimals);
  const num = parseFloat(formatted);
  
  // Handle very small numbers
  if (num !== 0 && Math.abs(num) < Math.pow(10, -precision)) {
    const result = num.toExponential(precision);
    return symbol ? `${result} ${symbol}` : result;
  }
  
  // Format with fixed precision
  const result = num.toFixed(precision).replace(/\.?0+$/, '');
  return symbol ? `${result} ${symbol}` : result;
}

/**
 * Safely converts a value to BigInt
 */
export function toBigInt(value: string | number | bigint): bigint {
  if (typeof value === 'bigint') {
    return value;
  }
  if (typeof value === 'number') {
    return BigInt(Math.floor(value));
  }
  // Handle decimal strings
  if (value.includes('.')) {
    const [whole, decimal] = value.split('.');
    return BigInt(whole || '0');
  }
  return BigInt(value);
}

/**
 * Converts BigInt shares to underlying token amount
 */
export function sharesToAmount(
  shares: bigint,
  totalShares: bigint,
  totalUnderlying: bigint
): bigint {
  if (totalShares === BigInt(0)) {
    return BigInt(0);
  }
  return (shares * totalUnderlying) / totalShares;
}

/**
 * Converts underlying token amount to shares
 */
export function amountToShares(
  amount: bigint,
  totalShares: bigint,
  totalUnderlying: bigint
): bigint {
  if (totalUnderlying === BigInt(0)) {
    return amount;
  }
  return (amount * totalShares) / totalUnderlying;
}

/**
 * Converts a value to a serializable format for n8n
 */
export function serializeBigInt(value: bigint): string {
  return value.toString();
}

/**
 * Converts all BigInt values in an object to strings for JSON serialization
 * Returns an object compatible with n8n's IDataObject
 */
export function serializeResult<T extends Record<string, unknown>>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  const result = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'bigint') {
      (result as Record<string, unknown>)[key] = value.toString();
    } else if (Array.isArray(value)) {
      (result as Record<string, unknown>)[key] = value.map((item) => {
        if (typeof item === 'bigint') return item.toString();
        if (item && typeof item === 'object') return serializeResult(item as Record<string, unknown>);
        return item;
      });
    } else if (value && typeof value === 'object') {
      (result as Record<string, unknown>)[key] = serializeResult(value as Record<string, unknown>);
    } else {
      (result as Record<string, unknown>)[key] = value;
    }
  }
  return result;
}
