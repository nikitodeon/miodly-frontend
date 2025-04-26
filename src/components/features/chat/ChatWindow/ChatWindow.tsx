'use client'

import { gql, useQuery } from '@apollo/client'
import { Flex } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { Card } from '@/components/ui/common/Card'

import { Chatroom } from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

import { useGeneralStore } from '@/store/generalStore'

import ChatHeader from './ChatHeader'
import ChatInput from './ChatInput'
import ChatMessages from './ChatMessages'
import JoinChatPrompt from './JoinChatPrompt'
import TypingIndicator from './TypingIndicator'
import { useChatroomMutations } from './mutations'
import { useChatroomMessages } from './queries'
import { useChatroomSubscriptions } from './subscriptions'

interface JoinRoomOrChatwindowProps {
	onBackMobile: (selected: boolean) => void
}

function Chatwindow({ onBackMobile }: JoinRoomOrChatwindowProps) {
	const isMobile = useMediaQuery('(max-width: 768px)')
	const user = useCurrent().user
	const [searchParams] = useSearchParams()
	const activeRoomId = searchParams.get('id') || null
	const toggleCreateRoomModal = useGeneralStore(
		state => state.toggleCreateRoomModal
	)
	const scrollAreaRef = useRef<HTMLDivElement>(null)

	const [messagesByChatroom, setMessagesByChatroom] = useState<Map<any, any>>(
		new Map()
	)

	const {
		messages,
		loading,
		dataUsersOfChatroom,
		liveUsers,
		isUserPartOfChatroom,
		handleUpdateChatroomsDataToFalse,
		chatroomMessagesData,
		chatroomData
	} = useChatroomMessages(
		activeRoomId,
		user?.id,
		messagesByChatroom,
		setMessagesByChatroom
	)

	const { typingUsers, liveUsers: subscriptionLiveUsers } =
		useChatroomSubscriptions(activeRoomId, user?.id, setMessagesByChatroom)

	const {
		messageContent,
		setMessageContent,
		selectedFile,
		previewUrl,
		handleInputChange,
		handleUserStartedTyping,
		handleSendMessage,
		getRootProps,
		getInputProps,
		handleEnter,
		handleLeave
	} = useChatroomMutations(activeRoomId, user?.id, scrollAreaRef)

	useEffect(() => {
		if (!activeRoomId) return

		handleEnter()

		// Обработка liveUsers
		if (subscriptionLiveUsers) {
			// No need to set liveUsers here as they're already managed in the subscription hook
		}

		// Проверка участия в чате is already handled in useChatroomMessages

		// Очистка при размонтировании
		return () => {
			handleLeave()
		}
	}, [activeRoomId])

	// Обработчик перед закрытием страницы
	useEffect(() => {
		const handleBeforeUnload = () => {
			handleLeave()
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [handleLeave])
	if (!isUserPartOfChatroom) {
		return (
			<JoinChatPrompt
				isMobile={isMobile ?? false}
				onBackMobile={onBackMobile}
				toggleCreateRoomModal={toggleCreateRoomModal}
			/>
		)
	}

	return (
		<div className='mmax-w-[1300px] h-screen w-full min-w-[336px]'>
			<div className='h-full'>
				<Card className='h-full w-full rounded-none bg-[#000000]'>
					<div className='flex h-full w-full flex-col'>
						<ChatHeader
							isMobile={isMobile ?? false}
							onBackMobile={onBackMobile}
							dataUsersOfChatroom={dataUsersOfChatroom || {}}
							liveUsers={subscriptionLiveUsers}
							activeRoom={chatroomData}
							userId={user?.id}
							onUpdateChatroomsDataToFalse={
								handleUpdateChatroomsDataToFalse
							}
						/>

						<ChatMessages
							messages={messages}
							loading={loading}
							userId={user?.id}
							scrollAreaRef={scrollAreaRef}
						/>

						<TypingIndicator typingUsers={typingUsers} />

						<ChatInput
							messageContent={messageContent}
							selectedFile={selectedFile}
							previewUrl={previewUrl}
							handleInputChange={handleInputChange}
							handleUserStartedTyping={handleUserStartedTyping}
							handleSendMessage={handleSendMessage}
							getRootProps={getRootProps}
							getInputProps={getInputProps}
							setMessageContent={setMessageContent}
						/>
					</div>
				</Card>
			</div>
		</div>
	)
}

export default Chatwindow
