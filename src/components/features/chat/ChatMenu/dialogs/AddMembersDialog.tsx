import { gql, useMutation, useQuery } from '@apollo/client'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/common/Button'
import {
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/common/Dialog'
import MultiSelect from '@/components/ui/elements/Multiselect'

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
	selectItems: Array<{ value: string; label: string }>
	handleSearchChange: (query: string) => void
}

export default function AddMembersDialog({
	activeRoomId,
	currentUserId,
	selectedUsers,
	setSelectedUsers,
	selectItems,
	handleSearchChange
}: AddMembersDialogProps) {
	const [query, setQuery] = useState('')

	const parsedActiveRoomId = activeRoomId ? parseFloat(activeRoomId) : null

	const { data: dataUsersOfChatroom, refetch: refetchUsersOfChatroom } =
		useQuery<GetUsersOfChatroomQuery>(GET_USERS_OF_CHATROOM, {
			variables: {
				chatroomId: parsedActiveRoomId
			}
		})

	const [addUsersToChatroomMutation] = useMutation(ADD_USERS_TO_CHATROOM, {
		onCompleted: () => {
			toast.success('Пользователи успешно добавлены')
			setSelectedUsers([])
			setQuery('')
			refetchUsersOfChatroom()
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
				if (
					!data?.addUsersToChatroom ||
					!activeRoomId ||
					!currentUserId
				)
					return

				const addedUsers = selectedUsers
					.map(userId => {
						const user = selectItems.find(
							item => item.value === userId
						)
						return user
							? {
									id: userId,
									username: user.label,
									email: '',
									avatar: ''
								}
							: null
					})
					.filter(Boolean)

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
		const existingUserIds = new Set(
			dataUsersOfChatroom?.getUsersOfChatroom?.map(user => user.id) || []
		)

		const usersToAdd = selectedUsers.filter(
			userId => !existingUserIds.has(userId)
		)

		if (usersToAdd.length === 0) {
			toast.warning('Все выбранные пользователи уже находятся в чате')
			return
		}

		await addUsersToChatroomMutation({
			variables: {
				chatroomId: activeRoomId && parseInt(activeRoomId),
				userIds: usersToAdd
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
		<DialogContent className='h-[420px] border-[3px] border-[#ecac21]'>
			<DialogHeader>
				<DialogTitle>Добавьте участников</DialogTitle>
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
					onClick={handleAddUsersToChatroom}
				>
					Добавить участников
				</Button>
			)}
		</DialogContent>
	)
}
