'use client'

import { gql, useMutation, useQuery } from '@apollo/client'
import { Divider, Flex, Group, Loader, ScrollArea, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconPlus, IconX } from '@tabler/icons-react'
import { entries, get } from 'lodash'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
// import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { MdHive } from 'react-icons/md'
import {
	Link,
	useLocation,
	useNavigate,
	useParams,
	useSearchParams
} from 'react-router-dom'

import { HeaderMenu } from '@/components/layout/header/HeaderMenu'
import { Button } from '@/components/ui/common/Button'
import { Card } from '@/components/ui/common/Card'
import { Separator } from '@/components/ui/common/Separator'

import {
	GetUsersOfChatroomQuery,
	useGetChatroomsForUserQuery
} from '@/graphql/generated/output'
import { Chatroom, GetChatroomsForUserQuery } from '@/graphql/generated/output'
import { MutationDeleteChatroomArgs } from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

import { useGeneralStore } from '@/store/generalStore'

import OverlappingAvatars from './OverlappingAvatars'

function RoomList(props: any) {
	const [visibleIndex, setVisibleIndex] = useState(0)
	const containerRef = useRef(null)
	const cardRefs = useRef<any>([])
	const [searchParams, setSearchParams] = useSearchParams()
	const activeRoomId: string | null = searchParams.get('id') || null
	const [visibleCards, setVisibleCards] = useState([])
	const [scrollTrigger, setScrollTrigger] = useState(0)
	const [isHidden, setIsHidden] = useState(false)
	const sepcontainerRef = useRef(null)
	const [separatorHeight, setSeparatorHeight] = useState(0)
	const router = useRouter()
	const pathname = usePathname()
	const [userId, setUserId] = useState<string | null>(null)
	const [chatroomId, setChatroomId] = useState<number | null>(null)
	const [isUserPartOfChatroom, setIsUserPartOfChatroom] = useState(false)

	// const [data, setData] = useState<any>([])
	const handleChatClick = (chatroomId: string) => {
		setSearchParams({ id: chatroomId }) // 🟢 Добавляем ID в

		// navigate(`/?id=${chatroomId}`, { replace: true })
		window.location.href = `/?id=${chatroomId}`
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

	const { data, loading, error } = useQuery<GetChatroomsForUserQuery>(
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
			}
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
	// const handleDeleteClick = (event: React.MouseEvent) => {
	// 	event.stopPropagation() // Останавливаем всплытие события
	// 	deleteChatroom() // Вызываем мутацию
	// }
	const location = useLocation()

	const queryParams = new URLSearchParams(location.search)

	const id = queryParams.get('id')
	// if (!data || !data.getChatroomsForUser) {
	// 	console.log('Данные ещё загружаются...')
	// 	return null // Пока данные не загрузились, не выполняем код дальше
	// }

	const notypedata: any = data
	console.log(notypedata, 'notypedatakkkkkkkkkkkkkkkkkk')
	console.log(id, 'idkkkkkkkkkkkkkkkkk')
	// console.log(notypedata.getChatroomsForUser[0]?.id, 'firstChatId')

	// const chatroomId =

	// id
	// 	? parseInt(id)
	// 	: notypedata?.getChatroomsForUser?.length > 0
	// 		? notypedata.getChatroomsForUser[0].id
	// 		: null

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

	// const { data: dataUsersOfChatroom } = useQuery<GetUsersOfChatroomQuery>(
	// 	GET_USERS_OF_CHATROOM,
	// 	{
	// 		variables: {
	// 			chatroomId: chatroomId
	// 		}
	// 	}
	// )

	// let initialData = useQuery<GetChatroomsForUserQuery>(
	// 	gql`
	// 		query getChatroomsForUser($userId: String!) {
	// 			getChatroomsForUser(userId: $userId) {
	// 				id
	// 				name
	// 				users {
	// 					id
	// 					username
	// 					avatar
	// 				}
	// 				messages {
	// 					id
	// 					content
	// 					createdAt
	// 				}
	// 			}
	// 		}
	// 	`,
	// 	{
	// 		variables: {
	// 			userId: userId
	// 		}
	// 		// skip: !userId
	// 	}
	// ).data
	// useEffect(() => {
	// 	if (initialData) {
	// 		setData(initialData) // Устанавливаем userId, когда он доступен
	// 	}
	// }, [initialData])
	const { data: dataUsersOfChatroom } = useQuery<GetUsersOfChatroomQuery>(
		GET_USERS_OF_CHATROOM,
		{
			variables: {
				chatroomId: chatroomId
			}
		}
	)

	useEffect(() => {
		// Логирование статуса загрузки
		if (loading) {
			console.log(
				'Загрузка... данные еще не получены///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////'
			)
			return
		}

		// Логирование ошибок, если они возникли
		if (error) {
			console.error(
				'Ошибка при загрузке данных://///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////',
				error
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
				//////////////////////////////////////////////
				// if (isFullscreen) {
				// 	console.log('Fullscreen mode detected, reapplying styles...')
				// 	setTimeout(() => handleResize(), 300) // Ждём, чтобы браузер точно обновил размеры
				// }
				/////////////////////////////
			}, 500) // Устанавливаем задержку в 300 мс
		}

		handleResize() // ✅ <-- Теперь вызывается ПОСЛЕ объявления

		window.addEventListener('resize', handleResize)
		// window.addEventListener('fullscreenchange', handleResize) // ✅ Реагируем на вход/выход в полноэкранный режим
		return () => {
			window.removeEventListener('resize', handleResize)
			if (resizeTimeout) clearTimeout(resizeTimeout)

			// window.removeEventListener('fullscreenchange', handleResize) // ✅ Реагируем на вход/выход в полноэкранный режим
		}
	}, [data])

	//////////////////////AAAAAAAAAAAAAAAAAAAAAA
	// useEffect(() => {
	// 	const handleResize = () => {
	// 		// ✅ <-- Теперь функция объявлена ДО её вызова
	// 		const cards = document.querySelectorAll('.cardo')

	// 		const observer = new IntersectionObserver(
	// 			entries => {
	// 				const visibleCards = entries
	// 					.filter(entry => entry.isIntersecting)
	// 					.map(entry => entry.target)

	// 				if (visibleCards.length === 0) return

	// 				cards.forEach(card => {
	// 					card.classList.remove('basic', 'small', 'semismall')
	// 				})

	// 				if (visibleCards.length >= 1) {
	// 					visibleCards[0].classList.add('small')
	// 				}
	// 				if (visibleCards.length >= 2) {
	// 					visibleCards[1].classList.add('semismall')
	// 				}

	// 				if (visibleCards.length >= 3) {
	// 					visibleCards[visibleCards.length - 2].classList.add(
	// 						'semismall'
	// 					)
	// 				}
	// 				if (visibleCards.length >= 2) {
	// 					visibleCards[visibleCards.length - 1].classList.add(
	// 						'small'
	// 					)
	// 				}

	// 				visibleCards.forEach(card => {
	// 					if (
	// 						!card.classList.contains('small') &&
	// 						!card.classList.contains('semismall')
	// 					) {
	// 						// ✅ <-- Исправлена ошибка в условии
	// 						card.classList.add('basic')
	// 					}
	// 				})
	// 			},
	// 			{
	// 				rootMargin: '70px 0px -70px 0px',
	// 				threshold: 0.6
	// 			}
	// 		)

	// 		cards.forEach(card => observer.observe(card))
	// 	}

	// 	handleResize() // ✅ <-- Теперь вызывается ПОСЛЕ объявления

	// 	window.addEventListener('resize', handleResize)

	// 	return () => {
	// 		window.removeEventListener('resize', handleResize)
	// 	}
	// }, [data])

	// useEffect(() => {
	// 	const container: any = containerRef.current
	// 	if (!container) return

	// 	const handleScroll = () => {
	// 		setScrollTrigger(prev => prev + 1) // Форсим ререндер карточек
	// 	}

	// 	container.addEventListener('scroll', handleScroll)

	// 	return () => container.removeEventListener('scroll', handleScroll)
	// }, [])

	useEffect(() => {
		const scrollContainer: any = containerRef.current
		// const hats = document.querySelectorAll('.hatt') // Находим все элементы с классом 'hatt'

		if (!scrollContainer) return

		// const handleScroll = () => {
		// 	if (scrollContainer.scrollTop > 0) {
		// 		hats.forEach(hat => {
		// 			;(hat as HTMLElement).classList.add('unvisible') // Делаем невидимым
		// 		})
		// 	} else {
		// 		hats.forEach(hat => {
		// 			;(hat as HTMLElement).classList.remove('unvisible') // Снова делаем видимым
		// 		})
		// 	}
		// }
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
	// useEffect(() => {
	// 	const scrollContainer: any = containerRef.current
	// 	if (!scrollContainer) return

	// 	const handleScroll = () => {
	// 		// Обновляем состояние (реакт перерисует компонент)
	// 		setIsHidden(scrollContainer.scrollTop > 0)
	// 	}

	// 	scrollContainer.addEventListener('scroll', handleScroll)
	// 	return () => scrollContainer.removeEventListener('scroll', handleScroll)
	// }, [])

	useEffect(() => {
		const sepcontainer: any = sepcontainerRef.current
		if (sepcontainerRef.current) {
			// Получаем высоту контейнера с карточками
			const sepcontainerHeight = sepcontainer.scrollHeight
			setSeparatorHeight(sepcontainerHeight)
		}
	}, [data])

	useEffect(() => {
		if (id) {
			setChatroomId(parseInt(id))
		} else if (notypedata?.getChatroomsForUser?.length > 0) {
			const firstChatId = notypedata.getChatroomsForUser[0].id
			setChatroomId(firstChatId)

			// Обновляем URL и перезагружаем страницу
			const queryParams = new URLSearchParams(window.location.search)
			queryParams.set('id', firstChatId)
			window.location.href = `?${queryParams.toString()}` // Перезагрузка
		}
	}, [id, notypedata])

	// console.log(chatroomId, 'chatroomId after update')
	// useEffect(() => {
	// 	const notypedata: any = data
	// 	if (!id && notypedata?.getChatroomsForUser?.length > 0) {
	// 		const firstChatId: any = notypedata.getChatroomsForUser[0]?.id

	// 		if (firstChatId) {
	// 			setChatroomId(firstChatId)

	// 			// Обновляем URL без перезагрузки страницы
	// 			const newSearchParams = new URLSearchParams(searchParams)
	// 			newSearchParams.set('id', firstChatId.toString())

	// 			router.replace(`${pathname}?${newSearchParams.toString()}`)
	// 		}
	// 	} else if (id) {
	// 		setChatroomId(parseInt(id))
	// 	}
	// }, [id, data, pathname, router, searchParams])

	// useEffect(() => {
	// 	const notypedata: any = data
	// 	if (
	// 		!loading &&
	// 		notypedata?.getChatroomsForUser.length > 0 &&
	// 		!searchParams.get('id')
	// 	) {
	// 		const firstChatId = notypedata.getChatroomsForUser[0].id
	// 		router.push(`/?id=${firstChatId}`)
	// 	}
	// }, [data, loading, router])

	// // Ждем обновления chatroomId, чтобы избежать ошибки
	// if (!chatroomId) return <div>Загрузка...</div>

	// console.log(chatroomId, 'chatroomId after update')

	// useEffect(() => {
	// 	if (user && user.id) {
	// 		setUserId(user.id) // Устанавливаем userId, когда он доступен
	// 	}
	// }, [user])

	useEffect(() => {
		const notypedata: any = data
		if (!loading && notypedata?.getChatroomsForUser.length > 0) {
			const firstChatId = notypedata.getChatroomsForUser[0].id
			// Проверяем, есть ли параметр 'id' в URL
			if (!searchParams.has('id')) {
				router.push(`/?id=${firstChatId}`)
			}
		}
	}, [loading, data, searchParams, router])
	useEffect(() => {
		const notypedata: any = data

		if (!loading && notypedata?.getChatroomsForUser.length > 0) {
			const firstChatId = notypedata.getChatroomsForUser[0].id

			// Если в поисковой строке нет ID, добавляем первый чат
			if (!searchParams.has('id')) {
				// Не редиректим сразу, чтобы не вызывать двойную перезагрузку
				setSearchParams({ id: firstChatId.toString() })
			}
		}
	}, [loading, data, searchParams, setSearchParams])

	if (loading || !user || !activeRoomId) {
		return <div>Загрузка...</div> // Показать загрузку, пока данные не получены или id не установлен
	}

	if (error) {
		return <div>Ошибка: {error.message}</div>
	}
	console.log(data, 'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu')
	console.log(
		data?.getChatroomsForUser.map((chatroom: any, index: number) => (
			<div key={index}>{chatroom.users}</div>
		)),
		'userspppppppppppppuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu'
	)

	console.log(
		data?.getChatroomsForUser.map((chatroom: any, index: number) => (
			<div key={index}>{chatroom.ChatroomUsers}</div>
		)),
		'ChatroomUserspppppppppppppuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu'
	)
	return (
		<div className='wmfull'>
			<div>
				<Card
					className='maxm-w-[1478px] hm-[1000px] hm-full w-full min-w-[336px] max-w-[100%] rounded-none'
					style={{ backgroundColor: '#000000' }}
				>
					<div className='mt-2 flex w-full flex-row items-center justify-between'>
						<Button onClick={toggleCreateRoomModal}>
							Create a room
						</Button>
						<div className='mb-[-15px] ml-[15%] flex-1'>
							<Image
								// mr='md'
								width={190}
								height={30}
								src={'/logos/longlogoblgl.png'}
								alt='Preview'
								// radius='md'
							/>
						</div>
						{/* <div className='flex-1'></div> */}
						<div className='mr-4 flex items-center gap-4'>
							<HeaderMenu />
						</div>
						<Separator
							className={`hatt ${isHidden ? 'unvisible' : ''} hatt mb-[-20px] ml-auto mt-auto h-[60px] w-[29px] rounded-t-full bg-[#d7c279]`}
						/>
						{(data?.getChatroomsForUser?.length ?? 0) > 6 && (
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

									{data?.getChatroomsForUser?.map(
										(chatroom: any) => (
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
														? 'bg-gradient-to-r from-[#D1A745] via-[#D1A745] via-70% to-[#997924]'
														: 'bg-gradient-to-r from-[#ffc93c] via-[#ffc93c] via-70% to-[#997924]'
												} mb-2 h-[77px] w-[90%] rounded-full`}
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
																	{/* Передаем только список пользователей, а не ChatroomUsers */}
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
														chatroom.messages
															.length > 0 ? (
															<>
																<Text className='text-[#000000]'>
																	{
																		chatroom
																			.messages[0]
																			.content
																	}
																</Text>
																<Text className='w-full overflow-hidden truncate whitespace-nowrap text-[#000000]'>
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
																No Messages
															</Text>
														)}
													</div>
													{chatroom?.ChatroomUsers &&
														chatroom.ChatroomUsers.some(
															(
																chatroomUser: any
															) =>
																chatroomUser
																	.user.id ===
																	userId &&
																chatroomUser.role ===
																	'ADMIN'
														) && (
															<Button
																className='ml-[20px] flex h-[30px] w-[30px] items-center justify-center bg-[#D1A745]'
																onClick={e => {
																	e.preventDefault()
																	deleteChatroom()
																}}
															>
																<IconX />
															</Button>
														)}
												</div>
											</Card>
										)
									)}
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
