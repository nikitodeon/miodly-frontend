'use client'

import { Text } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'

import { Card } from '@/components/ui/common/Card'
import { Separator } from '@/components/ui/common/Separator'

import { ChatroomCard } from './ChatroomCard'

interface ChatroomListProps {
	chatrooms: any[]
	activeRoomId: string | null
	onChatClick: (id: string) => void

	loading: boolean
	error?: Error | null
}

export const ChatroomList = ({
	chatrooms,
	activeRoomId,
	onChatClick,

	loading,
	error
}: ChatroomListProps) => {
	if (error) {
		return <div>Ошибка: {error?.message}</div>
	}

	const sepcontainerRef = useRef<HTMLDivElement>(null)
	const [separatorHeight, setSeparatorHeight] = useState(0)

	const updateSeparatorHeight = () => {
		if (sepcontainerRef.current) {
			const sepcontainerHeight = sepcontainerRef.current.scrollHeight
			setSeparatorHeight(sepcontainerHeight)
		}
	}

	useEffect(() => {
		updateSeparatorHeight()

		const handleResize = () => {
			updateSeparatorHeight()
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	useEffect(() => {
		updateSeparatorHeight()
	}, [chatrooms])

	const isEmpty = !loading && chatrooms.length === 0

	return (
		<div className='flex flex-col'>
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

					{isEmpty ? (
						<Card
							className={`cardo show relative mb-2 h-[77px] w-[90%] overflow-hidden rounded-full bg-gradient-to-r from-[#ffc93c] via-[#ffc93c] via-70% to-[#997924] transition-all duration-300 ease-in-out`}
							style={{
								cursor: 'default',
								transition:
									'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
							}}
						>
							<div className='pm-2 gapm-x-[20px] relative flex h-full flex-row items-center justify-center'>
								<div className='flex flex-col items-center justify-center gap-2'>
									<Text
										size='md'
										className='font-semibold text-[#000000]'
									>
										У вас пока нет активных чатов
									</Text>
								</div>
							</div>
						</Card>
					) : (
						chatrooms?.map((chatroom, index) => (
							<ChatroomCard
								key={chatroom.id}
								chatroom={chatroom}
								isActive={activeRoomId === chatroom.id}
								onClick={onChatClick}
								index={index}
							/>
						))
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
	)
}
