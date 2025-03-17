import {
	ApolloClient,
	ApolloLink,
	InMemoryCache,
	NormalizedCacheObject,
	split
} from '@apollo/client'
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev'
import { onError } from '@apollo/client/link/error'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import Cookies from 'js-cookie'

import { SERVER_URL, WEBSOCKET_URL } from './constants/url.constants'

// Для работы с куками

loadErrorMessages()
loadDevMessages()

// Функция для получения сессии из куки
const getSessionFromCookie = () => {
	const session = Cookies.get('session') // Получаем сессию из куки
	return session ? `Bearer ${session}` : null
}

// WebSocket Link для подписок
const wsLink = new WebSocketLink({
	uri: WEBSOCKET_URL,
	options: {
		reconnect: true,
		connectionParams: () => {
			const session = getSessionFromCookie()
			return {
				Authorization: session || '' // Передаем сессию из куки
			}
		}
	}
})

// HTTP Link для обычных запросов
const uploadLink = createUploadLink({
	uri: SERVER_URL,
	credentials: 'include', // Поддержка кук
	headers: {
		'apollo-require-preflight': 'true'
	}
})

// Обработка ошибок (если сессия недействительна)
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
	if (!graphQLErrors) return
	for (const err of graphQLErrors) {
		if (err.extensions?.code === 'UNAUTHENTICATED') {
			console.log('User is not authenticated.')
			// Можно здесь добавить логику для редиректа на страницу входа, если необходимо
		}
	}
})

// Сетап для Apollo Client с разделением по операциям
const link = split(
	// Разделение на WebSocket для подписок и обычные запросы
	({ query }) => {
		const definition = getMainDefinition(query)
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		)
	},
	wsLink,
	ApolloLink.from([errorLink, uploadLink])
)

// Создание Apollo Client с куками
export const client = new ApolloClient({
	uri: SERVER_URL,
	cache: new InMemoryCache({}),
	credentials: 'include', // Обеспечивает отправку кук с запросами
	headers: {
		'Content-Type': 'application/json',
		Authorization: getSessionFromCookie() || '' // Добавляем сессию из куки в заголовок
	},
	link: link
})
