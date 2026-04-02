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
describe('Restaking Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.eigenlayer.xyz/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should stake tokens successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('stakeTokens')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
      .mockReturnValueOnce('1000000000000000000')
      .mockReturnValueOnce('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      success: true,
      transactionHash: '0xhash123',
      positionId: 'pos-123'
    });

    const result = await executeRestakingOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(true);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.eigenlayer.xyz/v1/restaking/stake',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        token: '0x1234567890123456789012345678901234567890',
        amount: '1000000000000000000',
        operator: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      },
      json: true,
    });
  });

  it('should get positions for address successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getPositions')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      positions: [{ id: 'pos-1', amount: '1000000000000000000' }]
    });

    const result = await executeRestakingOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.positions).toHaveLength(1);
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('stakeTokens');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeRestakingOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should get all positions with pagination', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllPositions')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(20)
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      positions: [],
      pagination: { page: 1, limit: 20, total: 0 }
    });

    const result = await executeRestakingOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.eigenlayer.xyz/v1/restaking/positions?page=1&limit=20',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      json: true,
    });
  });

  it('should update position successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updatePosition')
      .mockReturnValueOnce('pos-123')
      .mockReturnValueOnce('0xnewoperator')
      .mockReturnValueOnce('2000000000000000000');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      success: true,
      position: { id: 'pos-123', updated: true }
    });

    const result = await executeRestakingOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(true);
  });

  it('should unstake tokens successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('unstakeTokens')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
      .mockReturnValueOnce('500000000000000000')
      .mockReturnValueOnce('pos-123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      success: true,
      unstakeId: 'unstake-123',
      withdrawalDelay: 7
    });

    const result = await executeRestakingOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(true);
    expect(result[0].json.unstakeId).toBe('unstake-123');
  });
});

describe('Delegation Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.eigenlayer.xyz/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should delegate to operator successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'delegateToOperator';
        case 'operator': return '0x1234567890123456789012345678901234567890';
        case 'amount': return '1000000000000000000';
        case 'token': return '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
        default: return undefined;
      }
    });

    const mockResponse = { success: true, delegationId: 'del_123' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.eigenlayer.xyz/v1/delegation/delegate',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        operator: '0x1234567890123456789012345678901234567890',
        amount: '1000000000000000000',
        token: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      },
      json: true,
    });
  });

  it('should get delegations for address successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getDelegations';
        case 'address': return '0x1234567890123456789012345678901234567890';
        case 'operator': return '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
        default: return undefined;
      }
    });

    const mockResponse = { delegations: [{ id: 'del_123', amount: '1000000000000000000' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.eigenlayer.xyz/v1/delegation/delegations/0x1234567890123456789012345678901234567890?operator=0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      headers: {
        'Authorization': 'Bearer test-key',
      },
      json: true,
    });
  });

  it('should handle delegation error gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'delegateToOperator';
        case 'operator': return 'invalid-address';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid operator address'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'Invalid operator address' }, pairedItem: { item: 0 } }]);
  });

  it('should update delegation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'updateDelegation';
        case 'delegationId': return 'del_123';
        case 'amount': return '2000000000000000000';
        case 'operator': return '0xnewoperator123456789012345678901234567890';
        default: return undefined;
      }
    });

    const mockResponse = { success: true, updatedDelegation: { id: 'del_123' } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should undelegate from operator successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'undelegateFromOperator';
        case 'delegationId': return 'del_123';
        case 'amount': return '1000000000000000000';
        default: return undefined;
      }
    });

    const mockResponse = { success: true, transactionHash: '0xtx123' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'https://api.eigenlayer.xyz/v1/delegation/undelegate',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        delegationId: 'del_123',
        amount: '1000000000000000000',
      },
      json: true,
    });
  });
});

