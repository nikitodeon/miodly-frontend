'use client'

import {
	from,
	gql,
	useMutation,
	useQuery,
	useSubscription
} from '@apollo/client'
import {
	Avatar,
	// Button,
	// Card,
	Divider,
	Flex,
	Image,
	List,
	Paper,
	ScrollArea,
	Text,
	// TextInput,
	Tooltip,
	useMantineTheme
} from '@mantine/core'
// import { USER_STARTED_TYPING_SUBSCRIPTION } from "../graphql/subscriptions/UserStartedTyping"
// import { USER_STOPPED_TYPING_SUBSCRIPTION } from "../graphql/subscriptions/UserStoppedTyping"
// import { LIVE_USERS_SUBSCRIPTION } from "../graphql/subscriptions/LiveUsers"
// import { ENTER_CHATROOM } from "../graphql/mutations/EnterChatroom"
// import { LEAVE_CHATROOM } from "../graphql/mutations/LeaveChatroom"
// import { GET_USERS_OF_CHATROOM } from "../graphql/queries/GetUsersOfChatroom"
// import { GET_CHATROOMS_FOR_USER } from "../graphql/queries/GetChatroomsForUser"
import { useMediaQuery } from '@mantine/hooks'
// import { SEND_MESSAGE } from "../graphql/mutations/SendMessage"
import { IconMichelinBibGourmand } from '@tabler/icons-react'
import { debounce, get } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/common/Button'
import { Card } from '@/components/ui/common/Card'
import { AttachIcon, SendIcon } from '@/components/ui/common/Icons'
import { Input } from '@/components/ui/common/Input'

import {
	GetChatroomsForUserQuery,
	GetMessagesForChatroomQuery,
	GetUsersOfChatroomQuery,
	LiveUsersInChatroomSubscription,
	Message,
	NewMessageSubscription,
	SendMessageMutation,
	UserModel,
	//   User,
	UserStartedTypingSubscription,
	UserStoppedTypingSubscription
} from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

import { useTypingUsers } from '@/store/typingUsers'

import { getMediaSource } from '@/utils/get-media-source'

import { ChatMenu } from './ChatMenu'
// import { USER_STARTED_TYPING_MUTATION } from "../graphql/mutations/UserStartedTypingMutation"
// import { USER_STOPPED_TYPING_MUTATION } from "../graphql/mutations/UserStoppedTypingMutation"
import MessageBubble from './MessageBubble'
// import { GET_MESSAGES_FOR_CHATROOM } from "../graphql/queries/GetMessagesForChatroom"
// import { useUserStore } from "../stores/userStore"

// import { NEW_MESSAGE_SUBSCRIPTION } from "../graphql/subscriptions/NewMessage"

import OverlappingAvatars from './OverlappingAvatars'

// const user = props.user

