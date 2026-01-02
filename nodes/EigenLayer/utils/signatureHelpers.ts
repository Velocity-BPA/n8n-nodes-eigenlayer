/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ethers, Signer, TypedDataDomain, TypedDataField } from 'ethers';

/**
 * EIP-712 Domain for EigenLayer contracts
 */
export function getEigenLayerDomain(
  name: string,
  chainId: number,
  verifyingContract: string
): TypedDataDomain {
  return {
    name,
    version: '1',
    chainId,
    verifyingContract,
  };
}

/**
 * Delegation approval signature types
 */
export const DELEGATION_APPROVAL_TYPES: Record<string, TypedDataField[]> = {
  DelegationApproval: [
    { name: 'delegationApprover', type: 'address' },
    { name: 'staker', type: 'address' },
    { name: 'operator', type: 'address' },
    { name: 'salt', type: 'bytes32' },
    { name: 'expiry', type: 'uint256' },
  ],
};

/**
 * Staker delegation signature types
 */
export const STAKER_DELEGATION_TYPES: Record<string, TypedDataField[]> = {
  StakerDelegation: [
    { name: 'staker', type: 'address' },
    { name: 'operator', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'expiry', type: 'uint256' },
  ],
};

/**
 * Deposit signature types
 */
export const DEPOSIT_TYPES: Record<string, TypedDataField[]> = {
  Deposit: [
    { name: 'staker', type: 'address' },
    { name: 'strategy', type: 'address' },
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'expiry', type: 'uint256' },
  ],
};

/**
 * AVS registration signature types
 */
export const AVS_REGISTRATION_TYPES: Record<string, TypedDataField[]> = {
  OperatorAVSRegistration: [
    { name: 'operator', type: 'address' },
    { name: 'avs', type: 'address' },
    { name: 'salt', type: 'bytes32' },
    { name: 'expiry', type: 'uint256' },
  ],
};

/**
 * Signs EIP-712 typed data
 */
export async function signTypedData(
  signer: Signer,
  domain: TypedDataDomain,
  types: Record<string, TypedDataField[]>,
  value: Record<string, unknown>
): Promise<string> {
  // Remove EIP712Domain from types if present (ethers handles this automatically)
  const cleanTypes = { ...types };
  delete cleanTypes.EIP712Domain;
  
  return await signer.signTypedData(domain, cleanTypes, value);
}

/**
 * Creates a delegation approval signature
 */
export async function signDelegationApproval(
  signer: Signer,
  params: {
    chainId: number;
    delegationManager: string;
    delegationApprover: string;
    staker: string;
    operator: string;
    salt: string;
    expiry: bigint;
  }
): Promise<string> {
  const domain = getEigenLayerDomain('EigenLayer', params.chainId, params.delegationManager);
  
  const value = {
    delegationApprover: params.delegationApprover,
    staker: params.staker,
    operator: params.operator,
    salt: params.salt,
    expiry: params.expiry,
  };
  
  return signTypedData(signer, domain, DELEGATION_APPROVAL_TYPES, value);
}

/**
 * Creates a staker delegation signature
 */
export async function signStakerDelegation(
  signer: Signer,
  params: {
    chainId: number;
    delegationManager: string;
    staker: string;
    operator: string;
    nonce: bigint;
    expiry: bigint;
  }
): Promise<string> {
  const domain = getEigenLayerDomain('EigenLayer', params.chainId, params.delegationManager);
  
  const value = {
    staker: params.staker,
    operator: params.operator,
    nonce: params.nonce,
    expiry: params.expiry,
  };
  
  return signTypedData(signer, domain, STAKER_DELEGATION_TYPES, value);
}

/**
 * Creates a deposit signature
 */
export async function signDeposit(
  signer: Signer,
  params: {
    chainId: number;
    strategyManager: string;
    staker: string;
    strategy: string;
    token: string;
    amount: bigint;
    nonce: bigint;
    expiry: bigint;
  }
): Promise<string> {
  const domain = getEigenLayerDomain('EigenLayer', params.chainId, params.strategyManager);
  
  const value = {
    staker: params.staker,
    strategy: params.strategy,
    token: params.token,
    amount: params.amount,
    nonce: params.nonce,
    expiry: params.expiry,
  };
  
  return signTypedData(signer, domain, DEPOSIT_TYPES, value);
}

/**
 * Creates an AVS registration signature
 */
export async function signAVSRegistration(
  signer: Signer,
  params: {
    chainId: number;
    avsDirectory: string;
    operator: string;
    avs: string;
    salt: string;
    expiry: bigint;
  }
): Promise<string> {
  const domain = getEigenLayerDomain('EigenLayer', params.chainId, params.avsDirectory);
  
  const value = {
    operator: params.operator,
    avs: params.avs,
    salt: params.salt,
    expiry: params.expiry,
  };
  
  return signTypedData(signer, domain, AVS_REGISTRATION_TYPES, value);
}

/**
 * Generates a random salt for signatures
 */
export function generateSalt(): string {
  return ethers.hexlify(ethers.randomBytes(32));
}

/**
 * Calculates signature expiry timestamp
 */
export function calculateExpiry(hoursFromNow = 24): bigint {
  const now = Math.floor(Date.now() / 1000);
  return BigInt(now + hoursFromNow * 3600);
}

/**
 * Encodes signature with expiry for contract calls
 */
export interface SignatureWithExpiry {
  signature: string;
  expiry: bigint;
}

/**
 * Creates empty signature (for operators without delegation approver)
 */
export function emptySignature(): SignatureWithExpiry {
  return {
    signature: '0x',
    expiry: BigInt(0),
  };
}
