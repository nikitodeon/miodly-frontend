import { ApolloCache, useMutation } from '@apollo/client'
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
import MultiSelect from '@/components/ui/elements/Multiselect'

import { GetChatroomsForUserQuery } from '@/graphql/generated/output'

import { DEMOTE_USERS_ROLES, UPDATE_USERS_ROLES } from '../mutations'
import { GET_CHATROOMS_FOR_USER, GET_USERS_OF_CHATROOM } from '../queries'

interface PromoteDemoteDialogProps {
	type: 'promote' | 'demote'
	activeRoomId: string | null | undefined
	currentUserId: string | null
	selectItems: any
}
const currentRoles = new Map()
const getNextRole = (
	currentRole: string,
	type: 'promote' | 'demote'
): string => {
	const roleHierarchy = ['USER', 'MODERATOR', 'ADMIN']
	const currentIndex = roleHierarchy.indexOf(currentRole)

	if (type === 'promote') {
		return currentIndex < roleHierarchy.length - 1
			? roleHierarchy[currentIndex + 1]
			: roleHierarchy[currentIndex]
	} else {
		return currentIndex > 0 ? roleHierarchy[currentIndex - 1] : 'USER'
	}
}

const updateChatroomCache = (
	cache: ApolloCache<any>,
	activeRoomId: string,
	updatedUsers: Array<{ userId: string; role: string }> | undefined,
	currentUserId: string | null
) => {
	if (!currentUserId) return

	try {
		const chatroomsData = cache.readQuery<GetChatroomsForUserQuery>({
			query: GET_CHATROOMS_FOR_USER,
			variables: { userId: currentUserId }
		})
		console.log('Chatrooms data from cache:', chatroomsData)

		if (chatroomsData) {
			const updatedChatrooms = chatroomsData.getChatroomsForUser.map(
				chatroom => {
					if (chatroom.id !== activeRoomId) return chatroom

					return {
						...chatroom,
						ChatroomUsers:
							chatroom.ChatroomUsers?.map(chatroomUser => {
								const updatedUser = updatedUsers?.find(
									u => u.userId === chatroomUser.user.id
								)
								return updatedUser
									? {
											...chatroomUser,
											role: updatedUser.role
										}
									: chatroomUser
							}) || []
					}
				}
			)

			cache.writeQuery({
				query: GET_CHATROOMS_FOR_USER,
				variables: { userId: currentUserId },
				data: { getChatroomsForUser: updatedChatrooms }
			})
		} else {
			console.log('No chatrooms data found to update.')
		}

		// Обновляем кеш для GET_USERS_OF_CHATROOM
		const usersData = cache.readQuery<any>({
			query: GET_USERS_OF_CHATROOM,
			variables: { chatroomId: parseFloat(activeRoomId) }
		})
		console.log('Users data from cache:', usersData)

		if (usersData?.getUsersOfChatroom) {
			const updatedUsersData = usersData.getUsersOfChatroom.map(
				(user: any) => {
					const updatedUser = updatedUsers?.find(
						u => u.userId === user.id
					)
					return updatedUser
						? { ...user, role: updatedUser.role }
						: user
				}
			)

			cache.writeQuery({
				query: GET_USERS_OF_CHATROOM,
				variables: { chatroomId: parseFloat(activeRoomId) },
				data: { getUsersOfChatroom: updatedUsersData }
			})
		} else {
			console.log('No users data found to update.')
		}
	} catch (error) {
		console.error('Cache update error:', error)
	}
}

export default function PromoteDemoteDialog({
	type,
	activeRoomId,
	currentUserId,
	selectItems
}: PromoteDemoteDialogProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedUsers, setSelectedUsers] = useState<string[]>([])
	const [query, setQuery] = useState('')

	const handleAddUser = (userId: string) => {
		setSelectedUsers([...selectedUsers, userId])
		setQuery('')
	}

	const handleRemoveUser = (userId: string) => {
		setSelectedUsers(selectedUsers.filter(id => id !== userId))
	}

	const handleSearchChange = (value: string) => setQuery(value)

	const commonMutationOptions = {
		onCompleted: () => {
			toast.success(
				`Пользователи успешно ${type === 'promote' ? 'повышены' : 'понижены'}`
			)
			setSelectedUsers([])
			setIsOpen(false)
		},
		onError: (error: Error) => {
			console.error('Mutation error:', error)
			toast.error(
				error.message.includes('Forbidden')
					? 'Вы не можете выполнить это действие'
					: 'Ошибка при выполнении действия'
			)
		}
	}

	const [promoteUsers] = useMutation(UPDATE_USERS_ROLES, {
		...commonMutationOptions,
		update: (cache, { data }) => {
			if (!activeRoomId) return
			const updatedUsers = data?.promoteUsersRoles?.updatedUsers
			if (!updatedUsers) return
			updateChatroomCache(
				cache,
				activeRoomId,
				updatedUsers,
				currentUserId
			)
		}
	})

	const [demoteUsers] = useMutation(DEMOTE_USERS_ROLES, {
		...commonMutationOptions,
		update: (cache, { data }) => {
			if (!activeRoomId) return
			const updatedUsers = data?.demoteUsersRoles?.updatedUsers
			if (!updatedUsers) return
			updateChatroomCache(
				cache,
				activeRoomId,
				updatedUsers,
				currentUserId
			)
		}
	})

	const handleAction = async () => {
		if (!activeRoomId) {
			toast.error('Чат не выбран')
			return
		}

		const validUserIds = selectedUsers.filter(Boolean)
		if (validUserIds.length === 0) {
			toast.warning('Нет пользователей для действия')
			return
		}

		try {
			const mutation = type === 'promote' ? promoteUsers : demoteUsers

			// Создаем обновленный список пользователей с оптимистической реакцией
			const optimisticUpdatedUsers = validUserIds.map(userId => {
				console.log('User being updated:', userId)
				return {
					__typename: 'UserRoleUpdate',
					userId,
					role: getNextRole(currentRoles.get(userId) || 'USER', type)
				}
			})

			await mutation({
				variables: {
					data: {
						chatroomId: parseInt(activeRoomId),
						targetUserIds: validUserIds
					}
				},
				optimisticResponse: {
					[type === 'promote'
						? 'promoteUsersRoles'
						: 'demoteUsersRoles']: {
						__typename: 'UpdateUsersRolesResponse',
						updatedUsers: optimisticUpdatedUsers
					}
				}
			})
		} catch (error) {
			console.error('Error:', error)
			toast.error('Произошла ошибка')
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<p className='text-sm font-semibold text-[#ecac21] hover:underline'>
					{type === 'promote' ? 'Повысить' : 'Понизить'}
				</p>
			</DialogTrigger>
			<DialogContent className='h-[420px] rounded-xl border-[3px] border-[#ecac21]'>
				<DialogHeader>
					<DialogTitle>
						{type === 'promote'
							? 'Повысьте статус участников чата'
							: 'Понизьте статус участников чата'}
					</DialogTitle>
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
						className='bg-[#ecac21] px-4 py-2 text-black hover:bg-[#d09e17]'
						onClick={handleAction}
					>
						{type === 'promote'
							? 'Повысить участников'
							: 'Понизить участников'}
					</Button>
				)}
			</DialogContent>
		</Dialog>
	)
}
