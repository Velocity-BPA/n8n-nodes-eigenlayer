/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  formatUnits,
  parseUnits,
  formatEther,
  parseEther,
  weiToGwei,
  serializeResult,
} from '../../nodes/EigenLayer/utils/bigNumberConversion';

describe('bigNumberConversion', () => {
  describe('formatUnits', () => {
    it('should format with default 18 decimals', () => {
      const value = BigInt('1000000000000000000'); // 1e18
      expect(formatUnits(value)).toBe('1.0');
    });

    it('should format with custom decimals', () => {
      const value = BigInt('1000000'); // 1e6
      expect(formatUnits(value, 6)).toBe('1.0');
    });

    it('should handle zero', () => {
      expect(formatUnits(BigInt(0))).toBe('0.0');
    });

    it('should handle large numbers', () => {
      const value = BigInt('1000000000000000000000000'); // 1 million with 18 decimals
      expect(formatUnits(value)).toBe('1000000.0');
    });
  });

  describe('parseUnits', () => {
    it('should parse string to BigInt with default decimals', () => {
      const result = parseUnits('1.0');
      expect(result).toBe(BigInt('1000000000000000000'));
    });

    it('should parse string with custom decimals', () => {
      const result = parseUnits('1.0', 6);
      expect(result).toBe(BigInt('1000000'));
    });

    it('should handle decimals in input', () => {
      const result = parseUnits('1.5');
      expect(result).toBe(BigInt('1500000000000000000'));
    });
  });

  describe('formatEther', () => {
    it('should format wei to ether', () => {
      const wei = BigInt('1000000000000000000');
      expect(formatEther(wei)).toBe('1.0');
    });
  });

  describe('parseEther', () => {
    it('should parse ether to wei', () => {
      const result = parseEther('1.0');
      expect(result).toBe(BigInt('1000000000000000000'));
    });
  });

  describe('weiToGwei', () => {
    it('should convert wei to gwei', () => {
      const wei = BigInt('1000000000');
      expect(weiToGwei(wei)).toBe(BigInt(1));
    });
  });

  describe('serializeResult', () => {
    it('should convert bigint to string', () => {
      const obj = { value: BigInt('12345678901234567890') };
      const result = serializeResult(obj);
      expect(result.value).toBe('12345678901234567890');
    });

    it('should handle nested objects', () => {
      const obj = { 
        outer: { inner: BigInt(100) },
        array: [BigInt(1), BigInt(2)]
      };
      const result = serializeResult(obj);
      const outer = result.outer as { inner: string };
      expect(outer.inner).toBe('100');
      expect(result.array).toEqual(['1', '2']);
    });
  });
});
