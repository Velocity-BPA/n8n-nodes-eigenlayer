/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  MAINNET_ADDRESSES,
  HOLESKY_ADDRESSES,
  STRATEGY_METADATA,
  getContractAddress,
  getStrategyMetadata,
} from '../../nodes/EigenLayer/constants';

describe('constants', () => {
  describe('MAINNET_ADDRESSES', () => {
    it('should have DelegationManager address', () => {
      expect(MAINNET_ADDRESSES.DelegationManager).toBe('0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A');
    });

    it('should have StrategyManager address', () => {
      expect(MAINNET_ADDRESSES.StrategyManager).toBe('0x858646372CC42E1A627fcE94aa7A7033e7CF075A');
    });

    it('should have EigenPodManager address', () => {
      expect(MAINNET_ADDRESSES.EigenPodManager).toBe('0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338');
    });

    it('should have AVSDirectory address', () => {
      expect(MAINNET_ADDRESSES.AVSDirectory).toBe('0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF');
    });

    it('should have RewardsCoordinator address', () => {
      expect(MAINNET_ADDRESSES.RewardsCoordinator).toBe('0x7750d328b314EfFa365A0402CcfD489B80B0adda');
    });
  });

  describe('HOLESKY_ADDRESSES', () => {
    it('should have DelegationManager address', () => {
      expect(HOLESKY_ADDRESSES.DelegationManager).toBe('0xA44151489861Fe9e3055d95adC98FbD462B948e7');
    });

    it('should have StrategyManager address', () => {
      expect(HOLESKY_ADDRESSES.StrategyManager).toBe('0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6');
    });
  });

  describe('STRATEGY_METADATA', () => {
    it('should have stETH strategy metadata', () => {
      const stETH = STRATEGY_METADATA.find((s) => s.symbol === 'stETH');
      expect(stETH).toBeDefined();
      expect(stETH?.name).toBe('Lido Staked ETH');
      expect(stETH?.decimals).toBe(18);
    });

    it('should have rETH strategy metadata', () => {
      const rETH = STRATEGY_METADATA.find((s) => s.symbol === 'rETH');
      expect(rETH).toBeDefined();
      expect(rETH?.name).toBe('Rocket Pool ETH');
    });

    it('should have all strategies with addresses', () => {
      STRATEGY_METADATA.forEach((strategy) => {
        expect(strategy.strategyAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
        expect(strategy.tokenAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
      });
    });
  });

  describe('getContractAddress', () => {
    it('should return mainnet address for chain 1', () => {
      expect(getContractAddress('DelegationManager', 1)).toBe(MAINNET_ADDRESSES.DelegationManager);
    });

    it('should return holesky address for chain 17000', () => {
      expect(getContractAddress('DelegationManager', 17000)).toBe(HOLESKY_ADDRESSES.DelegationManager);
    });

    it('should throw for unsupported chain', () => {
      expect(() => getContractAddress('DelegationManager', 999)).toThrow();
    });
  });

  describe('getStrategyMetadata', () => {
    it('should return metadata for known strategy address', () => {
      const metadata = getStrategyMetadata('0x93c4b944D05dfe6df7645A86cd2206016c51564D');
      expect(metadata).toBeDefined();
      expect(metadata?.symbol).toBe('stETH');
    });

    it('should return undefined for unknown address', () => {
      const metadata = getStrategyMetadata('0x0000000000000000000000000000000000000000');
      expect(metadata).toBeUndefined();
    });
  });
});
