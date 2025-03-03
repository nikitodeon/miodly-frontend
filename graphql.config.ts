import type { CodegenConfig } from '@graphql-codegen/cli'
import 'dotenv/config'

const config: CodegenConfig = {
	schema: process.env.NEXT_PUBLIC_SERVER_URL,
	//'http://localhost:4000/graphql',
	documents: ['./src/graphql/**/*.graphql'],
	generates: {
		'./src/graphql/generated/output.ts': {
			plugins: [
				'typescript',
				'typescript-operations',
				'typescript-react-apollo'
			]
		}
	},
	ignoreNoDocuments: true
}

export default config
