import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class verificarEmail implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Verificar Email',
		name: 'verificarEmail',
		icon: 'file:email.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["email"]}}',
		description: 'Verificar la validez de un correo electrónico usando emailable.com',
		defaults: {
			name: 'Verificar Email',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'verificarEmailApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Dirección de Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'test@domain.com',
				required: true,
				description: 'El correo electrónico que se desea verificar',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const email = this.getNodeParameter('email', i) as string;
				const credentials = await this.getCredentials('verificarEmailApi');
				const apiKey = credentials?.apiKey as string;

				const response = await this.helpers.httpRequest({
					method: 'GET',
					url: 'https://api.emailable.com/v1/verify',
					qs: {
						email,
						api_key: apiKey,
					},
					json: true,
				});

				const responseData = Array.isArray(response) ? response : [response];

				for (const item of responseData) {
					returnData.push({
						json: {
							email: item.email,
							state: item.state,
							score: item.score,
						},
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}