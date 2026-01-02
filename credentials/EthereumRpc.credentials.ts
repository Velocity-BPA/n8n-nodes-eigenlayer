/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  ICredentialType,
  INodeProperties,
  ICredentialTestRequest,
  IAuthenticateGeneric,
} from 'n8n-workflow';

export class EthereumRpc implements ICredentialType {
  name = 'ethereumRpc';
  displayName = 'Ethereum RPC';
  documentationUrl = 'https://docs.eigenlayer.xyz/';
  properties: INodeProperties[] = [
    {
      displayName: 'Provider',
      name: 'provider',
      type: 'options',
      options: [
        { name: 'Alchemy', value: 'alchemy' },
        { name: 'Infura', value: 'infura' },
        { name: 'QuickNode', value: 'quicknode' },
        { name: 'Custom RPC URL', value: 'custom' },
      ],
      default: 'alchemy',
      description: 'Select your Ethereum RPC provider',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      displayOptions: {
        show: { provider: ['alchemy', 'infura', 'quicknode'] },
      },
      description: 'API key for your RPC provider',
    },
    {
      displayName: 'Custom RPC URL',
      name: 'customRpcUrl',
      type: 'string',
      default: '',
      required: true,
      displayOptions: {
        show: { provider: ['custom'] },
      },
      placeholder: 'https://your-rpc-endpoint.com',
      description: 'Custom Ethereum RPC endpoint URL',
    },
    {
      displayName: 'Network',
      name: 'network',
      type: 'options',
      options: [
        { name: 'Ethereum Mainnet', value: 'mainnet' },
        { name: 'Holesky Testnet', value: 'holesky' },
      ],
      default: 'mainnet',
      description: 'Ethereum network to connect to',
    },
    {
      displayName: 'Chain ID',
      name: 'chainId',
      type: 'number',
      default: 1,
      description: 'Chain ID (auto-populated: 1 for Mainnet, 17000 for Holesky)',
      displayOptions: {
        show: { network: ['mainnet'] },
      },
    },
    {
      displayName: 'Chain ID',
      name: 'chainId',
      type: 'number',
      default: 17000,
      description: 'Chain ID (auto-populated: 1 for Mainnet, 17000 for Holesky)',
      displayOptions: {
        show: { network: ['holesky'] },
      },
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$self.getRpcUrl()}}',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_chainId',
        params: [],
        id: 1,
      }),
    },
  };

  getRpcUrl(): string {
    return '';
  }
}
