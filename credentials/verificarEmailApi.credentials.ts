import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class verificarEmailApi implements ICredentialType {
	name = 'verificarEmailApi';
	displayName = 'Verificar Email API';
	documentationUrl = 'https://emailable.com';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}