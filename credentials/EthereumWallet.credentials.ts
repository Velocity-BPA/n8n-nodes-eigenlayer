/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class EthereumWallet implements ICredentialType {
  name = 'ethereumWallet';
  displayName = 'Ethereum Wallet';
  documentationUrl = 'https://docs.eigenlayer.xyz/';
  properties: INodeProperties[] = [
    {
      displayName: 'Authentication Method',
      name: 'authMethod',
      type: 'options',
      options: [
        { name: 'Private Key', value: 'privateKey' },
        { name: 'Mnemonic Phrase', value: 'mnemonic' },
      ],
      default: 'privateKey',
      description: 'How to authenticate your Ethereum wallet',
    },
    {
      displayName: 'Private Key',
      name: 'privateKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      displayOptions: {
        show: { authMethod: ['privateKey'] },
      },
      description: 'Your Ethereum wallet private key (without 0x prefix)',
      placeholder: 'Your private key...',
    },
    {
      displayName: 'Mnemonic Phrase',
      name: 'mnemonic',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      displayOptions: {
        show: { authMethod: ['mnemonic'] },
      },
      description: 'Your 12 or 24 word mnemonic seed phrase',
      placeholder: 'word1 word2 word3...',
    },
    {
      displayName: 'Derivation Path',
      name: 'derivationPath',
      type: 'string',
      default: "m/44'/60'/0'/0/0",
      displayOptions: {
        show: { authMethod: ['mnemonic'] },
      },
      description: 'BIP-44 derivation path for your wallet',
    },
  ];
}
