/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ethers, JsonRpcProvider, FallbackProvider } from 'ethers';
import type { IExecuteFunctions, ILoadOptionsFunctions, ICredentialDataDecryptedObject } from 'n8n-workflow';

export type ProviderType = 'alchemy' | 'infura' | 'quicknode' | 'custom';
export type NetworkType = 'mainnet' | 'holesky';

export interface RpcCredentials {
  provider: ProviderType;
  apiKey?: string;
  customRpcUrl?: string;
  network: NetworkType;
  chainId: number;
}

/**
 * Constructs RPC URL based on provider type and network
 */
export function buildRpcUrl(credentials: RpcCredentials): string {
  const { provider, apiKey, customRpcUrl, network } = credentials;

  switch (provider) {
    case 'alchemy': {
      const subdomain = network === 'mainnet' ? 'eth-mainnet' : 'eth-holesky';
      return `https://${subdomain}.g.alchemy.com/v2/${apiKey}`;
    }
    case 'infura': {
      const subdomain = network === 'mainnet' ? 'mainnet' : 'holesky';
      return `https://${subdomain}.infura.io/v3/${apiKey}`;
    }
    case 'quicknode': {
      // QuickNode uses custom endpoints, apiKey is the full endpoint
      if (apiKey?.startsWith('http')) {
        return apiKey;
      }
      throw new Error('QuickNode requires a full endpoint URL as API key');
    }
    case 'custom': {
      if (!customRpcUrl) {
        throw new Error('Custom RPC URL is required');
      }
      return customRpcUrl;
    }
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Creates an ethers JsonRpcProvider from credentials
 */
export function createProvider(credentials: RpcCredentials): JsonRpcProvider {
  const url = buildRpcUrl(credentials);
  const chainId = credentials.network === 'mainnet' ? 1 : 17000;
  
  return new JsonRpcProvider(url, chainId, {
    staticNetwork: true,
    batchMaxCount: 10,
  });
}

/**
 * Gets RPC credentials from n8n execution context
 */
export async function getRpcCredentials(
  context: IExecuteFunctions | ILoadOptionsFunctions,
  itemIndex = 0
): Promise<RpcCredentials> {
  const credentials = await context.getCredentials('ethereumRpc', itemIndex) as ICredentialDataDecryptedObject;
  
  return {
    provider: credentials.provider as ProviderType,
    apiKey: credentials.apiKey as string | undefined,
    customRpcUrl: credentials.customRpcUrl as string | undefined,
    network: credentials.network as NetworkType,
    chainId: credentials.network === 'mainnet' ? 1 : 17000,
  };
}

/**
 * Creates provider from n8n execution context
 */
export async function getProvider(
  context: IExecuteFunctions | ILoadOptionsFunctions,
  itemIndex = 0
): Promise<JsonRpcProvider> {
  const credentials = await getRpcCredentials(context, itemIndex);
  return createProvider(credentials);
}

/**
 * Provider cache to avoid creating multiple connections
 */
const providerCache = new Map<string, JsonRpcProvider>();

/**
 * Gets or creates a cached provider
 */
export function getCachedProvider(credentials: RpcCredentials): JsonRpcProvider {
  const cacheKey = buildRpcUrl(credentials);
  
  let provider = providerCache.get(cacheKey);
  if (!provider) {
    provider = createProvider(credentials);
    providerCache.set(cacheKey, provider);
  }
  
  return provider;
}

/**
 * Clears the provider cache
 */
export function clearProviderCache(): void {
  providerCache.clear();
}

/**
 * Validates RPC connection
 */
export async function validateConnection(provider: JsonRpcProvider): Promise<{
  valid: boolean;
  chainId?: number;
  blockNumber?: number;
  error?: string;
}> {
  try {
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    
    return {
      valid: true,
      chainId: Number(network.chainId),
      blockNumber,
    };
  } catch (error) {
    return {
      valid: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Implements retry logic for RPC calls
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    backoffMultiplier?: number;
  } = {}
): Promise<T> {
  const { maxRetries = 3, delayMs = 1000, backoffMultiplier = 2 } = options;
  
  let lastError: Error | undefined;
  let delay = delayMs;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is retryable
      const errorMessage = lastError.message.toLowerCase();
      const isRateLimited = errorMessage.includes('rate limit') || 
                           errorMessage.includes('too many requests') ||
                           errorMessage.includes('429');
      const isTimeout = errorMessage.includes('timeout') || 
                       errorMessage.includes('timed out');
      
      if (!isRateLimited && !isTimeout && attempt < maxRetries) {
        throw lastError;
      }
      
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= backoffMultiplier;
      }
    }
  }
  
  throw lastError;
}
