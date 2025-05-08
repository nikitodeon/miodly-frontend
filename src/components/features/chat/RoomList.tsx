'use client'

import { gql, useQuery } from '@apollo/client'
import { useMediaQuery } from '@mantine/hooks'
import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'

import { HeaderMenu } from '@/components/layout/header/HeaderMenu'
import { Button } from '@/components/ui/common/Button'
import { Card } from '@/components/ui/common/Card'
import { Separator } from '@/components/ui/common/Separator'
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/common/Sheet'

import { GetChatroomsForUserQuery } from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

import { NightLightToggle } from '../night-light/night-light-toggle'

import { ChatroomList } from './ChatroomList'
import { SidebarNavigation } from './SidebarNavigation'
import { useRoomListSubscriptions } from './useRoomlistSubscriptions'

interface JoinRoomOrChatwindowProps {
	onSelectChatMobile: (selected: boolean) => void // Функция возврата
}

function RoomList({ onSelectChatMobile }: JoinRoomOrChatwindowProps) {
	const containerRef = useRef(null)
	const [searchParams, setSearchParams] = useSearchParams()
	const activeRoomId: string | null = searchParams.get('id') || null
	const [isHidden, setIsHidden] = useState(false)

	const [userId, setUserId] = useState<string | null>(null)

	const isMobile = useMediaQuery('(max-width: 768px)')
	const navigate = useNavigate()
	const user: any = useCurrent().user
	////////////////////////////
	const {
		subscriptionData,
		error: subscriptionError,
		subscriptionLoading
	} = useRoomListSubscriptions(user?.id)
	//////////////////////////
	const handleChatClick = (chatroomId: string) => {
		onSelectChatMobile(true)
		setSearchParams({ id: chatroomId })
		navigate(`/?id=${chatroomId}`)
	}
	const [showNightLight, setShowNightLight] = useState(true)
	const headerContainerRef = useRef<HTMLDivElement>(null)
	const updateNightLightVisibility = useDebouncedCallback(() => {
		if (!headerContainerRef.current) return

		const containerWidth = headerContainerRef.current.offsetWidth
		const shouldShow = containerWidth > 500

		setShowNightLight(shouldShow)
	}, 100)

	// useEffect(() => {
	// 	if (subscriptionError) {
	// 		console.error('[RoomList] Subscription error details:', {
	// 			name: subscriptionError.name,
	// 			message: subscriptionError.message,
	// 			graphQLErrors: subscriptionError.graphQLErrors,
	// 			networkError: subscriptionError.networkError,
	// 			stack: subscriptionError.stack
	// 		})
	// 	}
	// }, [subscriptionError])

	// useEffect(() => {
	// 	console.log('[RoomList] Subscription data update:', {
	// 		subscriptionData,
	// 		subscriptionLoading
	// 	})
	// }, [subscriptionData, subscriptionLoading])
	useEffect(() => {
		if (!headerContainerRef.current) return

		const observer = new ResizeObserver(updateNightLightVisibility)
		observer.observe(headerContainerRef.current)
		updateNightLightVisibility()

		return () => observer.disconnect()
	}, [updateNightLightVisibility])

	useEffect(() => {
		if (user && user.id) {
			setUserId(user.id)
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
			}
		)
	useEffect(() => {
		if (subscriptionData?.newMessageForAllChats) {
			const newMessage = subscriptionData.newMessageForAllChats
			if (newMessage.chatroom?.id !== activeRoomId) {
				// Находим чат, в который пришло сообщение
				const chatroom = data?.getChatroomsForUser?.find(
					chat => chat.id === newMessage.chatroom?.id
				)

				// Находим отправителя (если это не текущий пользователь)
				if (newMessage.user?.id !== user?.id) {
					// Получаем имя отправителя из данных чата или из самого сообщения
					const sender =
						chatroom?.ChatroomUsers?.find(
							cu => cu.user.id === newMessage.user?.id
						)?.user?.username || newMessage.user?.username

					toast.success(`Новое сообщение от ${sender}`, {
						position: 'top-right',
						duration: 4000,
						style: {
							background:
								'linear-gradient(to right, #905e26, #905e26 50%, #dbc77d)',
							color: 'black',
							fontWeight: '600',
							border: '1px solid #dbc77d',
							boxShadow:
								'0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
						}
					})
				}
			}
		}
	}, [
		subscriptionData
		// , user?.id, data?.getChatroomsForUser
	])
	useEffect(() => {
		const cards = document.querySelectorAll('.cardo')

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
				rootMargin: '100px 0px -100px 0px',
				threshold: 0.01
			}
		)

		cards.forEach(card => observer.observe(card))
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
							if (!activeCard || card !== activeCard) {
								card.classList.remove(
									'basic',
									'small',
									'semismall'
								)
							}
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
								card.classList.add('basic')
							}
						})

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
	}, [data, activeRoomId])

	useEffect(() => {
		const scrollContainer: any = containerRef.current
		if (!scrollContainer) return

		const handleScroll = () => {
			setIsHidden(scrollContainer.scrollTop > 0)
		}

		scrollContainer.addEventListener('scroll', handleScroll)
		return () => {
			scrollContainer.removeEventListener('scroll', handleScroll)
		}
	}, [data])

	useEffect(() => {
		const notypedata: any = data
		if (!loading && notypedata?.getChatroomsForUser.length > 0) {
			const firstChatId = notypedata.getChatroomsForUser[0].id
			if (!searchParams.has('id')) {
				const newUrl = `${window.location.pathname}?id=${firstChatId}`
				window.location.replace(newUrl)
			}
		}
	}, [loading, data])

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
					ref={headerContainerRef}
				>
					<div className='relative mt-2 flex w-full items-center'>
						<div className='flex flex-1 items-center'>
							<Sheet>
								<SheetTrigger asChild>
									<Button
										className='ml-4 shrink-0 bg-black text-white hover:text-gray-400'
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

						<div className='absolute left-1/2 mt-1 -translate-x-1/2'>
							<Image
								width={165}
								height={0}
								src={'/logos/longlogoblgl.png'}
								alt='Preview'
							/>
						</div>

						<div className='mr-4 flex flex-1 justify-end'>
							<HeaderMenu />
						</div>

						{showNightLight && (
							<span className='mr-4'>
								<NightLightToggle />
							</span>
						)}

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
						<ChatroomList
							chatrooms={sortedChatrooms}
							activeRoomId={activeRoomId}
							onChatClick={handleChatClick}
							loading={loading}
							error={error}
						/>
					</div>
				</Card>
			</div>
		</div>
	)
}

export default RoomList
