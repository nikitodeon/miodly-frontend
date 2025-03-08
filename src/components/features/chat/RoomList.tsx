'use client'

import { gql, useMutation, useQuery } from '@apollo/client'
import { Divider, Flex, Group, Loader, ScrollArea, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconPlus, IconX } from '@tabler/icons-react'
import { entries, get } from 'lodash'
import { usePathname, useRouter } from 'next/navigation'
// import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
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
	const { data, loading, error } = useQuery<GetChatroomsForUserQuery>(
		gql`
			query getChatroomsForUser($userId: String!) {
				getChatroomsForUser(userId: $userId) {
					id
					name
					users {
						id
						username
						avatar
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
	const [chatroomId, setChatroomId] = useState<number | null>(null)
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
		setIsUserPartOfChatroom(() =>
			dataUsersOfChatroom?.getUsersOfChatroom.some(
				user => user.id === userId
			)
		)
	}, [dataUsersOfChatroom?.getUsersOfChatroom, userId])

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
				rootMargin: '120px 0px -120px 0px', // Смещение области наблюдения
				threshold: 0.2 // Карточка считается видимой, если видно 50% её высоты
			}
		)

		// Подключаем observer ко всем карточкам
		cards.forEach(card => observer.observe(card))

		// Очистка наблюдателя при размонтировании компонента
		return () => observer.disconnect()
	}, [data])
	useEffect(() => {
		const cards = document.querySelectorAll('.cardo') // Находим все карточки

		const observer = new IntersectionObserver(
			entries => {
				// Находим только видимые карточки
				const visibleCards = entries
					.filter(entry => entry.isIntersecting)
					.map(entry => entry.target)

				if (visibleCards.length === 0) return // Если нет видимых, выходим

				// Убираем все кастомные классы
				cards.forEach(card => {
					card.classList.remove('basic', 'small', 'semismall')
				})

				if (visibleCards.length >= 1) {
					visibleCards[0].classList.add('small') // Самая верхняя
				}
				if (visibleCards.length >= 2) {
					visibleCards[1].classList.add('semismall') // Вторая сверху
				}

				// Нижние 2 карточки тоже увеличиваем
				if (visibleCards.length >= 3) {
					visibleCards[visibleCards.length - 2].classList.add(
						'semismall'
					) // Предпоследняя
				}
				if (visibleCards.length >= 2) {
					visibleCards[visibleCards.length - 1].classList.add('small') // Последняя
				}

				visibleCards.forEach(card => {
					if (!card.classList.contains('small')) {
						card.classList.add('basic')
					}
					if (!card.classList.contains('semismal')) {
						card.classList.add('basic')
					}
				})
			},
			{
				rootMargin: '100px 0px -100px 0px', // Смещение наблюдения
				threshold: 0.6 // Карточка считается видимой, если видно 60% её высоты
			}
		)

		// Подключаем observer ко всем карточкам
		cards.forEach(card => observer.observe(card))

		return () => observer.disconnect() // Очистка при размонтировании
	}, [data])

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
	}, [])
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

	// useEffect(() => {
	// 	if (id) {
	// 		setChatroomId(parseInt(id))
	// 	} else if (notypedata?.getChatroomsForUser?.length > 0) {
	// 		const firstChatId = notypedata.getChatroomsForUser[0].id
	// 		setChatroomId(firstChatId)

	// 		// Обновляем URL и перезагружаем страницу
	// 		const queryParams = new URLSearchParams(window.location.search)
	// 		queryParams.set('id', firstChatId)
	// 		window.location.href = `?${queryParams.toString()}` // Перезагрузка
	// 	}
	// }, [id, notypedata])

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

	useEffect(() => {
		if (user && user.id) {
			setUserId(user.id) // Устанавливаем userId, когда он доступен
		}
	}, [user])

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
		'pppppppppppppuuuuuuuuuuuuuuuu'
	)

	return (
		<div className='wmfull'>
			{/*/////////////////////////
			<div>
				{data?.getChatroomsForUser?.map(
					(chatroom: any, index: number) => (
						<Card
							key={chatroom.id}
							onClick={() => handleChatClick(chatroom.id || '')}
							className={`cardo show ${activeRoomId === chatroom.id ? 'bg-[#D1A745]' : 'bg-gradient-to-r from-[#ffc93c] via-[#ffc93c] via-70% to-[#997924]'} mb-2 h-[77px] w-[90%] rounded-full`}
							style={{
								cursor: 'pointer',
								transition: 'background-color 0.3s'
							}}
						>
							<Flex
								justify='space-around'
								className='ml-auto flex flex-row gap-x-[100px]'
							>
								{chatroom.users && (
									<Flex
										align='center'
										className='ml-[10px] mr-[35%] mt-[30px]'
									>
							
										<OverlappingAvatars
											users={chatroom.users}
										/>
										
									</Flex>
								)}
							</Flex>
						</Card>
					)
				)}
			</div> */}
			{/* //////////////////////////// */}
			{/* <Flex direction={'row'} h={'100vhmm'} ml={'100pxmm'}> */}
			<div
			//  className='flex flex-col gap-y-[40px]'
			>
				<Card
					// shadow='md'
					// p={0}\
					className='maxm-w-[1478px] hm-[1000px] hm-full w-full min-w-[336px] max-w-[100%] rounded-none'
					style={{ backgroundColor: '#111111' }}
				>
					{/* <Flex direction='column' align='start'> */}
					<div className='mt-2 flex w-full flex-row items-center justify-between'>
						<Button
							onClick={toggleCreateRoomModal}
							// variant='light'
							// leftIcon={<IconPlus />}
						>
							Create a room
						</Button>
						<div className='flex-1'></div>
						<div className='mr-4 flex items-center gap-4'>
							<HeaderMenu />
						</div>
						<Separator
							className={`hatt ${isHidden ? 'unvisible' : ''} hatt mb-[-20px] ml-auto mt-auto h-[60px] w-[29px] rounded-t-full bg-[#d7c279]`}
						/>
						<Separator className='ml-auto h-[30px] w-[9px] bg-[#111111]' />
					</div>
					<div
						className='mmmmh-[100vhmmmm] hm-[927px] hm-full mt-[15px] overflow-y-auto overflow-x-hidden'
						ref={containerRef}
					>
						{/* <ScrollArea
					ref={containerRef}
					// h={'83vh'}
					h={'100%'}
					// w={isMediumDevice ? 'calc(100vw - 100px)' : '550px'}
				> */}
						{/* <Flex direction={'column'}> */}
						<div className='flex flex-col'>
							<Flex
								justify='center'
								align='center'
								// h='100%'
								// mih={'75px'}
							>
								{loading && (
									<Flex align='center'>
										<Loader
										// mr={'md'}
										/>
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
									className='mtm-[30px] flex w-[95%] flex-col items-center'
									ref={sepcontainerRef}
								>
									<div className='flex flex-row justify-around'>
										<Separator className='z-10 ml-[30px] h-[43px] w-[20px] rounded-l-[18px] bg-[#111111]' />
										<Separator className='ml-[-30px] h-[43px] w-[30px] bg-[#905e26]' />
										<Separator className='ml-[-35px] h-[43px] w-[10px] bg-[#905e26]' />
									</div>
									{data?.getChatroomsForUser.map(
										(chatroom: any, index: number) => (
											<Card
												key={chatroom.id}
												onClick={() =>
													handleChatClick(
														chatroom.id || ''
													)
												}
												className={`cardo show ${activeRoomId === chatroom.id ? 'bg-[#D1A745]' : 'bg-gradient-to-r from-[#ffc93c] via-[#ffc93c] via-70% to-[#997924]'} mb-2 h-[77px] w-[90%] rounded-full`}
												//
												style={{
													cursor: 'pointer',
													transition:
														'background-color 0.3s'
												}}
											>
												<Flex
													justify={'space-aroundmmm'}
													className='mlmm-auto gapm-x-[100px] flex flex-row'
												>
													{chatroom.users && (
														<Flex
															align={''}
															className='mmr-[35%] ml-[10px] mt-[30px]'
														>
															{dataUsersOfChatroom?.getUsersOfChatroom && (
																<OverlappingAvatars
																	users={
																		chatroom.users
																		// dataUsersOfChatroom.getUsersOfChatroom
																	}
																/>
															)}
														</Flex>
													)}
													<div className='flex flex-row items-center justify-between'>
														<div className='flex flex-grow flex-col'>
															<Text
																size='lg'
																className='text-[#111111]'
															>
																{chatroom.name}
															</Text>
															{chatroom.messages &&
															chatroom.messages
																.length > 0 ? (
																<>
																	<Text className='text-[#111111]'>
																		{
																			chatroom
																				.messages[0]
																				.content
																		}
																	</Text>
																	<Text className='text-[#111111]'>
																		{new Date(
																			chatroom.messages[0].createdAt
																		).toLocaleString()}
																	</Text>
																</>
															) : (
																<Text
																	italic
																	className='text-[#111111]'
																>
																	No Messages
																</Text>
															)}
														</div>

														{chatroom?.users &&
															chatroom.users[0]
																.id ===
																userId && (
																<Button
																	className='ml-[120px] flex h-[30px] w-[30px] items-center justify-center bg-[#D1A745]'
																	onClick={e => {
																		e.preventDefault()
																		deleteChatroom()
																	}}
																>
																	<IconX />
																</Button>
															)}
													</div>
												</Flex>
											</Card>
										)
									)}
								</div>
								{/* <div className='h-full'> */}
								<div
									className='relative ml-auto h-full flex-shrink-0'
									style={{ minHeight: '100%' }}
								>
									<Separator
										className='mmr-[30px] hь-full hь-[1569px] w-[30px] bg-gradient-to-t from-[#905e26] via-[#905e26] via-50% to-[#dbc77d]'
										style={{
											height: `${separatorHeight}px` // Устанавливаем динамичесsую высоту
										}}
									/>
								</div>
								{/* </div> */}
							</div>
						</div>
						{/* </Flex> */}
						{/* </ScrollArea>
						 */}
					</div>
					{/* </Flex> */}
				</Card>
				{/* <div className='h-[95px] bg-slate-400'>kkk</div> */}
				{/* </Flex> */}
			</div>
		</div>
	)
}

export default RoomList
