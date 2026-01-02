/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { 
  validateAddress, 
  isValidAddress, 
  toChecksumAddress,
  addressesEqual,
  isZeroAddress,
} from '../../nodes/EigenLayer/utils/addressValidation';

describe('addressValidation', () => {
  // Use a known valid address for testing
  const validAddress = '0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A';
  const validAddressLowercase = '0x39053d51b77dc0d36036fc1fcc8cb819df8ef37a';

  describe('isValidAddress', () => {
    it('should return true for valid checksummed address', () => {
      expect(isValidAddress(validAddress)).toBe(true);
    });

    it('should return true for lowercase address', () => {
      expect(isValidAddress(validAddressLowercase)).toBe(true);
    });

    it('should return false for invalid address', () => {
      expect(isValidAddress('invalid')).toBe(false);
    });

    it('should return false for address without 0x prefix', () => {
      expect(isValidAddress('39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A')).toBe(false);
    });

    it('should return false for too short address', () => {
      expect(isValidAddress('0x39053D51')).toBe(false);
    });
  });

  describe('validateAddress', () => {
    it('should return checksum address for valid input', () => {
      const result = validateAddress(validAddressLowercase);
      expect(result.length).toBe(42);
      expect(result.startsWith('0x')).toBe(true);
    });

    it('should throw for invalid address', () => {
      expect(() => validateAddress('invalid')).toThrow('Invalid address');
    });

    it('should throw for empty address', () => {
      expect(() => validateAddress('')).toThrow('address is required');
    });

    it('should include field name in error message', () => {
      expect(() => validateAddress('invalid', 'operatorAddress')).toThrow('Invalid operatorAddress');
    });
  });

  describe('toChecksumAddress', () => {
    it('should convert to checksum format', () => {
      const result = toChecksumAddress(validAddressLowercase);
      expect(result.length).toBe(42);
      expect(result.startsWith('0x')).toBe(true);
    });

    it('should throw for invalid address', () => {
      expect(() => toChecksumAddress('invalid')).toThrow('Invalid Ethereum address');
    });
  });

  describe('addressesEqual', () => {
    it('should return true for same addresses', () => {
      expect(addressesEqual(validAddressLowercase, validAddress)).toBe(true);
    });

    it('should return false for different addresses', () => {
      expect(addressesEqual(
        validAddress,
        '0x0000000000000000000000000000000000000000'
      )).toBe(false);
    });
  });

  describe('isZeroAddress', () => {
    it('should return true for zero address', () => {
      expect(isZeroAddress('0x0000000000000000000000000000000000000000')).toBe(true);
    });

    it('should return false for non-zero address', () => {
      expect(isZeroAddress(validAddress)).toBe(false);
    });
  });
});
