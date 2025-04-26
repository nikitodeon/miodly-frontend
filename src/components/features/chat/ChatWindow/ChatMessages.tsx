import { Text } from '@mantine/core'
import React, { useEffect } from 'react'

import MessageBubble from '../MessageBubble'

import { ChatMessagesProps } from './types'

const ChatMessages: React.FC<ChatMessagesProps> = ({
	messages,
	loading,
	userId,
	scrollAreaRef
}) => {
	useEffect(() => {
		if (scrollAreaRef.current) {
			scrollAreaRef.current.scrollTo({
				top: scrollAreaRef.current.scrollHeight,
				behavior: 'smooth'
			})
		}
	}, [messages, scrollAreaRef])

	return (
		<div className='flex-1 overflow-auto p-4' ref={scrollAreaRef}>
			{loading ? (
				<Text c='dimmed' className='italic'>
					{/* Loading... */}
				</Text>
			) : (
				messages.map((message: any) => (
					<MessageBubble
						key={message.id}
						message={message}
						currentUserId={userId ?? ''}
					/>
				))
			)}
		</div>
	)
}

export default ChatMessages
