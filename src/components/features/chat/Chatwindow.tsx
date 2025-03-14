'use client'

import { gql, useMutation, useQuery, useSubscription } from '@apollo/client'
import { Avatar, Flex, Image, List, Text, Tooltip } from '@mantine/core'
//

import React, { useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/common/Button'
import { Card } from '@/components/ui/common/Card'
import { AttachIcon, SendIcon } from '@/components/ui/common/Icons'
import { Input } from '@/components/ui/common/Input'
import { EmojiPicker } from '@/components/ui/elements/EmojiPicker'

import {
	GetChatroomsForUserQuery,
	GetMessagesForChatroomQuery,
	GetUsersOfChatroomQuery,
	LiveUsersInChatroomSubscription,
	//   User,
	UserStartedTypingSubscription,
	UserStoppedTypingSubscription
} from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

import { client } from '@/libs/apollo-client'

import { useGeneralStore } from '@/store/generalStore'
import { useTypingUsers } from '@/store/typingUsers'

import { getMediaSource } from '@/utils/get-media-source'

import { ChatMenu } from './ChatMenu'
import MessageBubble from './MessageBubble'
//

import OverlappingAvatars from './OverlappingAvatars'

// const user = props.user

function Chatwindow() {
	const user = useCurrent().user
	const [userId, setUserId] = useState<string | null>(null)

	// const userId = user?.id
	const [searchParams, setSearchParams] = useSearchParams()
	const activeRoomId: string | null = searchParams.get('id') || null
	const [messagesByChatroom, setMessagesByChatroom] = useState<Map<any, any>>(
		new Map()
	)
	const toggleCreateRoomModal = useGeneralStore(
		state => state.toggleCreateRoomModal
	)
	useEffect(() => {
		if (user && user.id) {
			setUserId(user.id) // Устанавливаем userId, когда он доступен
		}
	}, [user])
	const {
		data: chatroomsData,
		loading: chatroomsLoading,
		error: chatroomsError
	} = useQuery<GetChatroomsForUserQuery>(
		gql`
			query getChatroomsForUser($userId: String!) {
				getChatroomsForUser(userId: $userId) {
					id
					name
					ChatroomUsers {
						role
						user {
							id
							username
							avatar
						}
					}
					messages {
						id
						content
						createdAt
					}
				}
			}
		`,
		{
			variables: {
				userId: userId
			}
			// skip: !userId
		}
	)
	const activeRoom = chatroomsData?.getChatroomsForUser?.find(
		(chatroom: any) => chatroom.id === activeRoomId
	)
	const { typingUsers, addUser, removeUser } = useTypingUsers() // Используем контекст

	const [messageContent, setMessageContent] = useState('')
	const SEND_MESSAGE_MUTATION = gql`
		mutation SendMessage(
			$chatroomId: Float!
			$content: String!
			$file: Upload
		) {
			sendMessage(
				chatroomId: $chatroomId
				content: $content
				file: $file
			) {
				id
				content
				imageUrl
				user {
					id
					username
					email
				}
			}
		}
	`
	const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION, {
		update(cache, { data }) {
			const newMessage = data?.sendMessage
			if (!newMessage) return

			const chatroomId = newMessage.chatroomId

			cache.modify({
				fields: {
					getMessagesForChatroom(
						existingMessages = [],
						{ readField }
					) {
						if (readField('chatroomId') === chatroomId) {
							return [...existingMessages, newMessage]
						}
						return existingMessages
					}
				}
			})
		}
	})
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const { getRootProps, getInputProps } = useDropzone({
		onDrop: acceptedFiles => {
			if (acceptedFiles.length > 0) {
				setSelectedFile(acceptedFiles[0])
			}
		}
	})
	const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null
	// const { id } = useParams<{ id: string }>()
	const location = useLocation()
	const queryParams = new URLSearchParams(location.search)
	const id = queryParams.get('id')
	console.log('GETTING ID', id)
	const [subscriptions, setSubscriptions] = useState<any>([])

	const USER_STARTED_TYPING_SUBSCRIPTION = gql`
		subscription UserStartedTyping($chatroomId: Float!, $userId: String!) {
			userStartedTyping(chatroomId: $chatroomId, userId: $userId) {
				id
				username
				email
				avatar
			}
		}
	`

	const { data: typingData } = useSubscription<UserStartedTypingSubscription>(
		USER_STARTED_TYPING_SUBSCRIPTION,
		{
			variables: {
				chatroomId: parseInt(id!),
				userId: user?.id
			}
		}
	)
	const USER_STOPPED_TYPING_SUBSCRIPTION = gql`
		subscription UserStoppedTyping($chatroomId: Float!, $userId: String!) {
			userStoppedTyping(chatroomId: $chatroomId, userId: $userId) {
				id
				username
				email
				avatar
			}
		}
	`
	const { data: stoppedTypingData } =
		useSubscription<UserStoppedTypingSubscription>(
			USER_STOPPED_TYPING_SUBSCRIPTION,
			{
				variables: { chatroomId: parseInt(id!), userId: user?.id }
			}
		)
	const USER_STARTED_TYPING_MUTATION = gql`
		mutation UserStartedTypingMutation($chatroomId: Float!) {
			userStartedTypingMutation(chatroomId: $chatroomId) {
				id
				username
				email
			}
		}
	`

	const [userStartedTypingMutation] = useMutation(
		USER_STARTED_TYPING_MUTATION,
		{
			onCompleted: () => {
				console.log('User started typing')
			},
			variables: { chatroomId: parseInt(id!) }
		}
	)
	const USER_STOPPED_TYPING_MUTATION = gql`
		mutation UserStoppedTypingMutation($chatroomId: Float!) {
			userStoppedTypingMutation(chatroomId: $chatroomId) {
				id
				username
				email
			}
		}
	`

	const [userStoppedTypingMutation] = useMutation(
		USER_STOPPED_TYPING_MUTATION,
		{
			onCompleted: () => {
				console.log('User stopped typing')
			},
			variables: { chatroomId: parseInt(id!) }
		}
	)

	useEffect(() => {
		if (typingData?.userStartedTyping) {
			const user: any = typingData.userStartedTyping
			addUser(user) // Добавляем пользователя в хранилище
		}
	}, [typingData])

	//
	useEffect(() => {
		if (stoppedTypingData?.userStoppedTyping) {
			const user = stoppedTypingData.userStoppedTyping
			removeUser(user.id) // Убираем пользователя из хранилища
		}
	}, [stoppedTypingData])

	const typingTimeoutsRef = useRef<{ [key: string]: NodeJS.Timeout }>({})

	const handleUserStartedTyping = async () => {
		await userStartedTypingMutation() // Уведомляем сервер, что пользователь начал печатать

		if (userId && typingTimeoutsRef.current[userId]) {
			clearTimeout(typingTimeoutsRef.current[userId]) // Очищаем предыдущий таймер
		}

		if (userId) {
			typingTimeoutsRef.current[userId] = setTimeout(async () => {
				removeUser(userId) // Удаляем пользователя из контекста
				await userStoppedTypingMutation() // Уведомляем сервер, что пользователь перестал печатать
			}, 2000) // Таймер на 2 секунды
		}
	}
	// const handleDebouncedInput = debounce(handleUserStartedTyping, 300)

	// Используйте handleDebouncedInput в input-обработчике
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMessageContent(e.target.value) // Обновление состояния ввода
	}
	const [liveUsers, setLiveUsers] = useState<any[]>([])

	const LIVE_USERS_SUBSCRIPTION = gql`
		subscription LiveUsersInChatroom($chatroomId: Int!) {
			liveUsersInChatroom(chatroomId: $chatroomId) {
				id
				username
				avatar
				email
			}
		}
	`
	const { data: liveUsersData, loading: liveUsersLoading } =
		useSubscription<LiveUsersInChatroomSubscription>(
			LIVE_USERS_SUBSCRIPTION,
			{
				variables: {
					chatroomId: parseInt(id!)
				}
			}
		)

	useEffect(() => {
		if (liveUsersData?.liveUsersInChatroom) {
			setLiveUsers(liveUsersData.liveUsersInChatroom)
		}
	}, [liveUsersData])

	const ENTER_CHATROOM = gql`
		mutation EnterChatroom($chatroomId: Int!) {
			enterChatroom(chatroomId: $chatroomId)
		}
	`
	const LEAVE_CHATROOM = gql`
		mutation LeaveChatroom($chatroomId: Int!) {
			leaveChatroom(chatroomId: $chatroomId)
		}
	`

	const [enterChatroom] = useMutation(ENTER_CHATROOM)
	const [leaveChatroom] = useMutation(LEAVE_CHATROOM)
	// const chatroomId = parseInt(id!)
	const chatroomId = id ? parseInt(id) : null

	if (!chatroomId) {
		console.error('Invalid chatroomId:', id)
		// Либо редирект на страницу с ошибкой или пустым значением.

		return <div>Ошибка! Chatroom ID не найден.</div>
	}

	const handleEnter = async () => {
		if (chatroomId) {
			await enterChatroom({ variables: { chatroomId } })
				.then(response => {
					if (response.data.enterChatroom) {
						console.log('Successfully entered chatroom!')
					}
				})
				.catch(error => {
					console.error('Error entering chatroom:', error)
				})
		} else {
			console.error('Chatroom ID is missing!')
		}
	}

	const handleLeave = async () => {
		await leaveChatroom({ variables: { chatroomId } })
			.then(response => {
				if (response.data.leaveChatroom) {
					console.log('Successfully left chatroom!')
				}
			})
			.catch(error => {
				console.error('Error leaving chatroom:', error)
			})
	}

	const [isUserPartOfChatroom, setIsUserPartOfChatroom] =
		useState<() => boolean | undefined>()

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
				chatroomId: chatroomId
			}
		}
	)

	useEffect(() => {
		setIsUserPartOfChatroom(() =>
			dataUsersOfChatroom?.getUsersOfChatroom.some(
				user => user.id === userId
			)
		)
	}, [dataUsersOfChatroom?.getUsersOfChatroom, userId])

	useEffect(() => {
		handleEnter()
		if (liveUsersData?.liveUsersInChatroom) {
			setLiveUsers(liveUsersData.liveUsersInChatroom)
			setIsUserPartOfChatroom(() =>
				dataUsersOfChatroom?.getUsersOfChatroom.some(
					user => user.id === userId
				)
			)
		}
	}, [chatroomId])

	useEffect(() => {
		handleLeave()

		window.addEventListener('beforeunload', handleLeave)
		return () => {
			window.removeEventListener('beforeunload', handleLeave)
		}
	}, [chatroomId])

	useEffect(() => {
		handleEnter()
		if (liveUsersData?.liveUsersInChatroom) {
			setLiveUsers(liveUsersData.liveUsersInChatroom)
		}

		return () => {
			handleLeave()
		}
	}, [chatroomId])

	const scrollAreaRef = React.useRef<HTMLDivElement | null>(null)

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
				chatroomId: chatroomId
			},
			fetchPolicy: 'network-only' // Игнорирует кеш
		}
	)

	useEffect(() => {
		if (data?.getMessagesForChatroom) {
			setMessagesByChatroom(prevMessages => {
				const updatedMessages = new Map(prevMessages)
				const currentMessages = updatedMessages.get(chatroomId) || []

				// Убираем дубли (по `id`)
				const mergedMessages = [
					...new Map(
						[
							...currentMessages,
							...data.getMessagesForChatroom
						].map(m => [m.id, m])
					).values()
				]

				updatedMessages.set(chatroomId, mergedMessages)
				return updatedMessages
			})

			scrollToBottom()
		}
	}, [data?.getMessagesForChatroom, chatroomId])

	const GET_CHATROOMS_FOR_USER = gql`
		query GetChatroomsForUser($userId: String!) {
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
					user {
						id
						username
						avatar
						email
					}
				}
			}
		}
	`

	const handleSendMessage = async () => {
		if (!messageContent.trim() && !selectedFile) {
			return // Если нет текста и файла — ничего не делаем
		}

		try {
			await sendMessage({
				variables: {
					chatroomId: chatroomId,
					content: messageContent,
					// file: selectedFile ? selectedFile : null
					file: selectedFile || null // Если файл не выбран, отправляем null
				},
				refetchQueries: [
					{
						query: GET_CHATROOMS_FOR_USER,
						variables: {
							userId: userId
						}
					},
					{
						query: GET_MESSAGES_FOR_CHATROOM,
						variables: { chatroomId }
					}
				]
			})

			setMessageContent('')
			setSelectedFile(null)
		} catch (err) {
			console.error('Error sending message:', err)
		}
	}

	const scrollToBottom = () => {
		if (scrollAreaRef.current) {
			console.log('Scrolling to bottom')
			const scrollElement = scrollAreaRef.current
			console.log(scrollElement.scrollHeight, scrollElement.clientHeight)
			scrollElement.scrollTo({
				top: scrollElement.scrollHeight,
				behavior: 'smooth'
			})
		}
	}
	//
	const NEW_MESSAGE_SUBSCRIPTION = gql`
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
	`
	const { data: newMessageData } = useSubscription(NEW_MESSAGE_SUBSCRIPTION, {
		variables: { userId, chatroomId },
		onSubscriptionData: ({ client, subscriptionData }) => {
			client.refetchQueries({
				include: [GET_MESSAGES_FOR_CHATROOM]
			})
		}
	})
	/////////////////////////////////////////////////////
	// const NEW_MESSAGE_FOR_ALL_CHATS_SUBSCRIPTION = gql`
	// 	subscription NewMessageForAllChats($userId: String!) {
	// 		newMessageForAllChats(userId: $userId) {
	// 			id
	// 			content
	// 			createdAt
	// 			user {
	// 				id
	// 				username
	// 				avatar
	// 			}
	// 			chatroom {
	// 				id
	// 				name
	// 			}
	// 		}
	// 	}
	// `
	// const { data: newMessageForAllChatsData } = useSubscription(
	// 	NEW_MESSAGE_FOR_ALL_CHATS_SUBSCRIPTION,
	// 	{
	// 		variables: { userId },
	// 		onSubscriptionData: ({ client, subscriptionData }) => {
	// 			const newMessage = subscriptionData.data.newMessageForAllChats

	// 			// Обновление сообщений в чатах
	// 			setMessagesByChatroom(prevMessages => {
	// 				const updatedMessages = new Map(prevMessages)
	// 				const currentMessages =
	// 					updatedMessages.get(newMessage.chatroom.id) || []

	// 				// Добавляем новое сообщение в список сообщений чата
	// 				updatedMessages.set(newMessage.chatroom.id, [
	// 					...currentMessages,
	// 					newMessage
	// 				])

	// 				return updatedMessages
	// 			})

	// 			// Можно обновить кеш Apollo для обновления UI
	// 			client.cache.modify({
	// 				fields: {
	// 					getMessagesForChatroom(
	// 						existingMessages = [],
	// 						{ readField }
	// 					) {
	// 						if (
	// 							readField('chatroomId') ===
	// 							newMessage.chatroom.id
	// 						) {
	// 							return [...existingMessages, newMessage]
	// 						}
	// 						return existingMessages
	// 					}
	// 				}
	// 			})
	// 		}
	// 	}
	// )

	// useEffect(() => {
	// 	if (newMessageForAllChatsData?.newMessageForAllChats) {
	// 		const newMessage = newMessageForAllChatsData.newMessageForAllChats

	// 		// Обновляем список чатов с новым сообщением
	// 		setMessagesByChatroom(prevMessages => {
	// 			const updatedMessages = new Map(prevMessages)
	// 			const currentMessages =
	// 				updatedMessages.get(newMessage.chatroom.id) || []

	// 			// Добавляем новое сообщение
	// 			updatedMessages.set(newMessage.chatroom.id, [
	// 				...currentMessages,
	// 				newMessage
	// 			])

	// 			return updatedMessages
	// 		})
	// 	}
	// }, [newMessageForAllChatsData?.newMessageForAllChats])
	//////////////////////////////////////////////////////////////
	useEffect(() => {
		console.log(
			'New message received:щщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщщ',
			newMessageData
		)
		if (newMessageData?.newMessage) {
			const newMessage = newMessageData.newMessage
			const chatroomId = newMessage.chatroom.id

			setMessagesByChatroom(prevMessages => {
				const updatedMessages = new Map(prevMessages)
				const currentMessages = updatedMessages.get(chatroomId) || []

				// Проверяем, есть ли уже это сообщение, чтобы избежать дубликатов
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

			// Обновляем кеш Apollo, чтобы триггерить ререндер
			client.cache.modify({
				id: `Chatroom:${chatroomId}`,
				fields: {
					messages(existingMessages = []) {
						const isMessageAlreadyInCache = existingMessages.some(
							(msg: any) => msg.id === newMessage.id
						)
						if (!isMessageAlreadyInCache) {
							return [...existingMessages, newMessage]
						}
						return existingMessages
					}
				}
			})

			scrollToBottom()
		}
	}, [newMessageData?.newMessage])

	const messages = messagesByChatroom.get(chatroomId) || []

	const handleUpdateChatroomsDataToFalse = () => {
		setIsUserPartOfChatroom(() => false)
	}
	if (loading) {
		// if (true) {
		return (
			<div>
				{/* <Loader /> */}
				{/* <PagesTopLoader /> */}
			</div>
		)
	}
	const handleEmojiSelect = (emoji: string) => {
		setMessageContent(prev => prev + emoji)
	}

	return (
		<div className='mmax-w-[1300px] h-screen w-full min-w-[336px]'>
			<div className='h-full'>
				{isUserPartOfChatroom ? (
					<Card className='h-full w-full rounded-none bg-[#000000]'>
						<Flex direction='column' className='h-full w-full'>
							{/* Заголовок с пользователями */}
							<Flex
								direction='column'
								className='mx-6 mb-1 mt-2 rounded-xl bg-gradient-to-r from-[#ffc93c] via-[#ffc93c] via-[70%] to-[#997924]'

								// bg-gradient-to-l from-[#905e26] via-[#905e26] to-[#dbc77d]   via-[#d69a1e] via-[#ffc83d]  bg-gradient-to-r from-[#ffc93c] via-[#ffc93c] to-[#997924] bg-gradient-to-r from-[#ffc83c98] via-[#ffc93c] to-[#997924] bg-gradient-to-r from-[#ffc93c] via-[#997924] via-[70%] to-[#997924]
							>
								<Flex justify='space-between' align='center'>
									<div className='flex items-center'>
										<Flex
											direction='column'
											// align='start'
											className='ml-7'
										>
											<Text
												mb='xs'
												className='font-semibold text-[#000000]'
												//  c='dimmed' italic
											>
												Участники
											</Text>
											{dataUsersOfChatroom?.getUsersOfChatroom && (
												<div className='mt-[-20px]'>
													<OverlappingAvatars
														users={
															dataUsersOfChatroom.getUsersOfChatroom
														}
													/>
												</div>
											)}
										</Flex>
										<Flex
											direction='column'
											// justify='space-around'
											// align='start'
											className='mmmr-7 mt-[-20px]'
										>
											<List>
												<Text
													mb='xs'
													//  c='dimmed' italic
													className='font-semibold text-[#000000]'
												>
													В сети
												</Text>
												{liveUsersData?.liveUsersInChatroom?.map(
													user => (
														<Flex
															key={user.id}
															align='center'
															// my='xs'
														>
															<Avatar
																radius='xl'
																size={25}
																src={getMediaSource(
																	user.avatar
																)}
															/>
															<Flex
																// pos='absolute'
																bottom={0}
																right={0}
																w={10}
																h={10}
																bg='green'
																style={{
																	borderRadius: 10
																}}
																className='mb-[20px]'
															/>
															<Text ml='sm'>
																{user.username}
															</Text>
														</Flex>
													)
												)}
											</List>
										</Flex>
									</div>
									<div className='mr-[50px]'>
										<ChatMenu
											activeRoomId={activeRoom?.id}
											title={activeRoom?.name}
											userId={userId}
											chatroomsData={chatroomsData}
											onUpdateChatroomsDataToFalse={
												handleUpdateChatroomsDataToFalse
											} // Передаем callback
										/>
									</div>
								</Flex>
							</Flex>

							{/* Сообщения */}

							<div
								className='flex-1 overflow-auto p-4'
								ref={scrollAreaRef}
							>
								{loading ? (
									<Text italic c='dimmed'>
										Loading...
									</Text>
								) : (
									messages.map((message: any) => (
										<MessageBubble
											key={message.id}
											message={message}
											currentUserId={userId ?? ''}
										/>
									))
								)}
							</div>
							{/* ////////////////////////////////////////// */}

							<div className='relative w-full'>
								<div className='absolute bottom-1 left-1/2 flex w-full -translate-x-1/2 transform justify-center'>
									<div
										className={`flex flex-row items-center gap-x-2 rounded-md bg-gradient-to-r from-[#ffc93c] via-[#997924] via-[70%] to-[#997924] shadow-md ${typingUsers.length === 0 ? 'p-0' : 'p-2'}`}
									>
										<Avatar.Group>
											{typingUsers.map((user: any) => (
												<Tooltip
													key={user.id}
													label={user.username}
												>
													<Avatar
														className='border-none'
														radius={'xl'}
														src={
															user.avatar
																? getMediaSource(
																		user.avatar
																	)
																: null
														}
													/>
												</Tooltip>
											))}
										</Avatar.Group>

										{typingUsers.length > 0 && (
											<Text
												// italic
												className='ml-[px] text-[#000000]'
											>
												is typing...
											</Text>
										)}
									</div>
								</div>
							</div>
							{/* ////////////////////////////////////////// */}
							{/* Площадка для ввода сообщений */}

							<div className='mb-8 mt-4 flex items-center gap-x-2'>
								<div {...getRootProps()}>
									{selectedFile && (
										<Image
											mr='md'
											width={50}
											height={50}
											src={previewUrl}
											alt='Preview'
											radius='md'
										/>
									)}
									<Button className='ml-2 rounded-sm hover:bg-[#e5ac28]'>
										<AttachIcon />
									</Button>

									<input
										{...getInputProps()}
										className='hidden'
									/>
								</div>
								<div className='flex w-full items-center justify-between'>
									<Input
										className='flex-1'
										placeholder='Введите сообщение...'
										value={messageContent}
										onChange={handleInputChange}
										onKeyDown={handleUserStartedTyping} // Логика остается
									/>

									<EmojiPicker
										// value={messageContent}
										onChange={handleEmojiSelect}
										isDisabled={
											// isDisabled || isLoadingSend
											false
										}
									/>

									<Button
										onClick={handleSendMessage}
										color='blue'
										className='ml-2 mr-3 hover:bg-[#e5ac28]'
									>
										<SendIcon />
									</Button>
								</div>
								{/* {error && <p className="text-red-500">{error.message}</p>} */}
							</div>
						</Flex>
					</Card>
				) : (
					<div className='flex h-screen items-center justify-center bg-[#000000]'>
						<div className='w-full max-w-lg rounded-lg bg-opacity-80 p-8 text-center text-white backdrop-blur-lg'>
							{/* Заголовок */}
							<h1 className='mb-6 bg-gradient-to-t from-[#905e26] via-[#905e26] to-[#dbc77d] bg-clip-text text-4xl font-extrabold text-transparent'>
								Создайте или Войдите в чат, чтобы начать
								общение!
							</h1>

							{/* Изображение кота (можно заменить на другое изображение) */}
							<Image
								width={200}
								height={200}
								src='/logos/biglogoblgl.png'
								alt='Кот'
								className='mx-auto mb-6 rounded-lg shadow-lg'
							/>

							{/* Кнопки для входа и создания чата */}
							<div className='space-x-4'>
								<Button
									className='rounded-lg bg-[#ffc83d] px-6 py-6 text-xl font-semibold text-black transition-all duration-300 hover:bg-[#e5ac28]'
									onClick={toggleCreateRoomModal}
								>
									Создать чат
								</Button>
								{/* <button className='rounded-lg bg-[#ffc83d] px-6 py-3 text-xl font-semibold text-black transition-all duration-300 hover:bg-yellow-600'>
									Войти в чат
								</button> */}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default Chatwindow
