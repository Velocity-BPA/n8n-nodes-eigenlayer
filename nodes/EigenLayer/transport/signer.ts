/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ethers, Wallet, HDNodeWallet, JsonRpcProvider, Signer } from 'ethers';
import type { IExecuteFunctions, ICredentialDataDecryptedObject } from 'n8n-workflow';
import { getProvider } from './rpcProvider';

export interface WalletCredentials {
  authMethod: 'privateKey' | 'mnemonic';
  privateKey?: string;
  mnemonic?: string;
  derivationPath?: string;
}

/**
 * Creates a wallet signer from credentials
 */
export function createSigner(
  credentials: WalletCredentials,
  provider: JsonRpcProvider
): Wallet | HDNodeWallet {
  if (credentials.authMethod === 'privateKey') {
    if (!credentials.privateKey) {
      throw new Error('Private key is required');
    }
    // Add 0x prefix if not present
    const privateKey = credentials.privateKey.startsWith('0x')
      ? credentials.privateKey
      : `0x${credentials.privateKey}`;
    return new Wallet(privateKey, provider);
  }

  if (credentials.authMethod === 'mnemonic') {
    if (!credentials.mnemonic) {
      throw new Error('Mnemonic phrase is required');
    }
    const path = credentials.derivationPath || "m/44'/60'/0'/0/0";
    const hdWallet = HDNodeWallet.fromPhrase(credentials.mnemonic, undefined, path);
    return hdWallet.connect(provider);
  }

  throw new Error(`Unsupported auth method: ${credentials.authMethod}`);
}

/**
 * Gets wallet credentials from n8n execution context
 */
export async function getWalletCredentials(
  context: IExecuteFunctions,
  itemIndex = 0
): Promise<WalletCredentials> {
  const credentials = await context.getCredentials('ethereumWallet', itemIndex) as ICredentialDataDecryptedObject;

  return {
    authMethod: credentials.authMethod as 'privateKey' | 'mnemonic',
    privateKey: credentials.privateKey as string | undefined,
    mnemonic: credentials.mnemonic as string | undefined,
    derivationPath: credentials.derivationPath as string | undefined,
  };
}

/**
 * Creates a signer from n8n execution context
 */
export async function getSigner(
  context: IExecuteFunctions,
  itemIndex = 0
): Promise<Wallet | HDNodeWallet> {
  const provider = await getProvider(context, itemIndex);
  const credentials = await getWalletCredentials(context, itemIndex);
  return createSigner(credentials, provider);
}

/**
 * Gets the address of a signer
 */
export async function getSignerAddress(signer: Signer): Promise<string> {
  return await signer.getAddress();
}

/**
 * Gets the nonce for a signer (for sequential transactions)
 */
export async function getSignerNonce(signer: Signer): Promise<number> {
  const address = await getSignerAddress(signer);
  const provider = signer.provider;
  if (!provider) {
    throw new Error('Signer must be connected to a provider');
  }
  return await provider.getTransactionCount(address, 'pending');
}

/**
 * Gets the balance of a signer
 */
export async function getSignerBalance(signer: Signer): Promise<bigint> {
  const address = await getSignerAddress(signer);
  const provider = signer.provider;
  if (!provider) {
    throw new Error('Signer must be connected to a provider');
  }
  return await provider.getBalance(address);
}

/**
 * Validates signer has sufficient balance for transaction
 */
export async function validateSignerBalance(
  signer: Signer,
  requiredWei: bigint,
  options: { includeGas?: boolean; gasLimit?: bigint; gasPrice?: bigint } = {}
): Promise<{ sufficient: boolean; balance: bigint; required: bigint }> {
  const balance = await getSignerBalance(signer);
  
  let required = requiredWei;
  if (options.includeGas && options.gasLimit && options.gasPrice) {
    required += options.gasLimit * options.gasPrice;
  }
  
  return {
    sufficient: balance >= required,
    balance,
    required,
  };
}

/**
 * Signs a message with the signer
 */
export async function signMessage(signer: Signer, message: string): Promise<string> {
  return await signer.signMessage(message);
}

/**
 * Recovers the address from a signed message
 */
export function recoverAddress(message: string, signature: string): string {
  return ethers.verifyMessage(message, signature);
}
