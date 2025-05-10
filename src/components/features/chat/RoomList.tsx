'use client'

import { gql, useQuery } from '@apollo/client'
import { useMediaQuery } from '@mantine/hooks'
import { debounce } from 'lodash'
import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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

interface JoinRoomOrChatwindowProps {
	onSelectChatMobile: (selected: boolean) => void // Функция возврата
}

function RoomList({ onSelectChatMobile }: JoinRoomOrChatwindowProps) {
	const containerRef: any = useRef(null)
	const [searchParams, setSearchParams] = useSearchParams()
	const activeRoomId: string | null = searchParams.get('id') || null
	const [isHidden, setIsHidden] = useState(false)

	const [userId, setUserId] = useState<string | null>(null)

	const isMobile = useMediaQuery('(max-width: 768px)')
	const navigate = useNavigate()
	const user: any = useCurrent().user

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
			},
			fetchPolicy: 'network-only'
		}
	)

	useEffect(() => {
		const cards = document.querySelectorAll('.cardo')
		if (!cards.length) return
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
				rootMargin: '-150px 0px -100px 0px',
				threshold: 0.01
			}
		)

		cards.forEach(card => observer.observe(card))
		return () => observer.disconnect()
	}, [data])

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		// Используем any для обхода типизации
		const cards: any = Array.from(container.querySelectorAll('.cardo'))
		if (!cards.length) return

		// Функции с any для параметров
		const calculatePosition = (card: any) => {
			const cardRect = card.getBoundingClientRect()
			const containerRect = container.getBoundingClientRect()
			const relativeTop = cardRect.top - containerRect.top
			return relativeTop / containerRect.height
		}

		const applyStyles = (card: any, position: number) => {
			card.classList.remove('basic', 'small', 'semismall')

			if (position < 0.1 || position > 0.7) {
				card.classList.add('small')
			} else if (position < 0.2 || position > 0.6) {
				card.classList.add('semismall')
			} else {
				card.classList.add('basic')
			}
		}

		// any для debounce функции
		const updateCardStyles: any = debounce(() => {
			const visibleCards = cards.filter((card: any) => {
				const rect = card.getBoundingClientRect()
				return rect.bottom >= 0 && rect.top <= window.innerHeight
			})

			visibleCards.forEach((card: any) => {
				const position = calculatePosition(card)
				requestAnimationFrame(() => applyStyles(card, position))
			})
		}, 16)

		const handleScroll = () => {
			requestAnimationFrame(() => {
				updateCardStyles()
				setIsHidden(container.scrollTop > 0)
			})
		}

		container.addEventListener('scroll', handleScroll)
		window.addEventListener('resize', updateCardStyles)

		updateCardStyles()

		return () => {
			container.removeEventListener('scroll', handleScroll)
			window.removeEventListener('resize', updateCardStyles)
			updateCardStyles.cancel()
		}
	}, [data, activeRoomId])
	useEffect(() => {
		const notypedata: any = data
		if (!loading && notypedata?.getChatroomsForUser.length > 0) {
			const firstChatId = notypedata.getChatroomsForUser[0].id
			if (!searchParams.has('id')) {
				setSearchParams({ id: firstChatId })
				navigate(`/?id=${firstChatId}`, { replace: true })
			}
		}
	}, [loading, data, navigate, searchParams, setSearchParams])

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
					className='w-full min-w-[336px] max-w-[100%] rounded-none'
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
							className={`hatt ${isHidden ? 'unvisible' : ''} mb-[-20px] ml-auto mt-auto h-[60px] w-[25px] rounded-t-full bg-[#d7c279] sm:w-[29px]`}
						/>
						{(data?.getChatroomsForUser?.length ?? 0) > 8 && (
							<Separator
								className={` ${isMobile ? 'w-[8.5px]' : 'w-[9px]'} ml-auto h-[30px] bg-[#000000]`}
							/>
						)}
					</div>

					<div
						className='mt-[19px] overflow-y-auto overflow-x-hidden'
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