describe('EigenPods Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.eigenlayer.xyz/v1',
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

	describe('createEigenPod', () => {
		it('should create EigenPod successfully', async () => {
			const mockResponse = { podAddress: '0x123...', txHash: '0xabc...' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createEigenPod')
				.mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D44542a95D824e8E')
				.mockReturnValueOnce('0x010000000000000000000000742d35Cc6634C0532925a3b8D44542a95D824e8E');

			const items = [{ json: {} }];
			const result = await executeEigenPodsOperations.call(mockExecuteFunctions, items);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.eigenlayer.xyz/v1/eigenpods/create',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					owner: '0x742d35Cc6634C0532925a3b8D44542a95D824e8E',
					withdrawalCredentials: '0x010000000000000000000000742d35Cc6634C0532925a3b8D44542a95D824e8E',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle createEigenPod error', async () => {
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createEigenPod');

			const items = [{ json: {} }];
			const result = await executeEigenPodsOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getEigenPod', () => {
		it('should get EigenPod successfully', async () => {
			const mockResponse = { address: '0x123...', owner: '0x456...', status: 'active' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEigenPod')
				.mockReturnValueOnce('0x123...')
				.mockReturnValueOnce(true);

			const items = [{ json: {} }];
			const result = await executeEigenPodsOperations.call(mockExecuteFunctions, items);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.eigenlayer.xyz/v1/eigenpods/0x123...?includeValidators=true',
				headers: {
					'Authorization': 'Bearer test-key',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getAllEigenPods', () => {
		it('should get all EigenPods successfully', async () => {
			const mockResponse = { pods: [], total: 0, page: 1 };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllEigenPods')
				.mockReturnValueOnce(1)
				.mockReturnValueOnce(20)
				.mockReturnValueOnce('')
				.mockReturnValueOnce('');

			const items = [{ json: {} }];
			const result = await executeEigenPodsOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('verifyValidators', () => {
		it('should verify validators successfully', async () => {
			const mockResponse = { verified: true, indices: [1, 2] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('verifyValidators')
				.mockReturnValueOnce('0x123...')
				.mockReturnValueOnce('1,2')
				.mockReturnValueOnce('{"proof1": "data1"}');

			const items = [{ json: {} }];
			const result = await executeEigenPodsOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('withdrawFromEigenPod', () => {
		it('should withdraw from EigenPod successfully', async () => {
			const mockResponse = { txHash: '0xdef...', amount: '1000000000000000000' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('withdrawFromEigenPod')
				.mockReturnValueOnce('0x123...')
				.mockReturnValueOnce('1000000000000000000')
				.mockReturnValueOnce('0x456...');

			const items = [{ json: {} }];
			const result = await executeEigenPodsOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('OperatorRegistration Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.eigenlayer.xyz/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('registerOperator', () => {
    it('should register operator successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('registerOperator')
        .mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D40')
        .mockReturnValueOnce('https://metadata.example.com/operator.json')
        .mockReturnValueOnce('0x123456789abcdef');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        success: true,
        operatorId: 'op-123',
        transactionHash: '0xabc123'
      });

      const items = [{ json: {} }];
      const result = await executeOperatorRegistrationOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.success).toBe(true);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.eigenlayer.xyz/v1/operators/register',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        body: {
          operatorAddress: '0x742d35Cc6634C0532925a3b8D40',
          metadataURI: 'https://metadata.example.com/operator.json',
          delegationApprover: '0x123456789abcdef'
        },
        json: true,
      });
    });

    it('should handle registerOperator error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('registerOperator')
        .mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D40')
        .mockReturnValueOnce('https://metadata.example.com/operator.json')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Registration failed'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeOperatorRegistrationOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Registration failed');
    });
  });

  describe('getOperator', () => {
    it('should get operator successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getOperator')
        .mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D40')
        .mockReturnValueOnce(true);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        operatorAddress: '0x742d35Cc6634C0532925a3b8D40',
        metadataURI: 'https://metadata.example.com/operator.json',
        totalStake: '1000000000000000000'
      });

      const items = [{ json: {} }];
      const result = await executeOperatorRegistrationOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.operatorAddress).toBe('0x742d35Cc6634C0532925a3b8D40');
    });

    it('should handle getOperator error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getOperator')
        .mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D40')
        .mockReturnValueOnce(false);

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Operator not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeOperatorRegistrationOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Operator not found');
    });
  });

  describe('getAllOperators', () => {
    it('should get all operators successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllOperators')
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(20)
        .mockReturnValueOnce('active')
        .mockReturnValueOnce('1000000000000000000');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        operators: [
          { operatorAddress: '0x742d35Cc6634C0532925a3b8D40', status: 'active' }
        ],
        totalCount: 1,
        page: 1,
        limit: 20
      });

      const items = [{ json: {} }];
      const result = await executeOperatorRegistrationOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.operators).toHaveLength(1);
    });
  });

  describe('updateOperator', () => {
    it('should update operator successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateOperator')
        .mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D40')
        .mockReturnValueOnce('https://updated-metadata.example.com/operator.json')
        .mockReturnValueOnce('0x987654321fedcba');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        success: true,
        transactionHash: '0xdef456'
      });

      const items = [{ json: {} }];
      const result = await executeOperatorRegistrationOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.success).toBe(true);
    });
  });

  describe('deregisterOperator', () => {
    it('should deregister operator successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deregisterOperator')
        .mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D40');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        success: true,
        transactionHash: '0x789abc'
      });

      const items = [{ json: {} }];
      const result = await executeOperatorRegistrationOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.success).toBe(true);
    });
  });
});

