import { gql, useMutation, useQuery } from '@apollo/client'
import { MultiSelect } from '@mantine/core'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/common/Button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/common/Dialog'

import { Chatroom, GetChatroomsForUserQuery } from '@/graphql/generated/output'

import { REMOVE_USERS_FROM_CHATROOM } from '../mutations'

interface RemoveMembersDialogProps {
	activeRoomId: string | null | undefined
	currentUserId: string | null
	selectedUsers: string[]
	setSelectedUsers: (users: string[]) => void
	selectItems: any
	handleSearchChange: any
}

export default function RemoveMembersDialog({
	activeRoomId,
	currentUserId,
	selectedUsers,
	setSelectedUsers,
	selectItems,
	handleSearchChange
}: RemoveMembersDialogProps) {
	console.log(
		'selectItemsNNNNNNNNNNNNNMMMMMMMMMMMMMMMMMNNNNNNNNNNNNNNNNNN',
		selectItems
	)
	const [isOpen, setIsOpen] = useState(false)
	const [removeUsers] = useMutation(REMOVE_USERS_FROM_CHATROOM)

	const plsh2 = <span className='text-white'>Выберите участников</span>
	const [removeUsersFromChatroomMutation] = useMutation(
		REMOVE_USERS_FROM_CHATROOM,
		{
			onCompleted: async () => {
				console.log('Users removed successfully')
				setSelectedUsers([])
			},
			onError: error => {
				console.error('Error removing users:', error)
			}
		}
	)
	const {
		data: chatroomsDataFromQuery,

		refetch: refetchChatrooms
	} = useQuery<GetChatroomsForUserQuery>(
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
				userId: currentUserId
			},

			fetchPolicy: 'network-only'
			// skip: !userId
		}
	)
	const handleRemoveUsersFromChatroom = async () => {
		console.log('Selected Users for Removal:', selectedUsers)

		const validUserIds = selectedUsers.filter(
			userId =>
				typeof userId === 'string' &&
				userId.trim() !== '' &&
				userId !== currentUserId
		)

		if (validUserIds.length === 0) {
			console.error('No valid user IDs to remove')
			toast.warning(
				'Вы не можете удалить себя или указаны неверные пользователи'
			)
			return
		}

		console.log('activeRoomId', activeRoomId)
		console.log('Chatrooms Data:', chatroomsDataFromQuery)

		// Найдём текущий чат по его ID
		const currentChatroom =
			chatroomsDataFromQuery?.getChatroomsForUser.find(
				chatroom => chatroom.id === activeRoomId
			)

		if (!currentChatroom) {
			toast.error('Ошибка: чат не найден')
			return
		}

		// Определяем роль текущего пользователя в этом чате
		const currentUserRole = currentChatroom.ChatroomUsers?.find(
			chatUser => chatUser.user.id === currentUserId
		)?.role

		if (!currentUserRole) {
			toast.error('Ошибка: ваша роль в этом чате не определена')
			return
		}

		console.log('Current User Role:', currentUserRole)

		// Фильтруем пользователей, которых можно удалить
		const usersToRemove = validUserIds.filter(userId => {
			const user = currentChatroom.ChatroomUsers?.find(
				u => u.user.id === userId
			)
			if (!user) return false // если пользователя нет в чате, пропускаем его

			// Логика удаления на основе ролей
			if (currentUserRole === 'ADMIN') {
				// Админ не может удалять других админов
				return user.role !== 'ADMIN'
			} else if (currentUserRole === 'MODERATOR') {
				// Модератор не может удалять админов и других модераторов
				return user.role !== 'ADMIN' && user.role !== 'MODERATOR'
			}
			return false
		})

		console.log('Users to Remove:', usersToRemove)

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

				// Удаляем пользователей из кэша
				cache.modify({
					fields: {
						getUsersOfChatroom(existingUsers = [], { readField }) {
							return existingUsers.filter((user: any) => {
								const sanitizeduserId = readField('id', user)

								// Приводим sanitizeduserId к строке
								const userIdAsString = String(sanitizeduserId)

								// Проверяем, что sanitizeduserId не является undefined и не null
								return (
									userIdAsString &&
									!usersToRemove.includes(userIdAsString)
								)
							})
						}
					}
				})
				const userId = String(currentUserId) // пример, можешь передать конкретный userId

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

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<p className='text-sm font-semibold text-rose-600 hover:underline'>
					Исключить
				</p>
			</DialogTrigger>
			<DialogContent className='h-[220px] rounded-xl border-[3px] border-[#ecac21]'>
				<DialogHeader>
					<DialogTitle>Удалите участников</DialogTitle>
				</DialogHeader>
				<MultiSelect
					data={selectItems}
					nothingFound='Ничего не найдено'
					searchable
					pb={'xl'}
					onSearchChange={handleSearchChange}
					label={plsh2}
					placeholder='Найдите участников чата по имени'
					onChange={values => setSelectedUsers(values)}
					styles={{
						input: {
							backgroundColor: '#1A1B1E',
							color: '#ccc',
							borderColor: '#444',
							borderRadius: '6px',
							paddingLeft: '12px',
							paddingRight: '12px'
						},
						dropdown: {
							backgroundColor: '#1A1B1E',
							borderRadius: '6px',
							borderColor: '#444'
						},
						item: {
							backgroundColor: '#1A1B1E',
							color: '#ccc',
							'&[data-selected]': {
								backgroundColor: '#444',
								color: 'white'
							},
							'&[data-hovered]': {
								backgroundColor: '#333'
							}
						},
						label: {
							color: '#ccc',
							marginBottom: '8px'
						}
					}}
				/>
				{selectedUsers.length > 0 && (
					<Button
						className='bg-[#ecac21] px-4 py-2 text-black hover:bg-[#d09e17]'
						onClick={handleRemoveUsersFromChatroom}
					>
						Удалить участников
					</Button>
				)}
			</DialogContent>
		</Dialog>
	)
}
