/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ethers } from 'ethers';

/**
 * Validates an Ethereum address
 */
export function isValidAddress(address: string): boolean {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Converts address to checksum format
 */
export function toChecksumAddress(address: string): string {
  if (!isValidAddress(address)) {
    throw new Error(`Invalid Ethereum address: ${address}`);
  }
  return ethers.getAddress(address);
}

/**
 * Validates and returns checksum address, throws on invalid
 */
export function validateAddress(address: string, fieldName = 'address'): string {
  if (!address || address.trim() === '') {
    throw new Error(`${fieldName} is required`);
  }
  
  if (!isValidAddress(address)) {
    throw new Error(`Invalid ${fieldName}: ${address}`);
  }
  
  return toChecksumAddress(address);
}

/**
 * Validates an array of addresses
 */
export function validateAddresses(addresses: string[], fieldName = 'addresses'): string[] {
  if (!addresses || addresses.length === 0) {
    throw new Error(`${fieldName} array is required and cannot be empty`);
  }
  
  return addresses.map((addr, index) => 
    validateAddress(addr, `${fieldName}[${index}]`)
  );
}

/**
 * Check if two addresses are equal (case-insensitive)
 */
export function addressesEqual(addr1: string, addr2: string): boolean {
  try {
    return toChecksumAddress(addr1) === toChecksumAddress(addr2);
  } catch {
    return false;
  }
}

/**
 * Zero address constant
 */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * Check if address is zero address
 */
export function isZeroAddress(address: string): boolean {
  return addressesEqual(address, ZERO_ADDRESS);
}
