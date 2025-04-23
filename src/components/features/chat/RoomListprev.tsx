'use client'

import { gql, useQuery } from '@apollo/client'
import { Flex, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
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

import { GetChatroomsForUserQuery } from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

import OverlappingAvatars from './OverlappingAvatars'
import { SidebarNavigation } from './SidebarNavigation'

interface JoinRoomOrChatwindowProps {
	onSelectChatMobile: (selected: boolean) => void // Функция возврата
}
function RoomList({ onSelectChatMobile }: JoinRoomOrChatwindowProps) {
	const containerRef = useRef(null)

	const [searchParams, setSearchParams] = useSearchParams()
	const activeRoomId: string | null = searchParams.get('id') || null

	const [isHidden, setIsHidden] = useState(false)
	const sepcontainerRef = useRef(null)
	const [separatorHeight, setSeparatorHeight] = useState(0)

	const [userId, setUserId] = useState<string | null>(null)

	const isMobile = useMediaQuery('(max-width: 768px)')

	const handleChatClick = (chatroomId: string) => {
		onSelectChatMobile(true)
		setSearchParams({ id: chatroomId })

		navigate(`/?id=${chatroomId}`)
	}

	const user: any = useCurrent().user

	useEffect(() => {
		if (user && user.id) {
			setUserId(user.id) // Устанавливаем userId, когда он доступен
		}
	}, [user])

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

	const navigate = useNavigate()

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

			resizeTimeout = setTimeout(() => {
				const cards = document.querySelectorAll('.cardo')
				const activeCard = activeRoomId
					? document.querySelector(`.cardo[key="${activeRoomId}"]`)
					: null

				const observer = new IntersectionObserver(
					entries => {
						const visibleCards = entries
							.filter(entry => entry.isIntersecting)
							.map(entry => entry.target)

						if (visibleCards.length === 0) return

						cards.forEach(card => {
							// Сбрасываем все классы размера, кроме активной карточки
							if (!activeCard || card !== activeCard) {
								card.classList.remove(
									'basic',
									'small',
									'semismall'
								)
							}
						})

						// Применяем стили улья ко всем карточкам, включая активную
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

						// Для карточек в середине добавляем basic класс
						visibleCards.forEach(card => {
							if (
								!card.classList.contains('small') &&
								!card.classList.contains('semismall')
							) {
								card.classList.add('basic')
							}
						})

						// Принудительно обновляем стили активной карточки
						if (
							activeCard &&
							activeCard.classList.contains('active')
						) {
							if (visibleCards[0] === activeCard) {
								activeCard.classList.add('small')
							} else if (visibleCards[1] === activeCard) {
								activeCard.classList.add('semismall')
							} else if (
								visibleCards[visibleCards.length - 1] ===
								activeCard
							) {
								activeCard.classList.add('small')
							} else if (
								visibleCards[visibleCards.length - 2] ===
								activeCard
							) {
								activeCard.classList.add('semismall')
							} else {
								activeCard.classList.add('basic')
							}
						}
					},
					{
						rootMargin: '70px 0px -70px 0px',
						threshold: 0.6
					}
				)

				cards.forEach(card => observer.observe(card))
			}, 300)
		}

		handleResize()
		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
			if (resizeTimeout) clearTimeout(resizeTimeout)
		}
	}, [data, activeRoomId]) // Добавляем activeRoomId в зависимости
	useEffect(() => {
		const scrollContainer: any = containerRef.current

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

			if (!searchParams.has('id')) {
				const newUrl = `${window.location.pathname}?id=${firstChatId}`
				window.location.replace(newUrl) // Перенаправление без добавления в историю
			}
		}
	}, [loading, data])

	if (error) {
		return <div>Ошибка: {error?.message}</div>
	}

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

	return (
		<div className='w-full'>
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
										<MenuIcon className='h-5 w-5 text-[#ffc93c]' />
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
							<Separator
								className={` ${isMobile ? 'w-[5px]' : 'w-[9px]'} ml-auto h-[30px] bg-[#000000]`}
							/>
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

									{sortedChatrooms?.map((chatroom: any) => (
										<Card
											key={chatroom.id}
											onClick={() =>
												handleChatClick(
													chatroom.id || ''
												)
											}
											className={`cardo show relative ${
												activeRoomId === chatroom.id
													? 'active bg-gradient-to-r from-[rgb(229,172,40)] via-[#e5ac28] via-70% to-[#997924]'
													: 'bg-gradient-to-r from-[#ffc93c] via-[#ffc93c] via-70% to-[#997924]'
											} mb-2 h-[77px] w-[90%] overflow-hidden rounded-full transition-all duration-300 ease-in-out hover:scale-[1.02]`}
											// hover:bg-gradient-to-r hover:from-[#ecac21] hover:via-[#ecac21] hover:via-70% hover:to-[#997924] hover:shadow-lg

											style={{
												cursor: 'pointer',
												transition:
													'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
											}}
										>
											{/* Контейнер карточки */}
											<div className='pm-2 gapm-x-[20px] relative flex flex-row items-center justify-start'>
												{/* Аватары */}
												{chatroom?.ChatroomUsers &&
													chatroom.ChatroomUsers
														.length > 0 && (
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
													)}

												{/* Информация о чате */}
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
														<Text className='overflow-hidden truncate whitespace-nowrap text-[#000000]'>
															{
																chatroom
																	.messages[0]
																	.content
															}
														</Text>
													) : (
														<Text
															italic
															className='text-[#000000]'
														>
															Нет сообщений
														</Text>
													)}
												</div>

												{/* Дата последнего сообщения (в правом верхнем углу) */}
												{chatroom.messages &&
													chatroom.messages.length >
														0 && (
														<div className='absolute right-3 top-2 text-xs text-gray-700'>
															{(() => {
																const messageDate =
																	new Date(
																		chatroom.messages[0].createdAt
																	)
																const now =
																	new Date()

																const isToday =
																	messageDate.getDate() ===
																		now.getDate() &&
																	messageDate.getMonth() ===
																		now.getMonth() &&
																	messageDate.getFullYear() ===
																		now.getFullYear()

																const yesterday =
																	new Date()
																yesterday.setDate(
																	now.getDate() -
																		1
																)
																const isYesterday =
																	messageDate.getDate() ===
																		yesterday.getDate() &&
																	messageDate.getMonth() ===
																		yesterday.getMonth() &&
																	messageDate.getFullYear() ===
																		yesterday.getFullYear()

																const isThisYear =
																	messageDate.getFullYear() ===
																	now.getFullYear()

																const months = [
																	'янв',
																	'фев',
																	'мар',
																	'апр',
																	'май',
																	'июн',
																	'июл',
																	'авг',
																	'сен',
																	'окт',
																	'ноя',
																	'дек'
																]

																const timeString =
																	messageDate.toLocaleTimeString(
																		[],
																		{
																			hour: '2-digit',
																			minute: '2-digit'
																		}
																	)

																if (isToday) {
																	return timeString // Сегодня: "14:30"
																} else if (
																	isYesterday
																) {
																	return `Вчера, ${timeString}` // Вчера: "Вчера, 14:30"
																} else if (
																	isThisYear
																) {
																	return `${messageDate.getDate()} ${months[messageDate.getMonth()]}` // "12 фев"
																} else {
																	return messageDate.toLocaleDateString(
																		'ru-RU'
																	) // "12.03.2023"
																}
															})()}
														</div>
													)}
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
