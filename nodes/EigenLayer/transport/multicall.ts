/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ethers, Contract, JsonRpcProvider, Interface } from 'ethers';

// Multicall3 contract address (deployed on most networks)
export const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11';

// Multicall3 ABI
export const MULTICALL3_ABI = [
  'function aggregate(tuple(address target, bytes callData)[] calls) public payable returns (uint256 blockNumber, bytes[] returnData)',
  'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) public payable returns (tuple(bool success, bytes returnData)[])',
  'function aggregate3Value(tuple(address target, bool allowFailure, uint256 value, bytes callData)[] calls) public payable returns (tuple(bool success, bytes returnData)[])',
  'function blockAndAggregate(tuple(address target, bytes callData)[] calls) public payable returns (uint256 blockNumber, bytes32 blockHash, tuple(bool success, bytes returnData)[] returnData)',
  'function getBasefee() public view returns (uint256 basefee)',
  'function getBlockHash(uint256 blockNumber) public view returns (bytes32 blockHash)',
  'function getBlockNumber() public view returns (uint256 blockNumber)',
  'function getChainId() public view returns (uint256 chainid)',
  'function getCurrentBlockCoinbase() public view returns (address coinbase)',
  'function getCurrentBlockDifficulty() public view returns (uint256 difficulty)',
  'function getCurrentBlockGasLimit() public view returns (uint256 gaslimit)',
  'function getCurrentBlockTimestamp() public view returns (uint256 timestamp)',
  'function getEthBalance(address addr) public view returns (uint256 balance)',
  'function getLastBlockHash() public view returns (bytes32 blockHash)',
  'function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) public payable returns (tuple(bool success, bytes returnData)[])',
  'function tryBlockAndAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) public payable returns (uint256 blockNumber, bytes32 blockHash, tuple(bool success, bytes returnData)[] returnData)',
];

export interface Call {
  target: string;
  callData: string;
  allowFailure?: boolean;
}

export interface CallWithAbi {
  target: string;
  abi: string[];
  functionName: string;
  args: unknown[];
  allowFailure?: boolean;
}

export interface MulticallResult {
  success: boolean;
  returnData: string;
  decoded?: unknown;
  error?: string;
}

/**
 * Creates a Multicall3 contract instance
 */
export function getMulticallContract(provider: JsonRpcProvider): Contract {
  return new Contract(MULTICALL3_ADDRESS, MULTICALL3_ABI, provider);
}

/**
 * Encodes a function call for multicall
 */
export function encodeCall(abi: string[], functionName: string, args: unknown[]): string {
  const iface = new Interface(abi);
  return iface.encodeFunctionData(functionName, args);
}

/**
 * Decodes a function return value
 */
export function decodeResult(abi: string[], functionName: string, data: string): unknown {
  const iface = new Interface(abi);
  return iface.decodeFunctionResult(functionName, data);
}

/**
 * Executes multiple read calls in a single request
 */
export async function multicall(
  provider: JsonRpcProvider,
  calls: CallWithAbi[]
): Promise<MulticallResult[]> {
  const multicallContract = getMulticallContract(provider);

  // Prepare calls
  const encodedCalls: { target: string; allowFailure: boolean; callData: string }[] = calls.map((call) => ({
    target: call.target,
    allowFailure: call.allowFailure ?? true,
    callData: encodeCall(call.abi, call.functionName, call.args),
  }));

  // Execute multicall
  const results: { success: boolean; returnData: string }[] =
    await multicallContract.aggregate3(encodedCalls);

  // Decode results
  return results.map((result, index) => {
    const call = calls[index];
    const output: MulticallResult = {
      success: result.success,
      returnData: result.returnData,
    };

    if (result.success && result.returnData !== '0x') {
      try {
        const decoded = decodeResult(call.abi, call.functionName, result.returnData);
        // Handle single return value vs tuple
        output.decoded = Array.isArray(decoded) && decoded.length === 1 ? decoded[0] : decoded;
      } catch (error) {
        output.error = `Failed to decode: ${(error as Error).message}`;
      }
    } else if (!result.success) {
      output.error = 'Call reverted';
    }

    return output;
  });
}

/**
 * Executes a batch of calls with automatic chunking
 */
export async function batchedMulticall(
  provider: JsonRpcProvider,
  calls: CallWithAbi[],
  options: { chunkSize?: number } = {}
): Promise<MulticallResult[]> {
  const { chunkSize = 50 } = options;

  if (calls.length <= chunkSize) {
    return multicall(provider, calls);
  }

  // Split into chunks
  const chunks: CallWithAbi[][] = [];
  for (let i = 0; i < calls.length; i += chunkSize) {
    chunks.push(calls.slice(i, i + chunkSize));
  }

  // Execute chunks in parallel (with limit)
  const results: MulticallResult[][] = [];
  const parallelLimit = 5;

  for (let i = 0; i < chunks.length; i += parallelLimit) {
    const batch = chunks.slice(i, i + parallelLimit);
    const batchResults = await Promise.all(batch.map((chunk) => multicall(provider, chunk)));
    results.push(...batchResults);
  }

  // Flatten results
  return results.flat();
}

/**
 * Creates calls for getting multiple token balances
 */
export function createBalanceOfCalls(
  tokenAddresses: string[],
  account: string,
  tokenAbi: string[]
): CallWithAbi[] {
  return tokenAddresses.map((token) => ({
    target: token,
    abi: tokenAbi,
    functionName: 'balanceOf',
    args: [account],
  }));
}

/**
 * Creates calls for getting multiple strategy shares
 */
export function createSharesCalls(
  strategies: string[],
  account: string,
  strategyAbi: string[]
): CallWithAbi[] {
  return strategies.map((strategy) => ({
    target: strategy,
    abi: strategyAbi,
    functionName: 'shares',
    args: [account],
  }));
}

/**
 * Helper to execute a single call without multicall
 */
export async function singleCall(
  provider: JsonRpcProvider,
  target: string,
  abi: string[],
  functionName: string,
  args: unknown[]
): Promise<unknown> {
  const contract = new Contract(target, abi, provider);
  return await contract[functionName](...args);
}
