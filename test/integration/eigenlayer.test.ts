/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Integration tests for EigenLayer node
 *
 * These tests require access to an Ethereum RPC endpoint.
 * Set the following environment variables to run:
 * - TEST_RPC_URL: Ethereum RPC URL (mainnet or holesky)
 * - TEST_CHAIN_ID: Chain ID (1 for mainnet, 17000 for holesky)
 *
 * Example:
 * TEST_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY TEST_CHAIN_ID=1 npm test
 */

describe('EigenLayer Integration Tests', () => {
  const skipIfNoRpc = () => {
    if (!process.env.TEST_RPC_URL) {
      return true;
    }
    return false;
  };

  describe('Contract ABIs', () => {
    it('should export all required ABIs', () => {
      // This test verifies all ABIs are properly exported
      const { 
        DelegationManagerABI,
        StrategyManagerABI,
        EigenPodManagerABI,
        EigenPodABI,
        AVSDirectoryABI,
        RewardsCoordinatorABI,
        AllocationManagerABI,
        StrategyABI,
        IERC20ABI,
      } = require('../../nodes/EigenLayer/contracts');

      expect(DelegationManagerABI).toBeDefined();
      expect(Array.isArray(DelegationManagerABI)).toBe(true);
      expect(StrategyManagerABI).toBeDefined();
      expect(EigenPodManagerABI).toBeDefined();
      expect(EigenPodABI).toBeDefined();
      expect(AVSDirectoryABI).toBeDefined();
      expect(RewardsCoordinatorABI).toBeDefined();
      expect(AllocationManagerABI).toBeDefined();
      expect(StrategyABI).toBeDefined();
      expect(IERC20ABI).toBeDefined();
    });
  });

  describe('Node Definition', () => {
    it('should have valid node description', () => {
      const { EigenLayer } = require('../../nodes/EigenLayer/EigenLayer.node');
      const node = new EigenLayer();

      expect(node.description).toBeDefined();
      expect(node.description.displayName).toBe('EigenLayer');
      expect(node.description.name).toBe('eigenLayer');
      expect(node.description.group).toContain('transform');
      expect(node.description.credentials).toBeDefined();
    });

    it('should have all required resources', () => {
      const { EigenLayer } = require('../../nodes/EigenLayer/EigenLayer.node');
      const node = new EigenLayer();

      const resourceProperty = node.description.properties.find(
        (p: { name: string }) => p.name === 'resource'
      );

      expect(resourceProperty).toBeDefined();
      expect(resourceProperty.options).toBeDefined();

      const resourceNames = resourceProperty.options.map((o: { value: string }) => o.value);
      expect(resourceNames).toContain('strategyManager');
      expect(resourceNames).toContain('delegationManager');
      expect(resourceNames).toContain('eigenPodManager');
      expect(resourceNames).toContain('eigenPod');
      expect(resourceNames).toContain('avsDirectory');
      expect(resourceNames).toContain('rewardsCoordinator');
      expect(resourceNames).toContain('allocationManager');
      expect(resourceNames).toContain('strategy');
      expect(resourceNames).toContain('multicall');
    });
  });

  describe('Trigger Node Definition', () => {
    it('should have valid trigger node description', () => {
      const { EigenLayerTrigger } = require('../../nodes/EigenLayer/EigenLayerTrigger.node');
      const node = new EigenLayerTrigger();

      expect(node.description).toBeDefined();
      expect(node.description.displayName).toBe('EigenLayer Trigger');
      expect(node.description.name).toBe('eigenLayerTrigger');
      expect(node.description.polling).toBe(true);
    });
  });

  describe('RPC Integration', () => {
    // Skip these tests if no RPC URL is configured
    (skipIfNoRpc() ? it.skip : it)('should connect to RPC endpoint', async () => {
      const { JsonRpcProvider } = require('ethers');
      const provider = new JsonRpcProvider(process.env.TEST_RPC_URL);
      const blockNumber = await provider.getBlockNumber();
      expect(blockNumber).toBeGreaterThan(0);
    });
  });
});
