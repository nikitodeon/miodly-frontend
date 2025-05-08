'use client'

import { gql, useQuery } from '@apollo/client'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import AddChatroom from '@/components/features/chat/AddChatroom'
import JoinRoomOrChatwindow from '@/components/features/chat/JoinRoomOrChatwindow'
import RoomList from '@/components/features/chat/RoomList'
import { useRoomListSubscriptions } from '@/components/features/chat/useRoomlistSubscriptions'
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup
} from '@/components/ui/elements/Resizable'

import { GetChatroomsForUserQuery } from '@/graphql/generated/output'

import { useCurrent } from '@/hooks/useCurrent'

import { TypingUsersProvider } from '@/store/typingUsers'

export default function HomePage() {
	const [isChatSelectedMobile, setChatSelectedMobile] =
		useState<boolean>(false)
	const [searchParams] = useSearchParams()
	const [userId, setUserId] = useState<string | null>(null)
	const isMobile = useMediaQuery('(max-width: 768px)')
	const user: any = useCurrent().user
	const activeRoomId: string | null = searchParams.get('id') || null
	const { subscriptionData } = useRoomListSubscriptions(user?.id)
	useEffect(() => {
		if (user && user.id) {
			setUserId(user.id)
		}
	}, [user])
	const { data } = useQuery<GetChatroomsForUserQuery>(
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
	}, [subscriptionData])
	return (
		<div className='h-full'>
			<div className='hm-[calc(100vh-0px)] flex'>
				{isMobile ? (
					isChatSelectedMobile ? (
						<TypingUsersProvider>
							<JoinRoomOrChatwindow
								onBackMobile={() =>
									setChatSelectedMobile(false)
								}
							/>
						</TypingUsersProvider>
					) : (
						<>
							<AddChatroom />
							<RoomList
								onSelectChatMobile={() =>
									setChatSelectedMobile(true)
								}
							/>
						</>
					)
				) : (
					<ResizablePanelGroup
						direction='horizontal'
						autoSaveId='ca-workspace-layout'
					>
						<ResizablePanel
							defaultSize={20}
							minSize={5}
							className='bg-[#000000]'
						>
							<AddChatroom />
							<RoomList
								onSelectChatMobile={() =>
									setChatSelectedMobile(true)
								}
							/>
						</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel minSize={20} defaultSize={80}>
							<TypingUsersProvider>
								<JoinRoomOrChatwindow
									onBackMobile={() =>
										setChatSelectedMobile(false)
									}
								/>
							</TypingUsersProvider>
						</ResizablePanel>
					</ResizablePanelGroup>
				)}
			</div>
		</div>
	)
}
