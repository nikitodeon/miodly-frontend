// import { gql, useQuery } from '@apollo/client'
// import { useEffect } from 'react'

// import {
// 	Chatroom,
// 	ChatroomUsers,
// 	GetChatroomsForUserQuery,
// 	GetMessagesForChatroomQuery,
// 	GetUsersOfChatroomQuery,
// 	Message
// } from '@/graphql/generated/output'

// import { useChatroomStore } from '@/store/chatroomStore'

// const GET_MESSAGES_FOR_CHATROOM = gql`
// 	query GetMessagesForChatroom($chatroomId: Float!) {
// 		getMessagesForChatroom(chatroomId: $chatroomId) {
// 			id
// 			content
// 			imageUrl
// 			createdAt
// 			user {
// 				id
// 				username
// 				email
// 				avatar
// 			}
// 			chatroom {
// 				id
// 				name
// 				ChatroomUsers {
// 					role
// 					user {
// 						id
// 						username
// 						email
// 						avatar
// 					}
// 				}
// 			}
// 		}
// 	}
// `

// const GET_USERS_OF_CHATROOM = gql`
// 	query GetUsersOfChatroom($chatroomId: Float!) {
// 		getUsersOfChatroom(chatroomId: $chatroomId) {
// 			id
// 			username
// 			email
// 			avatar
// 		}
// 	}
// `

// const GET_CHATROOMS_FOR_USER = gql`
// 	query getChatroomsForUser($userId: String!) {
// 		getChatroomsForUser(userId: $userId) {
// 			id
// 			name
// 			ChatroomUsers {
// 				role
// 				user {
// 					id
// 					username
// 					email
// 					avatar
// 				}
// 			}
// 		}
// 	}
// `

// export const useChatroomMessages = (
// 	activeRoomId: string | null,
// 	userId: string | undefined
// ) => {
// 	const {
// 		setChatroom,
// 		setMessages,
// 		messages,
// 		chatrooms,
// 		setIsUserPartOfChatroom
// 	} = useChatroomStore()

// 	// Запросы
// 	const { data: userChatroomsData } = useQuery<GetChatroomsForUserQuery>(
// 		GET_CHATROOMS_FOR_USER,
// 		{
// 			variables: { userId: userId || '' },
// 			skip: !userId
// 		}
// 	)

// 	const { data: messagesData } = useQuery<GetMessagesForChatroomQuery>(
// 		GET_MESSAGES_FOR_CHATROOM,
// 		{
// 			variables: {
// 				chatroomId: activeRoomId ? parseFloat(activeRoomId) : 0
// 			},
// 			skip: !activeRoomId
// 		}
// 	)

// 	const { data: chatroomUsersData } = useQuery<GetUsersOfChatroomQuery>(
// 		GET_USERS_OF_CHATROOM,
// 		{
// 			variables: {
// 				chatroomId: activeRoomId ? parseFloat(activeRoomId) : 0
// 			},
// 			skip: !activeRoomId
// 		}
// 	)

// 	// Обновляем данные о чате
// 	useEffect(() => {
// 		if (!activeRoomId || !userChatroomsData) return
// 		const chatroom = userChatroomsData.getChatroomsForUser.find(
// 			c => c.id === activeRoomId
// 		)
// 		if (chatroom) setChatroom(activeRoomId, chatroom as Chatroom)
// 	}, [userChatroomsData, activeRoomId, setChatroom])

// 	// Обновляем данные сообщений
// 	useEffect(() => {
// 		if (!activeRoomId || !messagesData) return
// 		setMessages(
// 			activeRoomId,
// 			(messagesData.getMessagesForChatroom as Message[]) || []
// 		)
// 	}, [messagesData, activeRoomId, setMessages])

// 	// Получаем отсортированные сообщения
// 	const currentMessages = messages.get(activeRoomId || '') || []
// 	const sortedMessages = [...currentMessages].sort(
// 		(a, b) =>
// 			new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
// 	)

// 	// Проверяем, является ли пользователь частью чата
// 	const isUserPartOfChatroom = chatroomUsersData?.getUsersOfChatroom.some(
// 		user => user.id === userId
// )

// 	// Функция для обновления данных чатов в хранилище
// 	const handleUpdateChatroomsDataToFalse = () => {
// 		setIsUserPartOfChatroom(false)
// 	}

// 	return {
// 		messages: sortedMessages,
// 		loading: !messagesData || !userChatroomsData || !chatroomUsersData,
// 		dataUsersOfChatroom: chatroomUsersData?.getUsersOfChatroom || [],
// 		liveUsers: chatroomUsersData?.getUsersOfChatroom || [], // Поясни, если liveUsers должен быть другим
// 		isUserPartOfChatroom,
// 		handleUpdateChatroomsDataToFalse, // Возвращаем старую функцию
// 		chatroomMessagesData: messagesData?.getMessagesForChatroom || [],
// 		chatroomData: chatrooms.get(activeRoomId || '') || null
// 	}
// }
