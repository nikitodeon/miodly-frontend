import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

import {
	GetChatroomsForUserQuery,
	GetMessagesForChatroomQuery,
	GetUsersOfChatroomQuery
} from '@/graphql/generated/output'

export const useChatroomMessages = (
	activeRoomId: string | null,
	userId: string | undefined,
	messagesByChatroom: Map<any, any>,
	setMessagesByChatroom: React.Dispatch<React.SetStateAction<Map<any, any>>>
) => {
	const [isUserPartOfChatroom, setIsUserPartOfChatroom] = useState<
		boolean | undefined
	>()

	const GET_MESSAGES_FOR_CHATROOM = gql`
		query GetMessagesForChatroom($chatroomId: Float!) {
			getMessagesForChatroom(chatroomId: $chatroomId) {
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
					name
					ChatroomUsers {
						role
						user {
							id
							username
							avatar
							email
						}
					}
				}
			}
		}
	`

	const { data, loading } = useQuery<GetMessagesForChatroomQuery>(
		GET_MESSAGES_FOR_CHATROOM,
		{
			variables: {
				chatroomId: activeRoomId ? parseFloat(activeRoomId) : 0
			},
			skip: !activeRoomId,
			fetchPolicy: 'network-only'
		}
	)
	const GET_CHATROOMS_FOR_USER = gql`
		query getChatroomsForUser($userId: String!) {
			getChatroomsForUser(userId: $userId) {
				id
				name
				messages {
					id
					content
					createdAt
					user {
						id
						username
					}
				}
				ChatroomUsers {
					role
					user {
						id
						username
						email
						avatar
					}
				}
			}
		}
	`
	const { data: userChatrooms } = useQuery<GetChatroomsForUserQuery>(
		GET_CHATROOMS_FOR_USER,
		{
			variables: {
				userId: userId || ''
			},
			skip: !userId,
			fetchPolicy: 'network-only'
		}
	)
	const chatroomData: any = userChatrooms?.getChatroomsForUser?.find(
		chatroom => chatroom.id === activeRoomId
	)

	const chatroomMessagesData:
		| GetMessagesForChatroomQuery['getMessagesForChatroom'][0]['chatroom']
		| undefined = data?.getMessagesForChatroom?.[0]?.chatroom

	const GET_USERS_OF_CHATROOM = gql`
		query GetUsersOfChatroom($chatroomId: Float!) {
			getUsersOfChatroom(chatroomId: $chatroomId) {
				id
				username
				email
				avatar
			}
		}
	`

	const { data: dataUsersOfChatroom } = useQuery<GetUsersOfChatroomQuery>(
		GET_USERS_OF_CHATROOM,
		{
			variables: {
				chatroomId: activeRoomId ? parseFloat(activeRoomId) : 0
			},
			skip: !activeRoomId
		}
	)

	useEffect(() => {
		if (data?.getMessagesForChatroom && activeRoomId) {
			setMessagesByChatroom(prevMessages => {
				const updatedMessages = new Map(prevMessages)
				const currentMessages = updatedMessages.get(activeRoomId) || []

				const mergedMessages = [
					...new Map(
						[
							...currentMessages,
							...data.getMessagesForChatroom
						].map(m => [m.id, m])
					).values()
				]

				updatedMessages.set(activeRoomId, mergedMessages)
				return updatedMessages
			})
		}
	}, [data?.getMessagesForChatroom, activeRoomId, setMessagesByChatroom])

	useEffect(() => {
		setIsUserPartOfChatroom(
			dataUsersOfChatroom?.getUsersOfChatroom.some(
				user => user.id === userId
			)
		)
	}, [dataUsersOfChatroom?.getUsersOfChatroom, userId])

	const unsortedMessages = messagesByChatroom.get(activeRoomId) || []
	const messages = unsortedMessages.sort(
		(a: any, b: any) =>
			new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
	)

	const handleUpdateChatroomsDataToFalse = () => {
		setIsUserPartOfChatroom(false)
	}

	return {
		messages,
		loading,
		dataUsersOfChatroom,
		liveUsers: [],
		isUserPartOfChatroom,
		handleUpdateChatroomsDataToFalse,
		chatroomMessagesData,
		chatroomData
	}
}
