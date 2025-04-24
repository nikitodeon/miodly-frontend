import { gql, useMutation, useQuery } from '@apollo/client'
import { MultiSelect } from '@mantine/core'
import { toast } from 'sonner'

import { Button } from '@/components/ui/common/Button'
import {
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/common/Dialog'

import {
	Chatroom,
	GetChatroomsForUserQuery,
	GetUsersOfChatroomQuery,
	UserModel
} from '@/graphql/generated/output'

import { ADD_USERS_TO_CHATROOM } from '../mutations'
import { GET_CHATROOMS_FOR_USER, GET_USERS_OF_CHATROOM } from '../queries'

interface AddMembersDialogProps {
	activeRoomId: string | null | undefined
	currentUserId: string | null
	selectedUsers: string[]
	setSelectedUsers: (users: string[]) => void
	selectItems: any
	handleSearchChange: any
}

export default function AddMembersDialog({
	activeRoomId,
	currentUserId,
	selectedUsers,
	setSelectedUsers,
	selectItems,
	handleSearchChange
}: AddMembersDialogProps) {
	const plsh2 = <span className='text-white'>Выберите участников</span>

	// Запрос на получение пользователей чата
	const { data: dataUsersOfChatroom, refetch: refetchUsersofChatroom } =
		useQuery<GetUsersOfChatroomQuery>(GET_USERS_OF_CHATROOM, {
			variables: {
				chatroomId: activeRoomId ? parseInt(activeRoomId) : 0
			},
			skip: !activeRoomId
		})

	// Мутация для добавления пользователей
	const [addUsersToChatroomMutation] = useMutation(ADD_USERS_TO_CHATROOM)

	const handleAddUsersToChatroom = async () => {
		const validUserIds = selectedUsers.filter(
			userId => typeof userId === 'string' && userId.trim() !== ''
		)

		// Если нет валидных ID пользователей
		if (validUserIds.length === 0) {
			toast.error('Нет валидных ID пользователей')
			return
		}

		// Проверяем, какие пользователи уже в чате
		const existingUserIds = new Set(
			dataUsersOfChatroom?.getUsersOfChatroom?.map(
				(user: any) => user.id
			) || []
		)

		// Отбираем пользователей, которых еще нет в чате
		const usersToAdd = validUserIds.filter(
			userId => !existingUserIds.has(userId)
		)

		// Если все пользователи уже в чате
		if (usersToAdd.length === 0) {
			toast.warning('Все выбранные пользователи уже в чате')
			return
		}

		// Добавляем пользователей через мутацию
		await addUsersToChatroomMutation({
			variables: {
				chatroomId: activeRoomId && parseInt(activeRoomId),
				userIds: usersToAdd
			},
			onCompleted: (data: any) => {
				toast.success('Пользователи добавлены')
				setSelectedUsers([]) // очищаем выбранных пользователей
				refetchUsersofChatroom() // рефетчим список пользователей чата
			},
			onError: (error: any) => {
				if (error.message.includes('Unique constraint failed')) {
					toast.error('Некоторые пользователи уже добавлены')
				} else {
					console.log(error)
					toast.error('Ошибка при добавлении пользователей')
				}
			},
			// Обновление кеша после добавления пользователей
			update: (cache, { data }) => {
				if (!data?.addUsersToChatroom?.ChatroomUsers) return

				const addedUsers = data.addUsersToChatroom.ChatroomUsers.map(
					(cu: any) => cu.user
				)
				const userId = String(currentUserId)

				// Обновляем кеш для списка пользователей чата
				try {
					// Читаем текущие данные из кеша
					const chatroomsData =
						cache.readQuery<GetChatroomsForUserQuery>({
							query: GET_CHATROOMS_FOR_USER,
							variables: { userId }
						})

					if (!chatroomsData?.getChatroomsForUser) return

					const updatedChatrooms =
						chatroomsData.getChatroomsForUser.map(
							(chatroom: any) => {
								if (
									String(chatroom.id) !== String(activeRoomId)
								)
									return chatroom

								const existingUsers =
									chatroom.ChatroomUsers || []

								// Добавляем новых пользователей
								const newChatroomUsers = [
									...existingUsers,
									...data.addUsersToChatroom.ChatroomUsers.map(
										(cu: any) => ({
											__typename: 'ChatroomUsers',
											role: cu.role || 'USER',
											user: {
												__typename: 'User',
												id: cu.user.id,
												username: cu.user.username,
												email: cu.user.email,
												avatar: cu.user.avatar
											}
										})
									)
								]

								return {
									...chatroom,
									ChatroomUsers: newChatroomUsers
								}
							}
						)

					// Записываем обновленные данные в кеш
					cache.writeQuery({
						query: GET_CHATROOMS_FOR_USER,
						variables: { userId },
						data: {
							getChatroomsForUser: updatedChatrooms
						}
					})

					// Теперь обновляем кеш для списка пользователей в этом чате
					const updatedUsers = [
						...(dataUsersOfChatroom?.getUsersOfChatroom ?? []),
						...addedUsers
					]

					cache.writeQuery({
						query: GET_USERS_OF_CHATROOM,
						variables: { chatroomId: activeRoomId },
						data: {
							getUsersOfChatroom: updatedUsers
						}
					})
				} catch (err) {
					console.error('Ошибка обновления кеша:', err)
				}
			}
		})
	}

	return (
		<DialogContent className='h-[220px] border-[3px] border-[#ecac21]'>
			<DialogHeader>
				<DialogTitle>Добавьте участников</DialogTitle>
			</DialogHeader>
			<MultiSelect
				data={selectItems}
				onSearchChange={handleSearchChange}
				nothingFound='Ничего не найдено'
				searchable
				pb={'xl'}
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
					onClick={handleAddUsersToChatroom}
				>
					Добавить участников
				</Button>
			)}
		</DialogContent>
	)
}
