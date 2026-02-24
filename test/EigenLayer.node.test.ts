/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { EigenLayer } from '../nodes/EigenLayer/EigenLayer.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('EigenLayer Node', () => {
  let node: EigenLayer;

  beforeAll(() => {
    node = new EigenLayer();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('EigenLayer');
      expect(node.description.name).toBe('eigenlayer');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Operators Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://holesky-api.eigenlayer.xyz/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAllOperators', () => {
    it('should get all operators successfully', async () => {
      const mockResponse = {
        data: [
          { address: '0x123...', name: 'Operator 1', status: 'active' },
          { address: '0x456...', name: 'Operator 2', status: 'active' }
        ],
        total: 2
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getAllOperators';
          case 'limit': return 100;
          case 'offset': return 0;
          case 'status': return 'active';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeOperatorsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://holesky-api.eigenlayer.xyz/v1/operators?limit=100&offset=0&status=active',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle errors when getting all operators', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAllOperators';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const items = [{ json: {} }];

      await expect(executeOperatorsOperations.call(mockExecuteFunctions, items))
        .rejects.toThrow('API Error');
    });
  });

  describe('getOperator', () => {
    it('should get specific operator successfully', async () => {
      const mockResponse = {
        address: '0x123...',
        name: 'Test Operator',
        status: 'active',
        metadata: {}
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getOperator';
          case 'address': return '0x123...';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeOperatorsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://holesky-api.eigenlayer.xyz/v1/operators/0x123...',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should throw error when address is missing', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getOperator';
          case 'address': return '';
          default: return undefined;
        }
      });

      const items = [{ json: {} }];

      await expect(executeOperatorsOperations.call(mockExecuteFunctions, items))
        .rejects.toThrow('Address is required');
    });
  });

  describe('getOperatorDelegations', () => {
    it('should get operator delegations successfully', async () => {
      const mockResponse = {
        data: [
          { delegator: '0xabc...', amount: '1000000000000000000' },
          { delegator: '0xdef...', amount: '2000000000000000000' }
        ],
        total: 2
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getOperatorDelegations';
          case 'address': return '0x123...';
          case 'limit': return 50;
          case 'offset': return 10;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeOperatorsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://holesky-api.eigenlayer.xyz/v1/operators/0x123.../delegations?limit=50&offset=10',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getOperatorAVS', () => {
    it('should get operator AVS registrations successfully', async () => {
      const mockResponse = {
        data: [
          { avsAddress: '0xavs1...', name: 'AVS 1', registeredAt: '2024-01-01T00:00:00Z' },
          { avsAddress: '0xavs2...', name: 'AVS 2', registeredAt: '2024-01-02T00:00:00Z' }
        ],
        total: 2
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getOperatorAVS';
          case 'address': return '0x123...';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeOperatorsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://holesky-api.eigenlayer.xyz/v1/operators/0x123.../avs',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });
});

describe('Delegations Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://holesky-api.eigenlayer.xyz/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAllDelegations', () => {
    it('should retrieve all delegations successfully', async () => {
      const mockResponse = {
        delegations: [
          {
            staker: '0x123',
            operator: '0x456',
            timestamp: '2024-01-01T00:00:00Z'
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getAllDelegations';
          case 'staker': return '0x123';
          case 'operator': return '0x456';
          case 'limit': return 100;
          case 'offset': return 0;
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDelegationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://holesky-api.eigenlayer.xyz/v1/delegations?staker=0x123&operator=0x456&limit=100&offset=0',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getStakerDelegations', () => {
    it('should get delegations for a specific staker', async () => {
      const mockResponse = {
        staker: '0x123',
        delegations: [
          {
            operator: '0x456',
            amount: '1000000000000000000'
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getStakerDelegations';
          case 'staker': return '0x123';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDelegationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://holesky-api.eigenlayer.xyz/v1/delegations/0x123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should throw error when staker address is missing', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getStakerDelegations';
          case 'staker': return '';
          default: return '';
        }
      });

      await expect(
        executeDelegationsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Staker address is required');
    });
  });

  describe('getDelegatedOperator', () => {
    it('should get delegated operator for a staker', async () => {
      const mockResponse = {
        staker: '0x123',
        operator: '0x456',
        delegatedAt: '2024-01-01T00:00:00Z'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getDelegatedOperator';
          case 'staker': return '0x123';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDelegationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://holesky-api.eigenlayer.xyz/v1/delegations/0x123/operator',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getDelegationRewards', () => {
    it('should get delegation rewards', async () => {
      const mockResponse = {
        rewards: [
          {
            staker: '0x123',
            operator: '0x456',
            amount: '500000000000000000',
            token: '0x789'
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getDelegationRewards';
          case 'staker': return '0x123';
          case 'operator': return '0x456';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDelegationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://holesky-api.eigenlayer.xyz/v1/delegations/rewards?staker=0x123&operator=0x456',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const mockError = {
        message: 'API Error',
        httpCode: 400
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getAllDelegations';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      await expect(
        executeDelegationsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });

    it('should continue on fail when configured', async () => {
      const mockError = new Error('Test error');
      
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getAllDelegations';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      const result = await executeDelegationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Test error');
    });
  });
});

describe('EigenPods Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://holesky-api.eigenlayer.xyz/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAllEigenPods', () => {
    it('should retrieve all EigenPods successfully', async () => {
      const mockResponse = {
        eigenPods: [
          {
            address: '0x1234567890123456789012345678901234567890',
            owner: '0x0987654321098765432109876543210987654321',
            status: 'active',
            totalStaked: '32000000000000000000',
          },
        ],
        total: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getAllEigenPods';
          case 'owner': return '';
          case 'status': return '';
          case 'limit': return 100;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEigenPodsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle errors when retrieving EigenPods', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getAllEigenPods';
          case 'owner': return '';
          case 'status': return '';
          case 'limit': return 100;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeEigenPodsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('getEigenPod', () => {
    it('should retrieve specific EigenPod details successfully', async () => {
      const mockResponse = {
        address: '0x1234567890123456789012345678901234567890',
        owner: '0x0987654321098765432109876543210987654321',
        status: 'active',
        totalStaked: '32000000000000000000',
        validators: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getEigenPod';
          case 'address': return '0x1234567890123456789012345678901234567890';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEigenPodsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle invalid address format', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getEigenPod';
          case 'address': return 'invalid-address';
          default: return undefined;
        }
      });

      await expect(
        executeEigenPodsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Invalid EigenPod address');
    });
  });

  describe('getEigenPodValidators', () => {
    it('should retrieve EigenPod validators successfully', async () => {
      const mockResponse = {
        validators: [
          {
            publicKey: '0xabcd...',
            status: 'active',
            balance: '32000000000000000000',
            effectiveBalance: '32000000000000000000',
          },
        ],
        total: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getEigenPodValidators';
          case 'address': return '0x1234567890123456789012345678901234567890';
          case 'validatorStatus': return 'active';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEigenPodsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getEigenPodWithdrawals', () => {
    it('should retrieve EigenPod withdrawals successfully', async () => {
      const mockResponse = {
        withdrawals: [
          {
            amount: '1000000000000000000',
            timestamp: '2024-01-01T00:00:00Z',
            transactionHash: '0xabcd1234...',
            status: 'completed',
          },
        ],
        total: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getEigenPodWithdrawals';
          case 'address': return '0x1234567890123456789012345678901234567890';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEigenPodsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('AVS Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://holesky-api.eigenlayer.xyz/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('getAllAVS should retrieve list of all AVS', async () => {
    const mockResponse = {
      data: [
        { address: '0x123...', name: 'Test AVS 1', status: 'active' },
        { address: '0x456...', name: 'Test AVS 2', status: 'active' }
      ],
      total: 2,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getAllAVS';
        case 'limit': return 100;
        case 'offset': return 0;
        case 'status': return 'active';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAVSOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://holesky-api.eigenlayer.xyz/v1/avs?limit=100&offset=0&status=active',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getAVS should retrieve specific AVS details', async () => {
    const mockResponse = {
      address: '0x123...',
      name: 'Test AVS',
      description: 'Test AVS Description',
      status: 'active',
      metadata: {},
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getAVS';
        case 'address': return '0x123...';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAVSOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://holesky-api.eigenlayer.xyz/v1/avs/0x123...',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getAVSOperators should retrieve operators for specific AVS', async () => {
    const mockResponse = {
      data: [
        { address: '0xoperator1...', stake: '1000000', status: 'active' },
        { address: '0xoperator2...', stake: '2000000', status: 'active' }
      ],
      total: 2,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getAVSOperators';
        case 'address': return '0x123...';
        case 'limit': return 100;
        case 'offset': return 0;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAVSOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://holesky-api.eigenlayer.xyz/v1/avs/0x123.../operators?limit=100&offset=0',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getAVSRewards should retrieve reward information for specific AVS', async () => {
    const mockResponse = {
      epoch: 123,
      totalRewards: '5000000',
      distributedRewards: '4500000',
      pendingRewards: '500000',
      rewards: [],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getAVSRewards';
        case 'address': return '0x123...';
        case 'epoch': return 123;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAVSOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://holesky-api.eigenlayer.xyz/v1/avs/0x123.../rewards?epoch=123',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getAVS';
        case 'address': return '0x123...';
        default: return undefined;
      }
    });

    const mockError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    await expect(
      executeAVSOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });

  test('should handle missing required address parameter', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getAVS';
        case 'address': return '';
        default: return undefined;
      }
    });

    await expect(
      executeAVSOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('AVS address is required');
  });
});

describe('Restaking Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://holesky-api.eigenlayer.xyz/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getStrategies operation', () => {
    it('should get strategies successfully', async () => {
      const mockResponse = {
        strategies: [
          {
            address: '0x123...',
            name: 'Strategy 1',
            totalValueLocked: '1000000',
          },
        ],
        total: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getStrategies';
          case 'limit':
            return 100;
          case 'offset':
            return 0;
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRestakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://holesky-api.eigenlayer.xyz/v1/restaking/strategies?limit=100&offset=0',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle getStrategies error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getStrategies';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeRestakingOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('getDeposits operation', () => {
    it('should get deposits successfully', async () => {
      const mockResponse = {
        deposits: [
          {
            staker: '0x123...',
            strategy: '0x456...',
            amount: '1000000',
            blockNumber: 12345,
          },
        ],
        total: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getDeposits';
          case 'staker':
            return '0x123...';
          case 'strategy':
            return '0x456...';
          case 'limit':
            return 100;
          case 'offset':
            return 0;
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRestakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('getWithdrawals operation', () => {
    it('should get withdrawals successfully', async () => {
      const mockResponse = {
        withdrawals: [
          {
            staker: '0x123...',
            strategy: '0x456...',
            amount: '500000',
            status: 'completed',
          },
        ],
        total: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getWithdrawals';
          case 'staker':
            return '0x123...';
          case 'strategy':
            return '0x456...';
          case 'status':
            return 'completed';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRestakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('getStakerBalances operation', () => {
    it('should get staker balances successfully', async () => {
      const mockResponse = {
        staker: '0x123...',
        balances: [
          {
            strategy: '0x456...',
            balance: '1500000',
            shares: '1500000',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getStakerBalances';
          case 'staker':
            return '0x123...';
          case 'strategy':
            return '0x456...';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRestakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle missing staker address error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getStakerBalances';
          case 'staker':
            return '';
          default:
            return undefined;
        }
      });

      await expect(
        executeRestakingOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Staker address is required');
    });
  });
});

describe('Rewards Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://holesky-api.eigenlayer.xyz/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('getAllRewards should fetch all rewards successfully', async () => {
    const mockResponse = {
      rewards: [
        { recipient: '0x123', amount: '1000', epoch: 1 },
        { recipient: '0x456', amount: '2000', epoch: 2 },
      ],
      total: 2,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAllRewards';
        case 'recipient': return '0x123';
        case 'avs': return '';
        case 'limit': return 100;
        case 'offset': return 0;
        default: return null;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeRewardsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://holesky-api.eigenlayer.xyz/v1/rewards?recipient=0x123&limit=100&offset=0',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getAddressRewards should fetch rewards for specific address', async () => {
    const mockResponse = {
      address: '0x123',
      rewards: [{ amount: '1000', epoch: 1 }],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAddressRewards';
        case 'address': return '0x123';
        case 'epoch': return 1;
        default: return null;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeRewardsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://holesky-api.eigenlayer.xyz/v1/rewards/0x123?epoch=1',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getRewardDistributions should fetch distribution events', async () => {
    const mockResponse = {
      distributions: [
        { avs: '0x789', amount: '5000', epoch: 1 },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getRewardDistributions';
        case 'avs': return '0x789';
        case 'epoch': return 1;
        default: return null;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeRewardsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('getRewardClaims should fetch claim history', async () => {
    const mockResponse = {
      claims: [
        { recipient: '0x123', status: 'completed', amount: '1000' },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getRewardClaims';
        case 'recipient': return '0x123';
        case 'status': return 'completed';
        default: return null;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeRewardsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should handle API errors correctly', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAllRewards';
      return null;
    });

    const apiError = new Error('API request failed');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const items = [{ json: {} }];
    const result = await executeRewardsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API request failed');
  });

  test('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'unknownOperation';
      return null;
    });

    const items = [{ json: {} }];

    await expect(executeRewardsOperations.call(mockExecuteFunctions, items)).rejects.toThrow();
  });
});
});
