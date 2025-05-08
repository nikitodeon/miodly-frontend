import { gql, useSubscription } from '@apollo/client'
import { useEffect } from 'react'

import { NewMessageForAllChatsSubscription } from '@/graphql/generated/output'

import { client } from '@/libs/apollo-client'

export const useRoomListSubscriptions = (userId: string | undefined) => {
	console.log('[useRoomListSubscriptions] Initializing with userId:', userId)

	const {
		data,
		error,
		loading: subscriptionLoading
	} = useSubscription<NewMessageForAllChatsSubscription>(
		gql`
			subscription NewMessageForAllChats($userId: String!) {
				newMessageForAllChats(userId: $userId) {
					id
					content
					createdAt
					chatroom {
						id
						ChatroomUsers {
							user {
								id
							}
						}
					}
					user {
						id
						username
					}
				}
			}
		`,
		{
			variables: { userId: userId ?? '' },
			skip: !userId,
			onError: error => {
				console.error(
					'[useRoomListSubscriptions] Subscription error:',
					{
						message: error.message,
						graphQLErrors: error.graphQLErrors,
						networkError: error.networkError,
						extra: error.extraInfo,
						stack: error.stack
					}
				)
			},
			onSubscriptionData: ({ subscriptionData }) => {
				console.log(
					'[useRoomListSubscriptions] New subscription data received:',
					subscriptionData
				)
			},
			shouldResubscribe: true
		}
	)

	useEffect(() => {
		console.log('[useRoomListSubscriptions] Data changed:', data)
		if (data) {
			console.log(
				'[useRoomListSubscriptions] Refetching GetChatroomsForUser query'
			)
			client
				.refetchQueries({
					include: ['GetChatroomsForUser']
				})
				.then(() => {
					console.log(
						'[useRoomListSubscriptions] Queries refetched successfully'
					)
				})
				.catch(refetchError => {
					console.error(
						'[useRoomListSubscriptions] Error refetching queries:',
						refetchError
					)
				})
		}
	}, [data])

	console.log('[useRoomListSubscriptions] Current state:', {
		subscriptionData: data,
		error,
		subscriptionLoading
	})

	return { subscriptionData: data, error, subscriptionLoading }
}
