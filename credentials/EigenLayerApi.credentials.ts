import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class EigenLayerApi implements ICredentialType {
	name = 'eigenLayerApi';
	displayName = 'EigenLayer API';
	documentationUrl = 'https://docs.eigenlayer.xyz/eigenlayer/restaking-guides/restaking-user-guide';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'API key for EigenLayer. Obtain from the EigenLayer developer portal.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.eigenlayer.xyz/v1',
			required: true,
			description: 'Base URL for the EigenLayer API',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Mainnet',
					value: 'mainnet',
				},
				{
					name: 'Testnet',
					value: 'testnet',
				},
			],
			default: 'mainnet',
			description: 'EigenLayer network environment',
		},
	];
}