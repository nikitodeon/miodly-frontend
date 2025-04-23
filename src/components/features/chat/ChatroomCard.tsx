'use client'

import { Text } from '@mantine/core'

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
	onClick
}: ChatroomCardProps) => {
	const lastMessage = chatroom.messages?.[0]
	const hasMessages = lastMessage && chatroom.messages.length > 0

	return (
		<Card
			key={chatroom.id}
			onClick={() => onClick(chatroom.id || '')}
			className={`cardo show relative ${
				isActive
					? 'active bg-gradient-to-r from-[rgb(229,172,40)] via-[#e5ac28] via-70% to-[#997924]'
					: 'bg-gradient-to-r from-[#ffc93c] via-[#ffc93c] via-70% to-[#997924]'
			} mb-2 h-[77px] w-[90%] overflow-hidden rounded-full transition-all duration-300 ease-in-out hover:scale-[1.02]`}
			// hover:bg-gradient-to-r hover:from-[#ecac21] hover:via-[#ecac21] hover:via-70% hover:to-[#997924] hover:shadow-lg
			style={{
				cursor: 'pointer',
				transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
			}}
		>
			{/* Контейнер карточки */}
			<div className='pm-2 gapm-x-[20px] relative flex flex-row items-center justify-start'>
				{/* Аватары */}
				{chatroom?.ChatroomUsers?.length > 0 && (
					<div className='mrn-[20px] ml-[10px] mt-[10px] flex'>
						<OverlappingAvatars
							users={chatroom.ChatroomUsers.map(
								chatroomUser => chatroomUser.user
							)}
						/>
					</div>
				)}

				{/* Информация о чате */}
				<div className='flex h-full flex-grow flex-col'>
					<Text size='md' className='font-semibold text-[#000000]'>
						{chatroom.name}
					</Text>

					{hasMessages ? (
						<Text className='overflow-hidden truncate whitespace-nowrap text-[#000000]'>
							{lastMessage.content}
						</Text>
					) : (
						<Text italic className='text-[#000000]'>
							Нет сообщений
						</Text>
					)}
				</div>

				{hasMessages && (
					<div className='absolute right-3 top-2 text-xs text-gray-700'>
						{formatMessageDate(lastMessage.createdAt)}
					</div>
				)}
			</div>
		</Card>
	)
}
