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
