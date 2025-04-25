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
	GetChatroomsForUserQuery,
	GetUsersOfChatroomQuery
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

	const parsedActiveRoomId = activeRoomId ? parseFloat(activeRoomId) : null

	const { data: dataUsersOfChatroom, refetch: refetchUsersofChatroom } =
		useQuery<GetUsersOfChatroomQuery>(GET_USERS_OF_CHATROOM, {
			variables: {
				chatroomId: parsedActiveRoomId
			}
		})

	const [addUsersToChatroomMutation] = useMutation(ADD_USERS_TO_CHATROOM, {
		onCompleted: () => {
			toast.success('Пользователи успешно добавлены')
			setSelectedUsers([])
			refetchUsersofChatroom()
		},
		onError: (error: any) => {
			if (error.message.includes('Unique constraint failed')) {
				toast.error('Некоторые пользователи уже в чате')
			} else {
				toast.error('Ошибка при добавлении пользователей')
			}
		},
		update: (cache, { data }) => {
			try {
				if (!data?.addUsersToChatroom) return

				const addedUsers = selectItems
					.filter((item: any) => selectedUsers.includes(item.value))
					.map((item: any) => ({
						id: item.value,
						username: item.label,
						email: '',
						avatar: ''
					}))

				// Обновляем кэш чатов пользователя
				const userId = String(currentUserId)
				const query = GET_CHATROOMS_FOR_USER

				const chatroomsData = cache.readQuery<GetChatroomsForUserQuery>(
					{
						query,
						variables: { userId }
					}
				)

				if (!chatroomsData) return

				const updatedChatrooms = chatroomsData.getChatroomsForUser.map(
					chatroom => {
						if (chatroom.id !== activeRoomId) return chatroom

						return {
							...chatroom,
							ChatroomUsers: [
								...(chatroom.ChatroomUsers || []),
								...addedUsers.map((user: any) => ({
									__typename: 'ChatroomUsers',
									role: 'USER',
									user: {
										__typename: 'User',
										id: user.id,
										username: user.username,
										email: user.email,
										avatar: user.avatar
									}
								}))
							]
						}
					}
				)

				cache.writeQuery({
					query,
					variables: { userId },
					data: { getChatroomsForUser: updatedChatrooms }
				})
			} catch (error) {
				console.error('Ошибка при обновлении кеша:', error)
			}
		}
	})

	const handleAddUsersToChatroom = async () => {
		const validUserIds = selectedUsers.filter(
			userId => typeof userId === 'string' && userId.trim() !== ''
		)

		if (validUserIds.length === 0) {
			console.error('No valid user IDs')
			return
		}

		const existingUserIds = new Set(
			dataUsersOfChatroom?.getUsersOfChatroom?.map(user => user.id) || []
		)

		const usersToAdd = validUserIds.filter(
			userId => !existingUserIds.has(userId)
		)

		if (usersToAdd.length === 0) {
			toast.warning(
				'Один или несколько пользователей уже находятся в чате'
			)
			return
		}

		await addUsersToChatroomMutation({
			variables: {
				chatroomId: activeRoomId && parseInt(activeRoomId),
				userIds: usersToAdd
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
