import { Avatar, Flex, Image, Paper } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import React, { useEffect, useRef, useState } from 'react'

import { Message } from '@/graphql/generated/output'

import { getMediaSource } from '@/utils/get-media-source'

interface MessageProps {
	message: Message
	currentUserId: string
}

const MessageBubble: React.FC<MessageProps> = ({ message, currentUserId }) => {
	if (!message?.user?.id) return null
	const isSentByCurrentUser = message.user.id === currentUserId
	const isMobile = useMediaQuery('(max-width: 768px)')
	const isLongMessage =
		typeof message.content === 'string' && message.content.length >= 16
	const messageRef = useRef<HTMLDivElement | null>(null)
	const [messageWidth, setMessageWidth] = useState<number>(0)
	useEffect(() => {
		if (messageRef.current) {
			setMessageWidth(messageRef.current.offsetWidth)
		}
	}, [message.content])
	const threshold = isMobile ? 130 : 150

	const showWings = messageWidth > threshold
	const getAvatar = (user: any) => {
		const avatarSrc = user.avatar
			? getMediaSource(user.avatar)
			: user.username?.[0]?.toUpperCase() || 'U' // Если нет аватарки, то берем первую букву имени

		// Проверяем тип события, чтобы избежать ошибки с target
		if (typeof avatarSrc === 'string' && avatarSrc.length === 1) {
			return (
				<div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#3a4050] text-white'>
					{avatarSrc}
				</div>
			)
		} else {
			return (
				<div className='h-10 w-10 overflow-hidden rounded-full'>
					<Image
						width={40}
						height={40}
						src={avatarSrc}
						alt={user.username}
						className='rounded-full'
						onError={(
							e: React.SyntheticEvent<HTMLImageElement, Event>
						) => {
							// Указываем правильный тип для target
							;(e.target as HTMLImageElement).src =
								'/logos/beeavatar.jpg' // Если аватар не загрузится, используем запасной
						}}
					/>
				</div>
			)
		}
	}
	return (
		<Flex
			justify={isSentByCurrentUser ? 'flex-end' : 'flex-start'}
			align={'end'}
			mb={10}
		>
			{!isSentByCurrentUser && (
				<div className={`${isMobile ? 'ml-[-5px]' : ''}`}>
					{getAvatar(message.user)}
				</div>
			)}
			<Flex direction={'column'} justify={'center'} align={'center'}>
				{/* <span>
					{isSentByCurrentUser ? 'Me' : message.user.username}
				</span> */}
				{showWings && (
					<Image
						// mr='md'
						width={isMobile ? 110 : 140}
						height={isMobile ? 90 : 120}
						src={'/logos/realwings.jpg'}
						alt='Preview'
						radius='md'
						// style={{
						// 	marginLeft: isSentByCurrentUser ? 30 : 0,
						// 	marginRight: isSentByCurrentUser ? 0 : 50
						// }}
						className={
							isSentByCurrentUser
								? 'ml-auto scale-x-[-1] transform'
								: 'mr-auto'
						}
					/>
				)}
				<Paper
					ref={messageRef}
					style={{
						marginLeft: isSentByCurrentUser ? 0 : 10,
						marginRight: isSentByCurrentUser ? 10 : 0,
						backgroundColor: isSentByCurrentUser
							? '#ffc93c'
							: // : '#ffd76f',
								'#f3d35d',
						color: isSentByCurrentUser ? '#fff' : 'inherit',
						borderRadius: 10,
						maxWidth: '40ch', // Ограничение по ширине
						wordBreak: 'break-word',
						whiteSpace: 'pre-wrap' // Разрешает перенос строк

						// padding: '10px'
					}}
				>
					<div
						className={` ${isMobile ? 'text-sm' : ''} px-2 text-[#000000]`}
					>
						{message.content}
					</div>
					{message.imageUrl && (
						<Image
							width={'100%'}
							height={'auto'}
							fit='cover'
							src={getMediaSource(message.imageUrl)}
							alt='Uploaded content'
							style={{ maxWidth: '40ch' }}
						/>
					)}
					<p className='px-2 text-sm text-[#000000]'>
						{(() => {
							const messageDate = new Date(message.createdAt)
							const now = new Date()

							// Проверяем, если сообщение было сегодня
							const isToday =
								messageDate.getDate() === now.getDate() &&
								messageDate.getMonth() === now.getMonth() &&
								messageDate.getFullYear() === now.getFullYear()

							// Проверяем, если сообщение было вчера
							const yesterday = new Date()
							yesterday.setDate(now.getDate() - 1)
							const isYesterday =
								messageDate.getDate() === yesterday.getDate() &&
								messageDate.getMonth() ===
									yesterday.getMonth() &&
								messageDate.getFullYear() ===
									yesterday.getFullYear()

							// Проверяем, если сообщение в этом году
							const isThisYear =
								messageDate.getFullYear() === now.getFullYear()

							// Названия месяцев на русском
							const months = [
								'января',
								'февраля',
								'марта',
								'апреля',
								'мая',
								'июня',
								'июля',
								'августа',
								'сентября',
								'октября',
								'ноября',
								'декабря'
							]

							const timeString = messageDate.toLocaleTimeString(
								[],
								{ hour: '2-digit', minute: '2-digit' }
							)

							if (isToday) {
								return timeString // Сегодня: "14:30"
							} else if (isYesterday) {
								return `Вчера, ${timeString}` // Вчера: "Вчера, 14:30"
							} else if (isThisYear) {
								return `${messageDate.getDate()} ${months[messageDate.getMonth()]}` // В этом году: "12 февраля"
							} else {
								return messageDate.toLocaleDateString('ru-RU') // Прошлый год: "12.03.2023"
							}
						})()}
					</p>
				</Paper>
			</Flex>
			{isSentByCurrentUser && (
				<div className={`${isMobile ? 'mr-[-10px]' : ''}`}>
					{getAvatar(message.user)}
				</div>
			)}
		</Flex>
	)
}

export default MessageBubble
