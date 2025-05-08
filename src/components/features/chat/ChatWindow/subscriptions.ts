import { gql, useSubscription } from '@apollo/client'
import { useEffect, useState } from 'react'

import {
	LiveUsersInChatroomSubscription,
	NewMessageForAllChatsSubscription,
	NewMessageSubscription,
	UserStartedTypingSubscription,
	UserStoppedTypingSubscription
} from '@/graphql/generated/output'

import { client } from '@/libs/apollo-client'

import { useTypingUsers } from '@/store/typingUsers'

export const useChatroomSubscriptions = (
	activeRoomId: string | null,
	userId: string | undefined,
	setMessagesByChatroom: React.Dispatch<React.SetStateAction<Map<any, any>>>
) => {
	const { typingUsers, addUser, removeUser } = useTypingUsers()
	const [liveUsers, setLiveUsers] = useState<any[]>([])

	// Подписка на начало набора текста
	const { data: typingData } = useSubscription<UserStartedTypingSubscription>(
		gql`
			subscription UserStartedTyping(
				$chatroomId: Float!
				$userId: String!
			) {
				userStartedTyping(chatroomId: $chatroomId, userId: $userId) {
					id
					username
					email
					avatar
				}
			}
		`,
		{
			variables: {
				chatroomId: activeRoomId ? parseFloat(activeRoomId) : 0,
				userId: userId
			},
			skip: !activeRoomId || !userId
		}
	)

	// Подписка на остановку набора текста
	const { data: stoppedTypingData } =
		useSubscription<UserStoppedTypingSubscription>(
			gql`
				subscription UserStoppedTyping(
					$chatroomId: Float!
					$userId: String!
				) {
					userStoppedTyping(
						chatroomId: $chatroomId
						userId: $userId
					) {
						id
						username
						email
						avatar
					}
				}
			`,
			{
				variables: {
					chatroomId: activeRoomId ? parseFloat(activeRoomId) : 0,
					userId: userId
				},
				skip: !activeRoomId || !userId
			}
		)

	// Подписка на онлайн пользователей
	const { data: liveUsersData } =
		useSubscription<LiveUsersInChatroomSubscription>(
			gql`
				subscription LiveUsersInChatroom($chatroomId: Int!) {
					liveUsersInChatroom(chatroomId: $chatroomId) {
						id
						username
						avatar
						email
					}
				}
			`,
			{
				variables: {
					chatroomId: activeRoomId ? parseInt(activeRoomId) : 0
				},
				skip: !activeRoomId,
				onSubscriptionData: ({ subscriptionData }) => {
					if (subscriptionData.data?.liveUsersInChatroom) {
						setLiveUsers(subscriptionData.data.liveUsersInChatroom)
					}
				}
			}
		)

	// Подписка на новые сообщения (самая важная)
	useSubscription<NewMessageSubscription>(
		gql`
			subscription NewMessage($userId: String!, $chatroomId: Float!) {
				newMessage(userId: $userId, chatroomId: $chatroomId) {
					id
					content
					imageUrl
					createdAt
					user {
						id
						username
						email
						avatar
					}
					chatroom {
						id
					}
				}
			}
		`,
		{
			variables: {
				userId: userId,
				chatroomId: activeRoomId ? parseFloat(activeRoomId) : 0
			},
			skip: !activeRoomId || !userId,
			onSubscriptionData: ({ subscriptionData }) => {
				const newMessage = subscriptionData.data?.newMessage
				if (newMessage) {
					const chatroomId = newMessage.chatroom?.id

					// Обновляем локальное состояние сообщений
					setMessagesByChatroom(prevMessages => {
						const updatedMessages = new Map(prevMessages)
						const currentMessages =
							updatedMessages.get(chatroomId) || []

						if (
							!currentMessages.find(
								(msg: any) => msg.id === newMessage.id
							)
						) {
							updatedMessages.set(chatroomId, [
								...currentMessages,
								newMessage
							])
						}

						return updatedMessages
					})

					// Обновляем кеш Apollo
					client.cache.modify({
						id: `Chatroom:${chatroomId}`,
						fields: {
							messages(existingMessages = []) {
								const isMessageAlreadyInCache =
									existingMessages.some(
										(msg: any) => msg.id === newMessage.id
									)
								if (!isMessageAlreadyInCache) {
									return [...existingMessages, newMessage]
								}
								return existingMessages
							}
						}
					})

					// Принудительно обновляем запрос
					client.refetchQueries({
						include: ['GetMessagesForChatroom']
					})
				}
			}
		}
	)
	useSubscription<NewMessageForAllChatsSubscription>(
		gql`
			subscription NewMessageForAllChats($userId: String!) {
				newMessageForAllChats(userId: $userId) {
					id
					content
					imageUrl
					createdAt
					chatroom {
						id
					}
					user {
						id
						username
					}
				}
			}
		`,
		{
			variables: { userId },
			skip: !userId,
			onSubscriptionData: ({ subscriptionData }) => {
				console.log(
					'[NewMessageForAllChats] Subscription data received:',
					subscriptionData
				)

				const newMessage = subscriptionData.data?.newMessageForAllChats
				if (!newMessage) {
					console.log(
						'[NewMessageForAllChats] No message in subscription data'
					)
					return
				}

				const chatroomId = newMessage.chatroom?.id
				console.log(
					'[NewMessageForAllChats] Processing message for chatroom:',
					chatroomId,
					{
						message: newMessage,
						isActiveChat: chatroomId === activeRoomId
					}
				)

				// Update state
				setMessagesByChatroom(prev => {
					console.log(
						'[NewMessageForAllChats] Current messages state:',
						prev
					)
					const updated = new Map(prev)
					const chatMessages = updated.get(chatroomId) || []

					if (
						!chatMessages.some((m: any) => m.id === newMessage.id)
					) {
						console.log(
							'[NewMessageForAllChats] Adding new message to state'
						)
						updated.set(chatroomId, [...chatMessages, newMessage])
					} else {
						console.log(
							'[NewMessageForAllChats] Message already exists in state'
						)
					}

					console.log(
						'[NewMessageForAllChats] Updated messages state:',
						updated
					)
					return updated
				})

				// Force chat list refresh
				console.log(
					'[NewMessageForAllChats] Refreshing GetChatroomsForUser query'
				)
				client.refetchQueries({
					include: ['GetChatroomsForUser']
				})
			}
		}
	)
	// Обработка данных подписок
	useEffect(() => {
		if (typingData?.userStartedTyping) {
			addUser(typingData.userStartedTyping)
		}
	}, [typingData])

	useEffect(() => {
		if (stoppedTypingData?.userStoppedTyping) {
			removeUser(stoppedTypingData.userStoppedTyping.id)
		}
	}, [stoppedTypingData])

	useEffect(() => {
		if (liveUsersData?.liveUsersInChatroom) {
			setLiveUsers(liveUsersData.liveUsersInChatroom)
		}
	}, [liveUsersData])

	return {
		typingUsers,
		liveUsers
	}
}