describe('AVSRegistration Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.eigenlayer.xyz/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should register AVS successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'registerAVS';
        case 'avsAddress': return '0x123...abc';
        case 'metadataURI': return 'https://example.com/metadata';
        case 'rewardToken': return '0x456...def';
        default: return null;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      success: true,
      avsAddress: '0x123...abc',
    });

    const result = await executeAVSRegistrationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(true);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.eigenlayer.xyz/v1/avs/register',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
      body: {
        avsAddress: '0x123...abc',
        metadataURI: 'https://example.com/metadata',
        rewardToken: '0x456...def',
      },
    });
  });

  it('should get AVS details successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAVS';
        case 'avsAddress': return '0x123...abc';
        case 'includeOperators': return true;
        default: return null;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      avsAddress: '0x123...abc',
      operators: [],
    });

    const result = await executeAVSRegistrationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.avsAddress).toBe('0x123...abc');
  });

  it('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'registerAVS';
        case 'avsAddress': return 'invalid-address';
        default: return null;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('Invalid address format'),
    );

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeAVSRegistrationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Invalid address format');
  });
});

describe('Rewards Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.eigenlayer.xyz/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  it('should calculate rewards successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('calculateRewards')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
      .mockReturnValueOnce('0xToken123')
      .mockReturnValueOnce('30d');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      address: '0x1234567890123456789012345678901234567890',
      pendingRewards: '1000000000000000000',
      claimableRewards: '500000000000000000',
    });

    const result = await executeRewardsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.address).toBe('0x1234567890123456789012345678901234567890');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.eigenlayer.xyz/v1/rewards/calculate/0x1234567890123456789012345678901234567890?token=0xToken123&period=30d',
      })
    );
  });

  it('should get reward history successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getRewardHistory')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
      .mockReturnValueOnce('2023-01-01')
      .mockReturnValueOnce('2023-12-31')
      .mockReturnValueOnce('0xToken123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      rewards: [
        { date: '2023-06-01', amount: '100000000000000000', token: '0xToken123' },
      ],
    });

    const result = await executeRewardsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.rewards).toBeDefined();
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.eigenlayer.xyz/v1/rewards/history/0x1234567890123456789012345678901234567890?startDate=2023-01-01&endDate=2023-12-31&token=0xToken123',
      })
    );
  });

  it('should get all distributions successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllDistributions')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(50)
      .mockReturnValueOnce('0xAVS123')
      .mockReturnValueOnce('0xToken123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      distributions: [
        { id: 1, avs: '0xAVS123', token: '0xToken123', amount: '1000000000000000000' },
      ],
      pagination: { page: 1, limit: 50, total: 1 },
    });

    const result = await executeRewardsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.distributions).toBeDefined();
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.eigenlayer.xyz/v1/rewards/distributions?page=1&limit=50&avs=0xAVS123&token=0xToken123',
      })
    );
  });

  it('should claim rewards successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('claimRewards')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
      .mockReturnValueOnce('0xToken1,0xToken2')
      .mockReturnValueOnce({ '0xToken1': ['0xProof1'], '0xToken2': ['0xProof2'] });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      transactionHash: '0xTransactionHash123',
      status: 'success',
    });

    const result = await executeRewardsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.transactionHash).toBe('0xTransactionHash123');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://api.eigenlayer.xyz/v1/rewards/claim',
        body: expect.objectContaining({
          address: '0x1234567890123456789012345678901234567890',
          tokens: ['0xToken1', '0xToken2'],
          merkleProofs: { '0xToken1': ['0xProof1'], '0xToken2': ['0xProof2'] },
        }),
      })
    );
  });

  it('should get merkle proof successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getMerkleProof')
      .mockReturnValueOnce('0xMerkleRoot123')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
      .mockReturnValueOnce('1000000000000000000');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      proof: ['0xProof1', '0xProof2', '0xProof3'],
      leaf: '0xLeafHash',
    });

    const result = await executeRewardsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.proof).toBeDefined();
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.eigenlayer.xyz/v1/rewards/merkle-tree/0xMerkleRoot123?address=0x1234567890123456789012345678901234567890&amount=1000000000000000000',
      })
    );
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('calculateRewards');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeRewardsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('calculateRewards');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executeRewardsOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('API Error');
  });
});
});