function Chatwindow() {
	const user = useCurrent().user
	const [userId, setUserId] = useState<string | null>(null)

	// const userId = user?.id
	const [searchParams, setSearchParams] = useSearchParams()
	const activeRoomId: string | null = searchParams.get('id') || null
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
	const [sendMessage] = useMutation<SendMessageMutation>(
		SEND_MESSAGE_MUTATION
	)

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

	//   const user = useUserStore((state) => state)
	// const user = useCurrent().user
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

	// const [typingUsers, setTypingUsers] = useState<any[]>([])

	// useEffect(() => {
	// 	const user = typingData?.userStartedTyping
	// 	if (user && user.id) {
	// 		setTypingUsers(prevUsers => {
	// 			if (!prevUsers.find(u => u.id === user.id)) {
	// 				return [...prevUsers, user]
	// 			}
	// 			return prevUsers
	// 		})
	// 	}
	// }, [typingData])

	useEffect(() => {
		if (typingData?.userStartedTyping) {
			const user: any = typingData.userStartedTyping
			addUser(user) // Добавляем пользователя в хранилище
		}
	}, [typingData])

	// useEffect(() => {
	// 	const user = stoppedTypingData?.userStoppedTyping
	// 	const notypeuser: any = user
	// 	if (notypeuser && notypeuser.id) {
	// 		clearTimeout(typingTimeoutsRef.current[notypeuser.id])
	// 		setTypingUsers(prevUsers =>
	// 			prevUsers.filter(u => u.id !== notypeuser.id)
	// 		)
	// 	}
	// },
	useEffect(() => {
		if (stoppedTypingData?.userStoppedTyping) {
			const user = stoppedTypingData.userStoppedTyping
			removeUser(user.id) // Убираем пользователя из хранилища
		}
	}, [stoppedTypingData])

	//   const userId = useUserStore((state) => state.id)

	// const handleUserStartedTyping = async () => {
	// 	await userStartedTypingMutation()

	// 	if (userId && typingTimeoutsRef.current[userId]) {
	// 		clearTimeout(typingTimeoutsRef.current[userId])
	// 	}
	// 	if (userId) {
	// 		typingTimeoutsRef.current[userId] = setTimeout(async () => {
	// 			setTypingUsers(prevUsers =>
	// 				prevUsers.filter(user => user.id !== userId)
	// 			)
	// 			await userStoppedTypingMutation()
	// 		}, 2000)
	// 	}
	// }
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

		// Вызов функции с дебаунсингом
		// handleDebouncedInput()
	}

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

	const [liveUsers, setLiveUsers] = useState<any[]>([])

	useEffect(() => {
		if (liveUsersData?.liveUsersInChatroom) {
			setLiveUsers(liveUsersData.liveUsersInChatroom)
		}
	}, [liveUsersData?.liveUsersInChatroom])
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

	// const handleEnter = async () => {
	// 	await enterChatroom({ variables: { chatroomId } })
	// 		.then(response => {
	// 			if (response.data.enterChatroom) {
	// 				console.log('Successfully entered chatroom!')
	// 			}
	// 		})
	// 		.catch(error => {
	// 			console.error('Error entering chatroom:', error)
	// 		})
	// }
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
		window.addEventListener('beforeunload', handleLeave)
		return () => {
			window.removeEventListener('beforeunload', handleLeave)
		}
	}, [])

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
			}
		}
	)

	const [messages, setMessages] = useState<any>([])
	useEffect(() => {
		if (data?.getMessagesForChatroom) {
			setMessages(data.getMessagesForChatroom)
		}
	}, [data?.getMessagesForChatroom])

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
					}
				]
			})
			// console.log(
			// 	'Message sent successfully!, chatroomId:',
			// 	chatroomId,
			// 	'messageContent:',
			// 	messageContent,
			// 	'selectedFile:',
			// 	selectedFile
			// )
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
	useEffect(() => {
		if (data?.getMessagesForChatroom) {
			const uniqueMessages = Array.from(
				new Set(data.getMessagesForChatroom.map(m => m.id))
			).map(id => data.getMessagesForChatroom.find(m => m.id === id))
			setMessages(uniqueMessages as Message[])
			scrollToBottom()
		}
	}, [data?.getMessagesForChatroom])
	const NEW_MESSAGE_SUBSCRIPTION = gql`
		subscription NewMessage($chatroomId: Float!) {
			newMessage(chatroomId: $chatroomId) {
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
			}
		}
	`
	const { data: dataSub } = useSubscription<NewMessageSubscription>(
		NEW_MESSAGE_SUBSCRIPTION,
		{
			variables: { chatroomId }
		}
	)

	useEffect(() => {
		scrollToBottom()
		if (dataSub?.newMessage) {
			if (!messages.find((m: any) => m.id === dataSub.newMessage?.id)) {
				setMessages((prevMessages: any) => [
					...prevMessages,
					dataSub.newMessage!
				])
			}
		}
	}, [dataSub?.newMessage, messages])
	const isMediumDevice = useMediaQuery('(max-width: 992px)')

	liveUsersData?.liveUsersInChatroom?.map(
		user => (
			console.log(user.avatar, user.username), console.log('live users')
		)
	)

	console.log('activeChatroomooooooooooooooo', activeRoom?.name)
	console.log('activeRoomIdoooooooooooooo', activeRoomId)
	console.log('chatroomsDataooooooooooo', chatroomsData)
	console.log(
		'chatroomsData?.getChatroomsForUserooooooooooooooo',
		chatroomsData?.getChatroomsForUser
	)

	return (
		<div className='mmax-w-[1300px] h-screen w-full min-w-[336px]'>
			<div className='h-full'>
				{isUserPartOfChatroom ? (
					<Card className='h-full w-full rounded-none bg-[#000000]'>
						<Flex direction='column' className='h-full w-full'>
							{/* Заголовок с пользователями */}
							<Flex
								direction='column'
								className='mx-6 mb-1 rounded-xl bg-gradient-to-r from-[#ffc93c] via-[#ffc93c] via-[70%] to-[#997924]'

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
												Chat with
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
													Live users
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
										<div>
											<MessageBubble
												key={message.id}
												message={message}
												currentUserId={userId ?? ''}
											/>
										</div>
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
									<Button className='ml-2 rounded-sm'>
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
										placeholder='Type your message...'
										value={messageContent}
										onChange={handleInputChange}
										onKeyDown={handleUserStartedTyping} // Логика остается
									/>
									<Button
										onClick={handleSendMessage}
										color='blue'
										className='ml-2 mr-2'
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
								<button className='rounded-lg bg-[#ffc83d] px-6 py-3 text-xl font-semibold text-black transition-all duration-300 hover:bg-yellow-600'>
									Создать чат
								</button>
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
