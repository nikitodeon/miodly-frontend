'use client'

import { Text } from '@mantine/core'
import Image from 'next/image'

import { Card } from '@/components/ui/common/Card'

import OverlappingAvatars from './OverlappingAvatars'

interface User {
	id: string
	username: string
	email: string
	avatar: string
}

interface Message {
	content: string
	createdAt: string
}

interface ChatroomUser {
	user: User
}

interface Chatroom {
	id: string
	name: string
	ChatroomUsers: ChatroomUser[]
	messages: Message[]
}

interface ChatroomCardProps {
	chatroom: Chatroom
	isActive: boolean
	onClick: (id: string) => void
	index: number
}

const formatMessageDate = (dateString: string) => {
	const messageDate = new Date(dateString)
	const now = new Date()

	const isToday =
		messageDate.getDate() === now.getDate() &&
		messageDate.getMonth() === now.getMonth() &&
		messageDate.getFullYear() === now.getFullYear()

	const yesterday = new Date()
	yesterday.setDate(now.getDate() - 1)
	const isYesterday =
		messageDate.getDate() === yesterday.getDate() &&
		messageDate.getMonth() === yesterday.getMonth() &&
		messageDate.getFullYear() === yesterday.getFullYear()

	const isThisYear = messageDate.getFullYear() === now.getFullYear()

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

	const timeString = messageDate.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit'
	})

	if (isToday) {
		return timeString
	} else if (isYesterday) {
		return `Вчера, ${timeString}`
	} else if (isThisYear) {
		return `${messageDate.getDate()} ${months[messageDate.getMonth()]}`
	} else {
		return messageDate.toLocaleDateString('ru-RU')
	}
}

export const ChatroomCard = ({
	chatroom,
	isActive,
	onClick,
	index
}: ChatroomCardProps) => {
	const lastMessage = chatroom.messages?.[0]
	const hasMessages = lastMessage && chatroom.messages.length > 0
	const beePosition = index % 3
	return (
		<Card
			key={chatroom.id}
			onClick={() => onClick(chatroom.id || '')}
			className={`cardo show relative ${
				isActive
					? 'active bg-gradient-to-r from-[rgb(229,172,40)] via-[#e5ac28] via-70% to-[#997924]'
					: 'bg-gradient-to-r from-[#ffc93c] via-[#ffc93c] via-70% to-[#997924]'
			} mb-2 h-[77px] w-[95%] overflow-hidden rounded-full transition-all duration-300 ease-in-out hover:scale-[1.02] sm:w-[90%]`}
			style={{
				cursor: 'pointer',
				transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
			}}
		>
			{/* <Image
				width={50}
				height={50}
				src='/logos/flyingbeeright.png'
				alt='Кот'
				className='absolute top-3 h-8 w-8 rounded-full'
			/> */}
			<Image
				width={beePosition !== 0 && beePosition !== 1 ? 50 : 20}
				height={beePosition !== 0 && beePosition !== 1 ? 50 : 20}
				src={
					beePosition !== 0 && beePosition !== 1
						? '/logos/flyingbeerightsimple.png'
						: '/logos/flyingbeeright.png'
				}
				alt='Пчела'
				className={`absolute h-8 w-8 rounded-full ${
					beePosition === 0
						? 'left-3 top-1 h-8 w-8'
						: beePosition === 1
							? 'right-16 top-[-4] h-8 w-8 rotate-180 transform'
							: '-translate-x-1.2 left-[50%] top-[-3] rotate-[-90deg] scale-[0.6] transform'
				}`}
			/>
			<div className='relative flex flex-row items-center justify-start p-2'>
				{chatroom?.ChatroomUsers?.length > 0 && (
					<div className='ml-2 mr-5 flex md:mr-3'>
						<OverlappingAvatars
							users={chatroom.ChatroomUsers.map(
								chatroomUser => chatroomUser.user
							)}
						/>
					</div>
				)}

				<div className='flex h-full flex-grow flex-col overflow-hidden pr-0'>
					<Text
						size='sm'
						className='truncate text-sm font-semibold text-[#000000] sm:text-base'
					>
						{chatroom.name}
					</Text>

					{hasMessages ? (
						<Text className='overflow-hidden truncate whitespace-nowrap text-xs text-[#000000] sm:text-sm'>
							{lastMessage.content}
						</Text>
					) : (
						<Text className='text-xs italic text-[#000000] sm:text-sm'>
							Нет сообщений
						</Text>
					)}
				</div>

				{hasMessages && (
					<div className='absolute right-3 top-2 pr-2 text-[10px] text-gray-700 sm:text-xs'>
						{formatMessageDate(lastMessage.createdAt)}
					</div>
				)}
			</div>
		</Card>
	)
}
