import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class EigenLayerApi implements ICredentialType {
	name = 'eigenLayerApi';
	displayName = 'EigenLayer API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The API key for authenticating with EigenLayer API',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://holesky-api.eigenlayer.xyz/v1',
			required: true,
			description: 'The base URL for the EigenLayer API',
		},
	];
}