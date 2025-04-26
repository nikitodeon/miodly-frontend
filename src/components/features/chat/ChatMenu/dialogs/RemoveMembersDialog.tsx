import { gql, useMutation, useQuery } from '@apollo/client'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/common/Button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/common/Dialog'
import MultiSelect from '@/components/ui/elements/Multiselect'

import { Chatroom, GetChatroomsForUserQuery } from '@/graphql/generated/output'

import { REMOVE_USERS_FROM_CHATROOM } from '../mutations'

interface RemoveMembersDialogProps {
	activeRoomId: string | null | undefined
	currentUserId: string | null
	selectedUsers: string[]
	setSelectedUsers: (users: string[]) => void
	selectItems: Array<{ value: string; label: string }>
	handleSearchChange: (query: string) => void
}

export default function RemoveMembersDialog({
	activeRoomId,
	currentUserId,
	selectedUsers,
	setSelectedUsers,
	selectItems,
	handleSearchChange
}: RemoveMembersDialogProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [query, setQuery] = useState('')

	const [removeUsersFromChatroomMutation] = useMutation(
		REMOVE_USERS_FROM_CHATROOM,
		{
			onCompleted: async () => {
				toast.success('Пользователи успешно удалены')
				setSelectedUsers([])
				setQuery('')
			},
			onError: error => {
				console.error('Error removing users:', error)
				toast.error('Ошибка при удалении пользователей')
			}
		}
	)

	const { data: chatroomsDataFromQuery } = useQuery<GetChatroomsForUserQuery>(
		gql`
			query getChatroomsForUser($userId: String!) {
				getChatroomsForUser(userId: $userId) {
					id
					name
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
			variables: { userId: currentUserId },
			fetchPolicy: 'network-only'
		}
	)

	const handleRemoveUsersFromChatroom = async () => {
		const validUserIds = selectedUsers.filter(
			userId =>
				typeof userId === 'string' &&
				userId.trim() !== '' &&
				userId !== currentUserId
		)

		if (validUserIds.length === 0) {
			toast.warning(
				'Вы не можете удалить себя или указаны неверные пользователи'
			)
			return
		}

		const currentChatroom =
			chatroomsDataFromQuery?.getChatroomsForUser.find(
				chatroom => chatroom.id === activeRoomId
			)

		if (!currentChatroom) {
			toast.error('Ошибка: чат не найден')
			return
		}

		const currentUserRole = currentChatroom.ChatroomUsers?.find(
			chatUser => chatUser.user.id === currentUserId
		)?.role

		if (!currentUserRole) {
			toast.error('Ошибка: ваша роль в этом чате не определена')
			return
		}

		const usersToRemove = validUserIds.filter(userId => {
			const user = currentChatroom.ChatroomUsers?.find(
				u => u.user.id === userId
			)
			if (!user) return false

			if (currentUserRole === 'ADMIN') {
				return user.role !== 'ADMIN'
			} else if (currentUserRole === 'MODERATOR') {
				return user.role !== 'ADMIN' && user.role !== 'MODERATOR'
			}
			return false
		})

		if (usersToRemove.length === 0) {
			toast.warning('Выбранных пользователей нельзя удалить')
			return
		}

		await removeUsersFromChatroomMutation({
			variables: {
				chatroomId: activeRoomId && parseInt(activeRoomId),
				userIds: usersToRemove
			},
			onCompleted: () => {
				toast.success('Пользователи успешно удалены')
				console.log('Users removed successfully')
				setSelectedUsers([])
			},
			onError: (error: any) => {
				if (error.message.includes('User not in chatroom')) {
					toast.error('Некоторые пользователи не находятся в чате')
				} else {
					toast.error('Ошибка при удалении пользователей')
				}
			},
			update: (cache, { data }) => {
				if (!data || !data.removeUsersFromChatroom) return

				cache.modify({
					fields: {
						getUsersOfChatroom(existingUsers = [], { readField }) {
							return existingUsers.filter((user: any) => {
								const sanitizeduserId = readField('id', user)

								const userIdAsString = String(sanitizeduserId)

								null
								return (
									userIdAsString &&
									!usersToRemove.includes(userIdAsString)
								)
							})
						}
					}
				})
				const userId = String(currentUserId)

				const query = gql`
					query GetChatroomsForUser($userId: String!) {
						getChatroomsForUser(userId: $userId) {
							id
							name
							messages {
								id
								content
								createdAt
							}
							ChatroomUsers {
								user {
									id
									username
									avatar
									email
								}
							}
						}
					}
				`

				const chatrooms = cache.readQuery<{
					getChatroomsForUser: Chatroom[]
				}>({ query, variables: { userId } })

				if (chatrooms && chatrooms.getChatroomsForUser) {
					const updatedChatrooms = chatrooms.getChatroomsForUser.map(
						(chat: any) => {
							// Обновляем список пользователей в чате
							const updatedUsers = chat.ChatroomUsers.filter(
								(chatUser: any) =>
									!usersToRemove.includes(chatUser.user.id)
							)
							return { ...chat, ChatroomUsers: updatedUsers }
						}
					)

					// Записываем обновленные данные обратно в кэш
					cache.writeQuery({
						query,
						variables: { userId },
						data: { getChatroomsForUser: updatedChatrooms }
					})
				}
			}
		})
	}

	const handleAddUser = (userId: string) => {
		setSelectedUsers([...selectedUsers, userId])
		setQuery('')
	}

	const handleRemoveUser = (userId: string) => {
		setSelectedUsers(selectedUsers.filter(id => id !== userId))
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<p className='text-sm font-semibold text-rose-600 hover:underline'>
					Исключить
				</p>
			</DialogTrigger>
			<DialogContent className='h-[420px] rounded-xl border-[3px] border-[#ecac21]'>
				<DialogHeader>
					<DialogTitle>Удалите участников</DialogTitle>
				</DialogHeader>
				<div className='mb-[130px]'>
					<MultiSelect
						query={query}
						setQuery={setQuery}
						selectItems={selectItems}
						selectedUsers={selectedUsers}
						handleAddUser={handleAddUser}
						handleRemoveUser={handleRemoveUser}
						handleSearchChange={handleSearchChange}
					/>
				</div>
				{selectedUsers.length > 0 && (
					<Button
						className='mt-2 bg-[#ecac21] px-4 py-2 text-black hover:bg-[#d09e17]'
						onClick={handleRemoveUsersFromChatroom}
					>
						Удалить участников
					</Button>
				)}
			</DialogContent>
		</Dialog>
	)
}
