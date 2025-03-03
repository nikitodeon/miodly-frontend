import {
	ApolloClient,
	InMemoryCache,
	createHttpLink,
	split
} from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'

import {
	SERVER_URL
	//  WEBSOCKET_URL
} from './constants/url.constants'

// const httpLink = createHttpLink({
// 	uri: process.env.NEXT_PUBLIC_SERVER_URL,
// 	credentials: 'include'
// })
const httpLink = createUploadLink({
	uri: SERVER_URL,
	credentials: 'include',
	headers: {
		'apollo-require-preflight': 'true'
	}
})

// const wsLink = new WebSocketLink({
// 	uri: WEBSOCKET_URL,
// 	options: {
// 		reconnect: true
// 	}
// })

// const splitLink = split(
// 	({ query }) => {
// 		const definition = getMainDefinition(query)

// 		return (
// 			definition.kind === 'OperationDefinition' &&
// 			definition.operation === 'subscription'
// 		)
// 	},
// 	wsLink,
// 	httpLink
// )

export const client = new ApolloClient({
	link: httpLink,
	// link: splitLink,
	cache: new InMemoryCache()
})
