import { Avatar, Flex, Image, Paper } from '@mantine/core'
import React from 'react'

import { Message } from '@/graphql/generated/output'

import { getMediaSource } from '@/utils/get-media-source'

interface MessageProps {
	message: Message
	currentUserId: string
}

const MessageBubble: React.FC<MessageProps> = ({ message, currentUserId }) => {
	if (!message?.user?.id) return null
	const isSentByCurrentUser = message.user.id === currentUserId

	return (
		<Flex
			justify={isSentByCurrentUser ? 'flex-end' : 'flex-start'}
			align={'end'}
			mb={10}
		>
			{!isSentByCurrentUser && (
				<Avatar
					radius={'xl'}
					src={getMediaSource(message.user.avatar)}
					alt={message.user.username}
				/>
			)}
			<Flex direction={'column'} justify={'center'} align={'center'}>
				{/* <span>
					{isSentByCurrentUser ? 'Me' : message.user.username}
				</span> */}
				<Image
					// mr='md'
					width={120}
					height={120}
					src={'/logos/wings.png'}
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
				<Paper
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
					<div className='px-2 text-[#000000]'>{message.content}</div>
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
						{new Date(message.createdAt).toLocaleString()}
					</p>
				</Paper>
			</Flex>
			{isSentByCurrentUser && (
				<Avatar
					mr={'md'}
					radius={'xl'}
					src={
						getMediaSource(message.user.avatar) ||
						'/logos/beeavatar.png'
					}
					alt={message.user.username}
				/>
			)}
		</Flex>
	)
}

export default MessageBubble
