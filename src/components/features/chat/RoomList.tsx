'use client'

import { gql, useMutation, useQuery, useSubscription } from '@apollo/client'
import { Flex, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
// import { useRouter } from 'next/router'

import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { HeaderMenu } from '@/components/layout/header/HeaderMenu'
import { Button } from '@/components/ui/common/Button'
import { Card } from '@/components/ui/common/Card'
import { Loader } from '@/components/ui/common/Loading'
import { Separator } from '@/components/ui/common/Separator'
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/common/Sheet'

import { GetUsersOfChatroomQuery } from '@/graphql/generated/output'
import { GetChatroomsForUserQuery } from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

import { useGeneralStore } from '@/store/generalStore'

import OverlappingAvatars from './OverlappingAvatars'
import { SidebarNavigation } from './SidebarNavigation'

function RoomList(props: any) {
	const containerRef = useRef(null)

	const [searchParams, setSearchParams] = useSearchParams()
	const activeRoomId: string | null = searchParams.get('id') || null

	const [isHidden, setIsHidden] = useState(false)
	const sepcontainerRef = useRef(null)
	const [separatorHeight, setSeparatorHeight] = useState(0)

	const [userId, setUserId] = useState<string | null>(null)
	const [chatroomId, setChatroomId] = useState<number | null>(null)
	const [isUserPartOfChatroom, setIsUserPartOfChatroom] = useState(false)
	const [messagesByChatroom, setMessagesByChatroom] = useState<
		Map<string, any[]>
	>(new Map())
	// const [data, setData] = useState<any>([])
	const handleChatClick = (chatroomId: string) => {
		setSearchParams({ id: chatroomId }) // 🟢 Добавляем ID в

		// window.location.href = `/?id=${chatroomId}`
		navigate(`/?id=${chatroomId}`)
	}

	const toggleCreateRoomModal = useGeneralStore(
		state => state.toggleCreateRoomModal
	)

	// const userId: any = useCurrent().user?.id
	const user: any = useCurrent().user
	// const user = props.user
	useEffect(() => {
		if (user && user.id) {
			setUserId(user.id) // Устанавливаем userId, когда он доступен
		}
	}, [user])

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

	const { data, loading, error, refetch } =
		useQuery<GetChatroomsForUserQuery>(
			gql`
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
			`,

			{
				variables: {
					userId: userId
				},

				fetchPolicy: 'network-only'
				// skip: !userId
			}
		)

	const isSmallDevice = useMediaQuery('(max-width: 768px)')
	const defaultTextStyles: React.CSSProperties = {
		textOverflow: isSmallDevice ? 'unset' : 'ellipsis',
		whiteSpace: isSmallDevice ? 'unset' : 'nowrap',
		overflow: isSmallDevice ? 'unset' : 'hidden'
	}

	const defaultFlexStyles: React.CSSProperties = {
		maxWidth: isSmallDevice ? 'unset' : '200px'
	}

	const navigate = useNavigate()

	const [deleteChatroom] = useMutation(
		gql`
			mutation deleteChatroom($chatroomId: Float!) {
				deleteChatroom(chatroomId: $chatroomId)
			}
		`,
		{
			variables: {
				chatroomId: parseFloat(activeRoomId ?? '0')
			},
			refetchQueries: [
				{
					query: gql`
						query getChatroomsForUser($userId: String!) {
							getChatroomsForUser(userId: $userId) {
								id
								name
							}
						}
					`,
					variables: {
						userId: userId
					}
				}
			],
			onCompleted: () => {
				navigate('/')
			}
		}
	)

	const location = useLocation()

	const queryParams = new URLSearchParams(location.search)

	const id = queryParams.get('id')

	const notypedata: any = data
	console.log(notypedata, 'notypedatakkkkkkkkkkkkkkkkkk')
	console.log(id, 'idkkkkkkkkkkkkkkkkk')

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
	///////////////////////////////////////////
	////////////////////////////////////////
	const NEW_MESSAGE_FOR_ALL_CHATS_SUBSCRIPTION = gql`
		subscription NewMessageForAllChats($userId: String!) {
			newMessageForAllChats(userId: $userId) {
				id
				content
				createdAt
				user {
					id
					username
					avatar
				}
				chatroom {
					id
					name
				}
			}
		}
	`
	const { data: newMessageForAllChatsData } = useSubscription(
		NEW_MESSAGE_FOR_ALL_CHATS_SUBSCRIPTION,
		{
			variables: { userId },
			onSubscriptionData: ({ client, subscriptionData }) => {
				// client.refetchQueries({
				// 	include: [GET_CHATROOMS_FOR_USER]
				// })
				const newMessage = subscriptionData.data?.newMessageForAllChats
				console.log(
					'New message received: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
					newMessage
				) // Логируем новое сообщение

				if (!newMessage) return
				client.cache.modify({
					id: client.cache.identify({
						__typename: 'Chatroom',
						id: newMessage.chatroom.id
					}),
					fields: {
						messages(existingMessages = []) {
							return [...existingMessages, newMessage]
						}
					}
				})

				// client.cache.updateQuery(
				// 	{
				// 		query: GET_CHATROOMS_FOR_USER,
				// 		variables: { userId }
				// 	},
				// 	prev => {
				// 		if (!prev) return prev
				// 		const updatedChatrooms = prev.getChatroomsForUser.map(
				// 			(chat: any) => {
				// 				if (chat.id === newMessage.chatroom.id) {
				// 					return {
				// 						...chat,
				// 						messages: [...chat.messages, newMessage]
				// 					}
				// 				}
				// 				return chat
				// 			}
				// 		)
				// 		console.log(
				// 			'Updated chatrooms with new message: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ',
				// 			updatedChatrooms
				// 		)

				// 		return {
				// 			...prev,
				// 			getChatroomsForUser: updatedChatrooms
				// 		}
				// 	}
				// )
			}
		}
	)
	useEffect(() => {
		if (newMessageForAllChatsData?.newMessageForAllChats) {
			const newMessage = newMessageForAllChatsData.newMessageForAllChats
			setMessagesByChatroom(prevMessages => {
				const updatedMessages = new Map(prevMessages) // Создаем новый объект
				const currentMessages =
					updatedMessages.get(newMessage.chatroom.id) || []
				updatedMessages.set(newMessage.chatroom.id, [
					...currentMessages,
					newMessage
				])

				return new Map(updatedMessages) // Возвращаем новый Map
			})
		}
	}, [newMessageForAllChatsData?.newMessageForAllChats])

	///////////////////////////////////////
	//////////////////////////////////////////////
	useEffect(() => {
		// Логирование статуса загрузки
		if (loading) {
			console.log(
				'Загрузка... данные еще не получены///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////'
			)
			return
		}

		// Проверка, что данные существуют и не пустые
		const users = dataUsersOfChatroom?.getUsersOfChatroom

		if (users && users.length > 0) {
			console.log(
				'Полученные пользователи чата://///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////',
				users
			)

			const isUserInChatroom = users.some(user => user.id === userId)

			setIsUserPartOfChatroom(isUserInChatroom)

			console.log(
				'Пользователь в чате?/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////',
				isUserInChatroom
			)
		} else {
			console.log(
				'Нет пользователей в чате или данные не получены//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////'
			)
		}
	}, [dataUsersOfChatroom, loading, error, userId])

	useEffect(() => {
		const cards = document.querySelectorAll('.cardo') // Находим все карточки

		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add('show')
					} else {
						entry.target.classList.remove('show')
					}
				})
			},
			{
				rootMargin: '100px 0px -100px 0px', // Смещение области наблюдения
				threshold: 0.01 // Карточка считается видимой, если видно 50% её высоты
			}
		)

		// Подключаем observer ко всем карточкам
		cards.forEach(card => observer.observe(card))

		// Очистка наблюдателя при размонтировании компонента
		return () => observer.disconnect()
	}, [data])
	useEffect(() => {
		let resizeTimeout: NodeJS.Timeout | null = null

		const handleResize = () => {
			if (resizeTimeout) clearTimeout(resizeTimeout)

			// Задержка 200 мс перед выполнением
			resizeTimeout = setTimeout(() => {
				const cards = document.querySelectorAll('.cardo')

				const observer = new IntersectionObserver(
					entries => {
						const visibleCards = entries
							.filter(entry => entry.isIntersecting)
							.map(entry => entry.target)

						if (visibleCards.length === 0) return

						cards.forEach(card => {
							card.classList.remove('basic', 'small', 'semismall')
						})

						if (visibleCards.length >= 1) {
							visibleCards[0].classList.add('small')
						}
						if (visibleCards.length >= 2) {
							visibleCards[1].classList.add('semismall')
						}

						if (visibleCards.length >= 3) {
							visibleCards[visibleCards.length - 2].classList.add(
								'semismall'
							)
						}
						if (visibleCards.length >= 2) {
							visibleCards[visibleCards.length - 1].classList.add(
								'small'
							)
						}

						visibleCards.forEach(card => {
							if (
								!card.classList.contains('small') &&
								!card.classList.contains('semismall')
							) {
								// ✅ <-- Исправлена ошибка в условии
								card.classList.add('basic')
							}
						})
					},
					{
						rootMargin: '70px 0px -70px 0px',
						threshold: 0.6
					}
				)

				cards.forEach(card => observer.observe(card))
			}, 500) // Устанавливаем задержку в 300 мс
		}

		handleResize() // Теперь вызывается ПОСЛЕ объявления

		window.addEventListener('resize', handleResize)
		// window.addEventListener('fullscreenchange', handleResize) // ✅ Реагируем на вход/выход в полноэкранный режим
		return () => {
			window.removeEventListener('resize', handleResize)
			if (resizeTimeout) clearTimeout(resizeTimeout)

			// window.removeEventListener('fullscreenchange', handleResize) // ✅ Реагируем на вход/выход в полноэкранный режим
		}
	}, [data])

	useEffect(() => {
		const scrollContainer: any = containerRef.current
		// const hats = document.querySelectorAll('.hatt') // Находим все элементы с классом 'hatt'

		if (!scrollContainer) return

		const handleScroll = () => {
			setIsHidden(scrollContainer.scrollTop > 0) // Обновляем состояние
		}

		// Добавляем обработчик события
		scrollContainer.addEventListener('scroll', handleScroll)

		// Удаляем обработчик при размонтировании
		return () => {
			scrollContainer.removeEventListener('scroll', handleScroll)
		}
	}, [data])

	useEffect(() => {
		const sepcontainer: any = sepcontainerRef.current
		if (sepcontainerRef.current) {
			// Получаем высоту контейнера с карточками
			const sepcontainerHeight = sepcontainer.scrollHeight
			setSeparatorHeight(sepcontainerHeight)
		}
	}, [data])

	useEffect(() => {
		const notypedata: any = data

		if (!loading && notypedata?.getChatroomsForUser.length > 0) {
			const firstChatId = notypedata.getChatroomsForUser[0].id

			// Если в поисковой строке нет ID, добавляем его и перезагружаем страницу
			if (!searchParams.has('id')) {
				const newUrl = `${window.location.pathname}?id=${firstChatId}`
				window.location.replace(newUrl) // Перенаправление без добавления в историю
			}
		}
	}, [loading, data])

	if (loading || !user || !activeRoomId) {
		// if (true) {
		return (
			<div>
				{/* <Loader /> */}
				{/* <PagesTopLoader /> */}
			</div>
		)
		// Показать загрузку, пока данные не получены или id не установлен
	}

	if (error) {
		return <div>Ошибка: {error?.message}</div>
	}
	/////////////////////////////////////////////
	/////////////////////////////////////////////////////
	const sortedChatrooms = [...(data?.getChatroomsForUser || [])].sort(
		(a: any, b: any) => {
			const lastMessageA = a.messages?.[0]?.createdAt || null
			const lastMessageB = b.messages?.[0]?.createdAt || null

			if (lastMessageA && lastMessageB) {
				return (
					new Date(lastMessageB).getTime() -
					new Date(lastMessageA).getTime()
				)
			}

			return lastMessageA ? -1 : 1
		}
	)

	//////////////////////////////////////////////////////////////
	return (
		<div className='wmfull'>
			<div>
				<Card
					className='maxm-w-[1478px] hm-[1000px] hm-full w-full min-w-[336px] max-w-[100%] rounded-none'
					style={{ backgroundColor: '#000000' }}
				>
					<div className='relative mt-2 flex w-full items-center'>
						{/* Левая часть с кнопкой меню */}
						<div className='flex flex-1 items-center'>
							<Sheet>
								<SheetTrigger asChild>
									<Button
										className='ml-4 shrink-0 bg-black text-white hover:text-gray-400'
										// variant='outline'
										size='icon'
									>
										<MenuIcon className='h-5 w-5' />
									</Button>
								</SheetTrigger>
								<SheetContent side='left'>
									<SheetTitle></SheetTitle>
									<nav className='mt-5 flex flex-col gap-6 text-lg font-medium'>
										<SidebarNavigation />
									</nav>
								</SheetContent>
							</Sheet>
						</div>

						{/* Логотип в центре */}
						<div className='absolute left-1/2 mt-1 -translate-x-1/2'>
							<Image
								width={165}
								height={0}
								src={'/logos/longlogoblgl.png'}
								alt='Preview'
							/>
						</div>

						{/* Правая часть с HeaderMenu */}
						<div className='mr-4 flex flex-1 justify-end'>
							<HeaderMenu />
						</div>

						{/* Разделители */}
						<Separator
							className={`hatt ${isHidden ? 'unvisible' : ''} mb-[-20px] ml-auto mt-auto h-[60px] w-[29px] rounded-t-full bg-[#d7c279]`}
						/>
						{(data?.getChatroomsForUser?.length ?? 0) > 8 && (
							<Separator className='ml-auto h-[30px] w-[9px] bg-[#000000]' />
						)}
					</div>

					<div
						className='mmmmh-[100vhmmmm] hm-[927px] hm-full mt-[15px] overflow-y-auto overflow-x-hidden'
						ref={containerRef}
					>
						<div className='flex flex-col'>
							<Flex justify='center' align='center'>
								{loading && (
									<Flex align='center'>
										<Loader />
										<Text c='dimmed' italic>
											Loading...
										</Text>
									</Flex>
								)}
							</Flex>
							<div className='flex flex-row'>
								<Separator className='mbmm-[30px] wm-[98.56%] mr-[30px] h-[17px] w-full rounded-l-full bg-gradient-to-r from-[#905e26] via-[#905e26] via-50% to-[#dbc77d]' />
							</div>
							<div className='mmmmmmmm relative flex h-screen items-start justify-center'>
								<div
									className='mtm-[30px] maxьььь-h-[calc(100vh-150px)] flex w-[95%] flex-col items-center'
									ref={sepcontainerRef}
								>
									<div className='flex flex-row justify-around'>
										<Separator className='z-10 ml-[30px] h-[43px] w-[20px] rounded-l-[18px] bg-[#000000]' />
										<Separator className='ml-[-30px] h-[43px] w-[30px] bg-[#905e26]' />
										<Separator className='ml-[-35px] h-[43px] w-[10px] bg-[#905e26]' />
									</div>

									{// data?.getChatroomsForUser?
									sortedChatrooms?.map((chatroom: any) => (
										<Card
											key={chatroom.id}
											onClick={() =>
												handleChatClick(
													chatroom.id || ''
												)
											}
											// bg-[#D1A745]
											className={`cardo show ${
												activeRoomId === chatroom.id
													? 'bg-gradient-to-r from-[rgb(229,172,40)] via-[#e5ac28] via-70% to-[#997924]'
													: 'bg-gradient-to-r from-[#ffc93c] via-[#ffc93c] via-70% to-[#997924]'
											} mb-2 h-[77px] w-[90%] rounded-full transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-gradient-to-r hover:from-[#ecac21] hover:via-[#ecac21] hover:via-70% hover:to-[#997924] hover:shadow-lg`}
											//  hover:bg-gradient-to-r hover:from-[#ca8a04] hover:via-[#ca8a04] hover:via-70% hover:to-[#997924]
											// bg-gradient-to-r from-[#D1A745] via-[#D1A745] via-70% to-[#997924]
											style={{
												cursor: 'pointer',
												transition:
													'background-color 0.3s'
											}}
										>
											<div className='pm-2 gapm-x-[20px] flex flex-row items-center justify-start'>
												{chatroom?.ChatroomUsers &&
													chatroom.ChatroomUsers
														.length > 0 && (
														<>
															{console.log(
																'Users in chatroom with their roles:',
																chatroom.ChatroomUsers.map(
																	(
																		chatroomUser: any
																	) => ({
																		userId: chatroomUser.userId,
																		role: chatroomUser.role,
																		user: chatroomUser.user // Получаем сам объект пользователя
																	})
																)
															)}

															<div className='mrn-[20px] ml-[10px] mt-[10px] flex'>
																<OverlappingAvatars
																	users={chatroom.ChatroomUsers.map(
																		(
																			chatroomUser: any
																		) =>
																			chatroomUser.user
																	)}
																/>
															</div>
														</>
													)}
												<div className='flex h-full flex-grow flex-col'>
													<Text
														size='md'
														className='font-semibold text-[#000000]'
													>
														{chatroom.name}
													</Text>
													{chatroom.messages &&
													chatroom.messages.length >
														0 ? (
														<>
															<Text className='text-[#000000]'>
																{
																	chatroom
																		.messages[0]
																		.content
																}
															</Text>
															<Text className='w-full overflow-hidden truncate whitespace-nowrap text-sm text-[#000000]'>
																{new Date(
																	chatroom.messages[0].createdAt
																).toLocaleString()}
															</Text>
														</>
													) : (
														<Text
															italic
															className='text-[#000000]'
														>
															Нет сообщений
														</Text>
													)}
												</div>
											</div>
										</Card>
									))}
									<div className='h-[170px] w-[300px] bg-[#000000]'></div>
								</div>
								<div
									className='relative ml-auto h-full flex-shrink-0'
									style={{ minHeight: '100%' }}
								>
									<Separator
										className='mmr-[30px] h-full w-[30px] rounded-b-full bg-gradient-to-t from-[#905e26] via-[#905e26] via-50% to-[#dbc77d]'
										style={{
											height: `${separatorHeight}px`
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</div>
	)
}

export default RoomList
