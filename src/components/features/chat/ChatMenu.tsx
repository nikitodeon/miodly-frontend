import { gql, useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { MultiSelect } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { TrashIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaChevronDown } from 'react-icons/fa'
import { toast } from 'sonner'

import { Button } from '@/components/ui/common/Button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/common/Dialog'
import { Input } from '@/components/ui/common/Input'

import {
	GetChatroomsForUserQuery,
	GetUsersOfChatroomQuery,
	useChangeChatNameMutation,
	useUpdateUsersRolesMutation
} from '@/graphql/generated/output'
import { useAddUsersToChatroomMutation } from '@/graphql/generated/output'
import {
	AddUsersToChatroomMutation,
	Chatroom,
	SearchUsersQuery
	//   User,
} from '@/graphql/generated/output'

import { useConfirm } from '@/hooks/useConfirm'

import { client } from '@/libs/apollo-client'

import {
	TypeChangeNameSchema,
	changeNameSchema
} from '@/schemas/chat/change-name.schema'

import { getMediaSource } from '@/utils/get-media-source'

interface HeaderProps {
	title: string | null | undefined
	activeRoomId: string | null | undefined
	currentUserId: string | null
	chatroomsData: any
	onUpdateChatroomsDataToFalse: any
	// Добавляем новый пропс
}

export const ChatMenu = ({
	title,
	activeRoomId,
	currentUserId,
	chatroomsData,
	onUpdateChatroomsDataToFalse // Получаем callback
}: HeaderProps) => {
	const [editOpen, setEditOpen] = useState(false)
	const [membersEditOpen, setMembersEditOpen] = useState(false)
	const [membersDeleteOpen, setMembersDeleteOpen] = useState(false)
	const [membersPromoteOpen, setMembersPromoteOpen] = useState(false)
	const [membersDemoteOpen, setMembersDemoteOpen] = useState(false)

	const isMobile = useMediaQuery('(max-width: 768px)')
	const [ConfirmDialog, confirm] = useConfirm(
		'Вы уверены, что хотите удалить чат?',
		'Это действие нельзя будет отменить.'
	)
	const activeChatroom = chatroomsData?.getChatroomsForUser?.find(
		(chatroom: any) => chatroom.id === activeRoomId
	)

	const handleEditOpen = (value: boolean) => {
		setEditOpen(value)
	}

	const handleMembersEditOpen = (value: boolean) => {
		setMembersEditOpen(value)
	}

	const handleMembersDeleteOpen = (value: boolean) => {
		setMembersDeleteOpen(value)
	}
	const handleMembersPromoteOpen = (value: boolean) => {
		setMembersPromoteOpen(value)
	}
	const handleMembersDemoteOpen = (value: boolean) => {
		setMembersDemoteOpen(value)
	}

	const [deleteChatroom] = useMutation(
		gql`
			mutation deleteChatroom($chatroomId: Float!) {
				deleteChatroom(chatroomId: $chatroomId)
			}
		`,
		{
			variables: {
				chatroomId: parseFloat(activeRoomId ?? '0')
			},
			// Это обновление кэша при успешном удалении чата
			update(cache, { data }) {
				if (!data || !data.deleteChatroom) return

				// Удаляем чат из кэша
				cache.modify({
					fields: {
						getChatroomsForUser(
							existingChatrooms = [],
							{ readField }
						) {
							return existingChatrooms.filter(
								(chatroom: any) =>
									readField('id', chatroom) !== activeRoomId
							)
						}
					}
				})
			},
			onCompleted: () => {
				toast.success('Channel deleted')
			}
		}
	)
	// const GET_MESSAGES_FOR_CHATROOM = gql`
	// 	query GetMessagesForChatroom($chatroomId: Float!) {
	// 		getMessagesForChatroom(chatroomId: $chatroomId) {
	// 			id
	// 			content
	// 			imageUrl
	// 			createdAt
	// 			user {
	// 				id
	// 				username
	// 				email
	// 				avatar
	// 			}
	// 			chatroom {
	// 				id
	// 				name
	// 				ChatroomUsers {
	// 					user {
	// 						id
	// 						username
	// 						avatar
	// 						email
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// `
	// const { refetch } = useQuery(GET_MESSAGES_FOR_CHATROOM, {
	// 	variables: { activeRoomId }
	// })
	const handleDelete = async () => {
		const ok = await confirm()
		if (!ok) return
		deleteChatroom()
		// Обновляем родительский компонент
		// await refetch()
		onUpdateChatroomsDataToFalse()
	}

	const chatName = activeChatroom?.name

	const form = useForm<TypeChangeNameSchema>({
		resolver: zodResolver(changeNameSchema),
		defaultValues: {
			name: chatName || '' // Убедитесь, что начальное значение присутствует
		}
	})

	const [update, { loading: isLoadingUpdate }] = useChangeChatNameMutation({
		onCompleted() {
			toast.success('Channel name updated successfully')
		},
		onError(err) {
			toast.error('Error updating channel name')
			console.error('Error updating channel name:', err) // Лог
		},
		update(cache, { data }) {
			if (!data) return

			const updatedChat = data.changeChatName

			cache.modify({
				id: cache.identify({
					__typename: 'Chatroom',
					id: activeRoomId
				}),
				fields: {
					name() {
						return updatedChat.name
					}
				}
			})
		}
	})

	const handleSubmit = async (data: TypeChangeNameSchema) => {
		await update({
			variables: { data, chatroomId: parseFloat(activeRoomId ?? '0') }
		})
	}

	////////////////////////////////////////////
	const searchUsers = gql`
		query searchUsers($fullname: String!) {
			searchUsers(fullname: $fullname) {
				id
				username
			}
		}
	`

	const addUsersToChatroom = gql`
		mutation addUsersToChatroom($chatroomId: Float!, $userIds: [String!]!) {
			addUsersToChatroom(chatroomId: $chatroomId, userIds: $userIds) {
				name
				id
			}
		}
	`
	const [selectedUsers, setSelectedUsers] = useState<string[]>([])

	const [searchTerm, setSearchTerm] = useState('')
	const { data, refetch } = useQuery<SearchUsersQuery>(searchUsers, {
		variables: { fullname: searchTerm }
	})
	const GET_USERS_OF_CHATROOM = gql`
		query GetUsersOfChatroom($chatroomId: Float!) {
			getUsersOfChatroom(chatroomId: $chatroomId) {
				id
				username
				email
				avatar
			}
		}
	`
	const parsedActiveRoomId = activeRoomId ? parseFloat(activeRoomId) : null

	const { data: dataUsersOfChatroom } = useQuery<GetUsersOfChatroomQuery>(
		GET_USERS_OF_CHATROOM,
		{
			variables: {
				chatroomId: parsedActiveRoomId
			}
		}
	)

	const REMOVE_USERS_FROM_CHATROOM = gql`
		mutation RemoveUsersFromChatroom(
			$chatroomId: Float!
			$userIds: [String!]!
		) {
			removeUsersFromChatroom(
				chatroomId: $chatroomId
				userIds: $userIds
			) {
				name
				id
			}
		}
	`

	const [removeUsersFromChatroomMutation] = useMutation(
		REMOVE_USERS_FROM_CHATROOM,
		{
			onCompleted: async () => {
				console.log('Users removed successfully')
				setSelectedUsers([])
				form.reset()
			},
			onError: error => {
				console.error('Error removing users:', error)
			}
		}
	)

	const GET_CHATROOMS_FOR_USER = gql`
		query GetChatroomsForUser($userId: String!) {
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

	const {
		data: chatroomsDataFromQuery,
		loading,
		error,
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
		console.log('activeRoomId', activeRoomId) ///здесь пишет 126
		console.log('Data Users of Chatroom:', dataUsersOfChatroom) ///здесь пишет undefined
		const existingUserIds = new Set(
			dataUsersOfChatroom?.getUsersOfChatroom?.map(user => user.id) || []
		)
		console.log('Existing User IDs:', existingUserIds)

		const usersToRemove = validUserIds.filter(userId =>
			existingUserIds.has(userId)
		)
		console.log('Users to Remove:', usersToRemove)
		if (usersToRemove.length === 0) {
			toast.warning('Выбранные пользователи не находятся в чате')
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
				form.reset()
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

	const ADD_USERS_TO_CHATROOM = gql`
		mutation addUsersToChatroom($chatroomId: Float!, $userIds: [String!]!) {
			addUsersToChatroom(chatroomId: $chatroomId, userIds: $userIds) {
				name
				id
			}
		}
	`
	const [addUsersToChatroomMutation] = useMutation(ADD_USERS_TO_CHATROOM, {
		// refetchQueries: ['GetChatroomsForUser'],
		onCompleted: async data => {
			console.log('Users added successfully')
			setSelectedUsers([]) // Очищаем выбранных пользователей
			form.reset() // Сброс формы
			// const addedUsers = data?.addUsersToChatroom?.ChatroomUsers

			// if (addedUsers && addedUsers.length > 0) {
			// 	client.cache.modify({
			// 		id: client.cache.identify({
			// 			__typename: 'Chatroom',
			// 			id: activeRoomId
			// 		}),
			// 		fields: {
			// 			users(existingUsers = []) {
			// 				// Объединяем существующих пользователей с добавленными
			// 				const updatedUsers = [
			// 					...existingUsers,
			// 					...addedUsers
			// 				]
			// 				return updatedUsers
			// 			}
			// 		}
			// 	})
			// 	client.cache.modify({
			// 		id: client.cache.identify({
			// 			__typename: 'Chatroom',
			// 			id: activeRoomId
			// 		}),
			// 		fields: {
			// 			ChatroomUsers(existingUsers = []) {
			// 				return [...existingUsers, ...addedUsers]
			// 			}
			// 		}
			// 	})
			// 	console.log('Updated users list in cache:', addedUsers)
			// }
		},
		onError: error => {
			console.error('Error adding users:', error)
		}
	})
	const UPDATE_USERS_ROLES = gql`
		mutation UpdateUsersRoles($data: UpdateUsersRolesInput!) {
			updateUsersRoles(data: $data)
		}
	`
	const [updateUsersRoles] = useMutation(UPDATE_USERS_ROLES, {
		// refetchQueries: ['GetChatroomsForUser'],
		onCompleted: async data => {
			console.log('Roles updated successfully')
			setSelectedUsers([]) // Очищаем выбранных пользователей
			form.reset() // Сброс формы
			// const addedUsers = data?.addUsersToChatroom?.ChatroomUsers
		},
		onError: error => {
			console.error('Error adding users:', error)
		}
	})
	const DEMOTE_USERS_ROLES = gql`
		mutation DemoteUsersRoles($data: UpdateUsersRolesInput!) {
			updateUsersRolesForDemotion(data: $data)
		}
	`
	const [demoteUsersRoles] = useMutation(DEMOTE_USERS_ROLES, {
		// refetchQueries: ['GetChatroomsForUser'],
		onCompleted: async data => {
			console.log('Roles updated successfully')
			setSelectedUsers([]) // Очищаем выбранных пользователей
			form.reset() // Сброс формы
			// const addedUsers = data?.addUsersToChatroom?.ChatroomUsers
		},
		onError: error => {
			console.error('Error adding users:', error)
		}
	})

	//   const { data, refetch } = useQuery<SearchUsersQuery>(SEARCH_USERS, {
	//     variables: { fullname: searchTerm },
	//   })
	//   const [addUsersToChatroom, { loading: loadingAddUsers }] =
	// useMutation<AddUsersToChatroomMutation>(ADD_USERS_TO_CHATROOM, {
	//   refetchQueries: ["GetChatroomsForUser"],
	// // })
	let debounceTimeout: NodeJS.Timeout

	const handleSearchChange = (term: string) => {
		// Set the state variable to trigger a re-render and show a loading indicator
		setSearchTerm(term)
		// Debounce the refetching so you're not bombarding the server on every keystroke
		clearTimeout(debounceTimeout)
		debounceTimeout = setTimeout(() => {
			refetch()
		}, 300)
	}
	type SelectItem = {
		label: string
		value: string
		// other properties if required
	}
	const selectItems: SelectItem[] =
		data?.searchUsers?.map((user: any) => ({
			label: user.username,
			value: String(user.id)
		})) || []

	const handleAddUsersToChatroom = async () => {
		console.log('Selected Users:', selectedUsers)

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
				userIds: usersToAdd // БЫЛО validUserIds, теперь usersToAdd
			},
			onCompleted: () => {
				toast.success('Пользователи успешно добавлены')
				console.log('Users added successfully')
				setSelectedUsers([]) // Очищаем выбранных пользователей
				form.reset() // Сброс формы
			},
			onError: (error: any) => {
				if (error.message.includes('Unique constraint failed')) {
					toast.error('Некоторые пользователи уже в чате')
				} else {
					toast.error('Ошибка при добавлении пользователей')
				}
			},
			update: (cache, { data }) => {
				if (!data || !data.addUsersToChatroom) return
				cache.modify({
					fields: {
						getUsersOfChatroom(existingUsers = [], { readField }) {
							const newUsers = usersToAdd.map(userId => ({
								__typename: 'User', // Убедитесь, что тип правильный
								id: userId
							}))

							// Добавляем новых пользователей в существующий список
							return [...existingUsers, ...newUsers]
						}
					}
				})
				// Получаем актуальные данные чатов
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

				// Чтение текущего состояния чатов из кэша
				const chatrooms = cache.readQuery<{
					getChatroomsForUser: Chatroom[]
				}>({
					query,
					variables: { userId }
				})

				if (chatrooms && chatrooms.getChatroomsForUser) {
					const updatedChatrooms = chatrooms.getChatroomsForUser.map(
						(chat: any) => {
							// Добавляем новых пользователей в список
							const updatedUsers = [
								...chat.ChatroomUsers,
								...usersToAdd.map(userId => ({
									user: { id: userId }
								}))
							]

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
	// const handlePromoteUsersToChatroom = async () => {
	// 	console.log('Selected Users:', selectedUsers)

	// 	const validUserIds = selectedUsers.filter(
	// 		userId => typeof userId === 'string' && userId.trim() !== ''
	// 	)

	// 	if (validUserIds.length === 0) {
	// 		console.error('No valid user IDs')
	// 		return
	// 	}

	// 	const existingUserIds = new Set(
	// 		dataUsersOfChatroom?.getUsersOfChatroom?.map(user => user.id) || []
	// 	)

	// 	const usersToPromote = validUserIds.filter(userId =>
	// 		existingUserIds.has(userId)
	// 	)

	// 	if (usersToPromote.length === 0) {
	// 		toast.warning('Нет пользователей для повышения')
	// 		return
	// 	}

	// 	await updateUsersRoles({
	// 		variables: {
	// 			data: {
	// 				chatroomId: activeRoomId && parseInt(activeRoomId),
	// 				targetUserIds: usersToPromote
	// 			}
	// 		},
	// 		onCompleted: () => {
	// 			toast.success('Пользователи успешно повышены')
	// 			console.log('Users promoted successfully')
	// 			setSelectedUsers([])
	// 			form.reset()

	// 			// Перезапросить чаты, чтобы обновить данные
	// 			refetchChatrooms()
	// 		},
	// 		onError: (error: any) => {
	// 			if (error.message.includes('Forbidden')) {
	// 				toast.error('Вы не можете повысить этих пользователей')
	// 			} else if (error.message.includes('BadRequest')) {
	// 				toast.error('Некоторые пользователи не найдены в чате')
	// 			} else {
	// 				console.error('Error promoting users', error)
	// 				toast.error('Ошибка при повышении пользователей')
	// 			}
	// 		},
	// 		update: (cache, { data }) => {
	// 			if (!data || !data.promoteUsers) return

	// 			const promotedUsers = data.promoteUsers // Это список ID пользователей, которых повысили

	// 			// Обновление ролей в кэше
	// 			cache.modify({
	// 				fields: {
	// 					getUsersOfChatroom(existingUsers = [], { readField }) {
	// 						const updatedUsers = existingUsers.map(
	// 							(user: any) => {
	// 								if (promotedUsers.includes(user.id)) {
	// 									return {
	// 										...user,
	// 										role:
	// 											user.role === 'USER'
	// 												? 'MODERATOR'
	// 												: user.role === 'MODERATOR'
	// 													? 'ADMIN'
	// 													: user.role
	// 									}
	// 								}
	// 								return user
	// 							}
	// 						)

	// 						return updatedUsers
	// 					}
	// 				}
	// 			})

	// 			// Перезапрос данных
	// 			refetchChatrooms()
	// 		}
	// 	})

	// }
	// const handleDemoteUsersToChatroom = async () => {
	// 	console.log('Selected Users:', selectedUsers)

	// 	// Фильтруем пользователей, чтобы оставить только валидные ID
	// 	const validUserIds = selectedUsers.filter(
	// 		userId => typeof userId === 'string' && userId.trim() !== ''
	// 	)

	// 	if (validUserIds.length === 0) {
	// 		console.error('No valid user IDs')
	// 		return
	// 	}

	// 	// Получаем существующие ID пользователей в чате
	// 	const existingUserIds = new Set(
	// 		dataUsersOfChatroom?.getUsersOfChatroom?.map(user => user.id) || []
	// 	)

	// 	// Фильтруем тех пользователей, которые уже существуют в чате
	// 	const usersToDemote = validUserIds.filter(userId =>
	// 		existingUserIds.has(userId)
	// 	)

	// 	if (usersToDemote.length === 0) {
	// 		toast.warning('Нет пользователей для понижения')
	// 		return
	// 	}

	// 	// Выполняем мутацию для понижения пользователей
	// 	await demoteUsersRoles({
	// 		variables: {
	// 			data: {
	// 				chatroomId: activeRoomId && parseInt(activeRoomId), // chatroomId как число
	// 				targetUserIds: usersToDemote // usersToDemote - массив ID пользователей для понижения
	// 			}
	// 		},
	// 		onCompleted: () => {
	// 			toast.success('Пользователи успешно понижены')
	// 			console.log('Users demoted successfully')
	// 			setSelectedUsers([]) // Очищаем выбранных пользователей
	// 			form.reset() // Сброс формы
	// 		},
	// 		onError: (error: any) => {
	// 			if (error.message.includes('Forbidden')) {
	// 				toast.error('Вы не можете понизить этих пользователей')
	// 			} else if (error.message.includes('BadRequest')) {
	// 				toast.error('Некоторые пользователи не найдены в чате')
	// 			} else {
	// 				console.error('Error demoting users', error)
	// 				toast.error('Ошибка при понижении пользователей')
	// 			}
	// 		},
	// 		update: (cache, { data }) => {
	// 			if (!data || !data.demoteUsers) return

	// 			const demotedUsers = data.demoteUsers // Это список ID пользователей, которых понизили

	// 			// Обновление ролей в кэше
	// 			cache.modify({
	// 				fields: {
	// 					getUsersOfChatroom(existingUsers = [], { readField }) {
	// 						const updatedUsers = existingUsers.map(
	// 							(user: any) => {
	// 								if (demotedUsers.includes(user.id)) {
	// 									return {
	// 										...user,
	// 										role:
	// 											user.role === 'ADMIN'
	// 												? 'MODERATOR'
	// 												: user.role === 'MODERATOR'
	// 													? 'USER'
	// 													: user.role // понижаем админов до модераторов и модераторов до пользователей
	// 									}
	// 								}
	// 								return user
	// 							}
	// 						)

	// 						return updatedUsers
	// 					}
	// 				}
	// 			})

	// 			// Перезапрос данных чатов после мутации
	// 			refetchChatrooms()
	// 		}
	// 	})
	// }
	const handlePromoteUsersToChatroom = async () => {
		console.log('Selected Users:', selectedUsers)

		// Фильтруем пользователей, чтобы оставить только валидные ID
		const validUserIds = selectedUsers.filter(
			userId => typeof userId === 'string' && userId.trim() !== ''
		)

		if (validUserIds.length === 0) {
			console.error('No valid user IDs')
			return
		}

		console.log('Valid User IDs:', validUserIds)

		// Получаем существующие ID пользователей в чате
		const existingUserIds = new Set(
			dataUsersOfChatroom?.getUsersOfChatroom?.map(user => user.id) || []
		)

		console.log('Existing User IDs in chat:', existingUserIds)

		// Фильтруем тех пользователей, которые уже существуют в чате
		const usersToPromote = validUserIds.filter(userId =>
			existingUserIds.has(userId)
		)

		console.log('Users to promote:', usersToPromote)

		if (usersToPromote.length === 0) {
			toast.warning('Нет пользователей для повышения')
			return
		}

		// Выполняем мутацию для повышения пользователей
		await updateUsersRoles({
			variables: {
				data: {
					chatroomId: activeRoomId && parseInt(activeRoomId), // chatroomId как число
					targetUserIds: usersToPromote
				}
			},
			onCompleted: data => {
				console.log(
					'Mutation response:oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
					data
				)

				toast.success('Пользователи успешно повышены')
				console.log('Users promoted successfully')
				setSelectedUsers([])
				form.reset()

				// Перезапросить чаты, чтобы обновить данные
				refetchChatrooms()
			},
			onError: (error: any) => {
				if (error.message.includes('Forbidden')) {
					toast.error('Вы не можете повысить этих пользователей')
				} else if (error.message.includes('BadRequest')) {
					toast.error('Некоторые пользователи не найдены в чате')
				} else {
					console.error('Error promoting users', error)
					toast.error('Ошибка при повышении пользователей')
				}
			}
			// update: (cache, { data }) => {
			// 	// if (!data || !data.promoteUsers) {
			// 	// 	console.log(
			// 	// 		'No users were promotedoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo'
			// 	// 	)
			// 	// 	return
			// 	// }

			// 	// const promotedUsers = data.promoteUsers // Это список ID пользователей, которых повысили
			// 	// console.log(
			// 	// 	'Promoted Users:oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
			// 	// 	promotedUsers
			// 	// )

			// 	// Обновление ролей в кэше
			// 	// cache.modify({
			// 	// 	fields: {
			// 	// 		getUsersOfChatroom(existingUsers = [], { readField }) {
			// 	// 			const updatedUsers = existingUsers.map(
			// 	// 				(user: any) => {
			// 	// 					if (promotedUsers.includes(user.id)) {
			// 	// 						console.log(
			// 	// 							`Updating user ${user.id} role to ${user.role}`
			// 	// 						)
			// 	// 						return {
			// 	// 							...user,
			// 	// 							role:
			// 	// 								user.role === 'USER'
			// 	// 									? 'MODERATOR'
			// 	// 									: user.role === 'MODERATOR'
			// 	// 										? 'ADMIN'
			// 	// 										: user.role
			// 	// 						}
			// 	// 					}
			// 	// 					return user
			// 	// 				}
			// 	// 			)

			// 	// 			return updatedUsers
			// 	// 		}
			// 	// 	}
			// 	// })

			// 	console.log(
			// 		'Cache updated with new rolesoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo'
			// 	)

			// 	// Перезапрос данных чатов после мутации
			// 	refetchChatrooms()
			// 		.then(() => {
			// 			console.log(
			// 				'Chatrooms refetchedoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo'
			// 			)
			// 		})
			// 		.catch(err => {
			// 			console.error(
			// 				'Error during refetching chatroomsoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
			// 				err
			// 			)
			// 		})
			// }
		})
	}

	const handleDemoteUsersToChatroom = async () => {
		console.log('Selected Users:', selectedUsers)

		// Фильтруем пользователей, чтобы оставить только валидные ID
		const validUserIds = selectedUsers.filter(
			userId => typeof userId === 'string' && userId.trim() !== ''
		)

		if (validUserIds.length === 0) {
			console.error('No valid user IDs')
			return
		}
		console.log('Valid User IDs:', validUserIds)

		// Получаем существующие ID пользователей в чате
		const existingUserIds = new Set(
			dataUsersOfChatroom?.getUsersOfChatroom?.map(user => user.id) || []
		)
		console.log('Existing User IDs in chat:', existingUserIds)

		// Фильтруем тех пользователей, которые уже существуют в чате
		const usersToDemote = validUserIds.filter(userId =>
			existingUserIds.has(userId)
		)
		console.log('Users to demote:', usersToDemote)

		if (usersToDemote.length === 0) {
			toast.warning('Нет пользователей для понижения')
			return
		}

		// Выполняем мутацию для понижения пользователей
		await demoteUsersRoles({
			variables: {
				data: {
					chatroomId: activeRoomId && parseInt(activeRoomId), // chatroomId как число
					targetUserIds: usersToDemote // usersToDemote - массив ID пользователей для понижения
				}
			},
			onCompleted: () => {
				toast.success('Пользователи успешно понижены')
				console.log('Users demoted successfully')
				setSelectedUsers([]) // Очищаем выбранных пользователей
				form.reset() // Сброс формы
				refetchChatrooms()
			},
			onError: (error: any) => {
				if (error.message.includes('Forbidden')) {
					toast.error('Вы не можете понизить этих пользователей')
				} else if (error.message.includes('BadRequest')) {
					toast.error('Некоторые пользователи не найдены в чате')
				} else {
					console.error('Error demoting users', error)
					toast.error('Ошибка при понижении пользователей')
				}
			}
			// 	update: (cache, { data }) => {
			// 		if (!data || !data.demoteUsers) {
			// 			console.log(
			// 				'No users were demotedoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo'
			// 			)
			// 			return
			// 		}

			// 		const demotedUsers = data.demoteUsers // Это список ID пользователей, которых понизили
			// 		console.log(
			// 			'Demoted Users:oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
			// 			demotedUsers
			// 		)

			// 		// Обновление ролей в кэше
			// 		cache.modify({
			// 			fields: {
			// 				getUsersOfChatroom(existingUsers = [], { readField }) {
			// 					const updatedUsers = existingUsers.map(
			// 						(user: any) => {
			// 							if (demotedUsers.includes(user.id)) {
			// 								console.log(
			// 									`Updating user ${user.id} role to ${user.role}`
			// 								)
			// 								return {
			// 									...user,
			// 									role:
			// 										user.role === 'ADMIN'
			// 											? 'MODERATOR'
			// 											: user.role === 'MODERATOR'
			// 												? 'USER'
			// 												: user.role // понижаем админов до модераторов и модераторов до пользователей
			// 								}
			// 							}
			// 							return user
			// 						}
			// 					)

			// 					return updatedUsers
			// 				}
			// 			}
			// 		})

			// 		console.log(
			// 			'Cache updated with new rolesoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo'
			// 		)

			// 		// Перезапрос данных чатов после мутации
			// 		refetchChatrooms()
			// 			.then(() => {
			// 				console.log(
			// 					'Chatrooms refetchedoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo'
			// 				)
			// 			})
			// 			.catch(err => {
			// 				console.error(
			// 					'Error during refetching chatroomsoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
			// 					err
			// 				)
			// 			})
			// 	}
		})
	}

	const plsh = <span className='text-white'>Название чата</span>
	const plsh2 = <span className='text-white'>Выберите участников</span>

	return (
		<div className='h-24 w-24'>
			<ConfirmDialog />
			<Dialog>
				<DialogTrigger asChild>
					<Button
						className={` ${isMobile ? 'ml-[10px]' : ''} wmmmm-auto mmmmoverflow-hidden pmmmx-2 bg-transparent text-sm font-semibold`}
					>
						{!isMobile && <span className='truncate'>{title}</span>}
						<FaChevronDown className='ml-2 size-2.5' />
					</Button>
				</DialogTrigger>
				<DialogContent
					className={` ${isMobile ? 'w-[350px]' : ''} overflow-hidden border-[3px] border-[#ecac21] bg-black p-0`}
				>
					<DialogHeader className='border-b-[3px] border-b-[#ecac21] bg-black p-4'>
						<DialogTitle className='text-white'>
							{title}
						</DialogTitle>
					</DialogHeader>
					<div className='flex flex-col gap-y-2 bg-black px-4 pb-4'>
						<Dialog open={editOpen} onOpenChange={handleEditOpen}>
							<DialogTrigger asChild>
								<div className='cursor-pointer rounded-lg border bg-black px-5 py-4 hover:bg-[#ecac21]'>
									<div className='flex items-center justify-between'>
										<p className='text-sm font-semibold text-white'>
											Имя чата
										</p>
										<p className='text-sm font-semibold text-[#1264A3] hover:underline'>
											Изменить
										</p>
									</div>
									<p className='text-sm'>{title}</p>
								</div>
							</DialogTrigger>
							<DialogContent
								className={` ${isMobile ? 'w-[350px]' : 'h-[220px]'} border-[3px] border-[#ecac21]`}
							>
								<DialogHeader>
									<DialogTitle>Переименуйте чат</DialogTitle>
								</DialogHeader>
								<form
									onSubmit={form.handleSubmit(handleSubmit)}
									className='space-y-4'
								>
									<Input
										{...form.register('name')} // Привязываем значение к react-hook-form
										disabled={isLoadingUpdate}
										required
										autoFocus
										minLength={3}
										maxLength={80}
										placeholder='Имя чата'
									/>
									<DialogFooter className='gap-x-3 gap-y-3 pt-2'>
										<DialogClose asChild>
											<Button
												variant='outline'
												disabled={isLoadingUpdate}
											>
												Отменить
											</Button>
										</DialogClose>
										<Button
											disabled={
												isLoadingUpdate ||
												!form.formState.isValid
											} // Проверка валидности формы
										>
											Сохранить
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
						<Dialog
							open={membersEditOpen}
							onOpenChange={handleMembersEditOpen}
						>
							<div className='hoverhh:bg-[#ecac21] cursor-pointer rounded-lg border bg-black px-5 py-4'>
								<div className='flex items-center justify-between'>
									<p className='text-sm font-semibold text-white'>
										Участники
									</p>
									<div className='flex flex-col'>
										<DialogTrigger asChild>
											<p className='text-sm font-semibold text-[#1264A3] hover:underline'>
												Добавить
											</p>
										</DialogTrigger>
										{activeChatroom?.ChatroomUsers &&
											activeChatroom?.ChatroomUsers?.some(
												(chatroomUser: any) =>
													chatroomUser.user.id ===
														currentUserId &&
													chatroomUser.role ===
														'ADMIN'
											) && (
												<Dialog
													open={membersPromoteOpen}
													onOpenChange={
														handleMembersPromoteOpen
													}
												>
													{/* <div className='hoverhh:bg-[#ecac21] cursor-pointer rounded-lg border bg-black px-5 py-4'> */}
													{/* <div className='flex items-center justify-between'>
									<p className='text-sm font-semibold text-white'>
										Удалить участников
									</p> */}
													<DialogTrigger asChild>
														<p className='text-sm font-semibold text-[#1264A3] hover:underline'>
															Повысить
														</p>
													</DialogTrigger>
													{/* </div> */}
													{/* <div className='text-sm text-white'> */}
													{/* Здесь отображаются участники для удаления */}
													{/* </div> */}
													{/* </div> */}
													<DialogContent
														className={` ${isMobile ? 'w-[350px]' : 'h-[220px]'} border-[3px] border-[#ecac21]`}
													>
														<DialogHeader>
															<DialogTitle>
																Повысьте статус
																участников чата
															</DialogTitle>
														</DialogHeader>
														{/* Здесь будет форма для удаления участников */}
														<MultiSelect
															onSearchChange={
																handleSearchChange
															}
															nothingFound='Ничего не найдено'
															searchable
															pb={'xl'}
															data={selectItems}
															label={plsh2}
															placeholder='Найдите учатников чата по имени'
															onChange={values =>
																setSelectedUsers(
																	values
																)
															}
															styles={{
																input: {
																	backgroundColor:
																		'#1A1B1E', // Черный фон для input
																	color: '#ccc', // Серый текст
																	borderColor:
																		'#444', // Темно-серые границы
																	borderRadius:
																		'6px', // Закругленные углы
																	paddingLeft:
																		'12px', // Отступ слева для текста
																	paddingRight:
																		'12px' // Отступ справа для текста
																},
																dropdown: {
																	backgroundColor:
																		'#1A1B1E', // Черный фон для выпадающего списка
																	borderRadius:
																		'6px', // Закругленные углы
																	borderColor:
																		'#444' // Темно-серые границы
																},
																item: {
																	backgroundColor:
																		'#1A1B1E', // Черный фон для элементов
																	color: '#ccc', // Серый цвет текста в элементах
																	'&[data-selected]':
																		{
																			backgroundColor:
																				'#444', // Темно-серый фон для выбранных элементов
																			color: 'white' // Белый текст для выбранных элементов
																		},
																	'&[data-hovered]':
																		{
																			backgroundColor:
																				'#333' // Тень на элементах при наведении
																		}
																},
																label: {
																	color: '#ccc', // Серый цвет для лейбла
																	marginBottom:
																		'8px' // Отступ снизу
																}
															}}
														/>
														{selectedUsers.length >
															0 && (
															<Button
																onClick={() =>
																	handlePromoteUsersToChatroom()
																}
															>
																Повысить
																участников
															</Button>
														)}
													</DialogContent>
												</Dialog>
											)}
										{activeChatroom?.ChatroomUsers &&
											activeChatroom?.ChatroomUsers?.some(
												(chatroomUser: any) =>
													chatroomUser.user.id ===
														currentUserId &&
													chatroomUser.role ===
														'ADMIN'
											) && (
												<Dialog
													open={membersDemoteOpen}
													onOpenChange={
														handleMembersDemoteOpen
													}
												>
													{/* <div className='hoverhh:bg-[#ecac21] cursor-pointer rounded-lg border bg-black px-5 py-4'> */}
													{/* <div className='flex items-center justify-between'>
									<p className='text-sm font-semibold text-white'>
										Удалить участников
									</p> */}
													<DialogTrigger asChild>
														<p className='text-sm font-semibold text-[#1264A3] hover:underline'>
															Понизить
														</p>
													</DialogTrigger>
													{/* </div> */}
													{/* <div className='text-sm text-white'> */}
													{/* Здесь отображаются участники для удаления */}
													{/* </div> */}
													{/* </div> */}
													<DialogContent
														className={` ${isMobile ? 'w-[350px]' : 'h-[220px]'} border-[3px] border-[#ecac21]`}
													>
														<DialogHeader>
															<DialogTitle>
																Понизьте статус
																участников чата
															</DialogTitle>
														</DialogHeader>
														{/* Здесь будет форма для удаления участников */}
														<MultiSelect
															onSearchChange={
																handleSearchChange
															}
															nothingFound='Ничего не найдено'
															searchable
															pb={'xl'}
															data={selectItems}
															label={plsh2}
															placeholder='Найдите учатников чата по имени'
															onChange={values =>
																setSelectedUsers(
																	values
																)
															}
															styles={{
																input: {
																	backgroundColor:
																		'#1A1B1E', // Черный фон для input
																	color: '#ccc', // Серый текст
																	borderColor:
																		'#444', // Темно-серые границы
																	borderRadius:
																		'6px', // Закругленные углы
																	paddingLeft:
																		'12px', // Отступ слева для текста
																	paddingRight:
																		'12px' // Отступ справа для текста
																},
																dropdown: {
																	backgroundColor:
																		'#1A1B1E', // Черный фон для выпадающего списка
																	borderRadius:
																		'6px', // Закругленные углы
																	borderColor:
																		'#444' // Темно-серые границы
																},
																item: {
																	backgroundColor:
																		'#1A1B1E', // Черный фон для элементов
																	color: '#ccc', // Серый цвет текста в элементах
																	'&[data-selected]':
																		{
																			backgroundColor:
																				'#444', // Темно-серый фон для выбранных элементов
																			color: 'white' // Белый текст для выбранных элементов
																		},
																	'&[data-hovered]':
																		{
																			backgroundColor:
																				'#333' // Тень на элементах при наведении
																		}
																},
																label: {
																	color: '#ccc', // Серый цвет для лейбла
																	marginBottom:
																		'8px' // Отступ снизу
																}
															}}
														/>
														{selectedUsers.length >
															0 && (
															<Button
																onClick={() =>
																	handleDemoteUsersToChatroom()
																}
															>
																Понизить
																участников
															</Button>
														)}
													</DialogContent>
												</Dialog>
											)}
										{activeChatroom?.ChatroomUsers &&
											activeChatroom?.ChatroomUsers?.some(
												(chatroomUser: any) =>
													chatroomUser.user.id ===
														currentUserId &&
													chatroomUser.role ===
														'ADMIN'
											) && (
												<Dialog
													open={membersDeleteOpen}
													onOpenChange={
														handleMembersDeleteOpen
													}
												>
													{/* <div className='hoverhh:bg-[#ecac21] cursor-pointer rounded-lg border bg-black px-5 py-4'> */}
													{/* <div className='flex items-center justify-between'>
									<p className='text-sm font-semibold text-white'>
										Удалить участников
									</p> */}
													<DialogTrigger asChild>
														<p className='text-sm font-semibold text-rose-600 hover:underline'>
															Исключить
														</p>
													</DialogTrigger>
													{/* </div> */}
													{/* <div className='text-sm text-white'> */}
													{/* Здесь отображаются участники для удаления */}
													{/* </div> */}
													{/* </div> */}
													<DialogContent
														className={` ${isMobile ? 'w-[350px]' : 'h-[220px]'} border-[3px] border-[#ecac21]`}
													>
														<DialogHeader>
															<DialogTitle>
																Удалите
																участников
															</DialogTitle>
														</DialogHeader>
														{/* Здесь будет форма для удаления участников */}
														<MultiSelect
															onSearchChange={
																handleSearchChange
															}
															nothingFound='Ничего не найдено'
															searchable
															pb={'xl'}
															data={selectItems}
															label={plsh2}
															placeholder='Найдите учатников чата по имени'
															onChange={values =>
																setSelectedUsers(
																	values
																)
															}
															styles={{
																input: {
																	backgroundColor:
																		'#1A1B1E', // Черный фон для input
																	color: '#ccc', // Серый текст
																	borderColor:
																		'#444', // Темно-серые границы
																	borderRadius:
																		'6px', // Закругленные углы
																	paddingLeft:
																		'12px', // Отступ слева для текста
																	paddingRight:
																		'12px' // Отступ справа для текста
																},
																dropdown: {
																	backgroundColor:
																		'#1A1B1E', // Черный фон для выпадающего списка
																	borderRadius:
																		'6px', // Закругленные углы
																	borderColor:
																		'#444' // Темно-серые границы
																},
																item: {
																	backgroundColor:
																		'#1A1B1E', // Черный фон для элементов
																	color: '#ccc', // Серый цвет текста в элементах
																	'&[data-selected]':
																		{
																			backgroundColor:
																				'#444', // Темно-серый фон для выбранных элементов
																			color: 'white' // Белый текст для выбранных элементов
																		},
																	'&[data-hovered]':
																		{
																			backgroundColor:
																				'#333' // Тень на элементах при наведении
																		}
																},
																label: {
																	color: '#ccc', // Серый цвет для лейбла
																	marginBottom:
																		'8px' // Отступ снизу
																}
															}}
														/>
														{selectedUsers.length >
															0 && (
															<Button
																onClick={() =>
																	handleRemoveUsersFromChatroom()
																}
															>
																Удалить
																участников
															</Button>
														)}
													</DialogContent>
												</Dialog>
											)}
									</div>
								</div>
								<div className='text-sm text-white'>
									{/* {dataUsersOfChatroom?.getUsersOfChatroom && (
													<div className='mt-[-20px]'>
														<OverlappingAvatars
															users={
																dataUsersOfChatroom.getUsersOfChatroom
															}
														/>
													</div>
												)} */}
									{dataUsersOfChatroom?.getUsersOfChatroom.map(
										(user: any) => {
											// Получаем аватар, если он есть, или первую букву имени
											const avatarSrc = user.avatar
												? getMediaSource(user.avatar)
												: user.username?.[0]?.toUpperCase() ||
													'U' // Используем первую букву имени, если аватарка отсутствует
											// const isAdmin =
											// 	activeChatroom?.ChatroomUsers?.some(
											// 		(chatroomUser: any) =>
											// 			chatroomUser.user.id ===
											// 				user.id &&
											// 			chatroomUser.role ===
											// 				'ADMIN'
											// 	)
											// const isModerator =
											// 	activeChatroom?.ChatroomUsers?.some(
											// 		(chatroomUser: any) =>
											// 			chatroomUser.user.id ===
											// 				user.id &&
											// 			chatroomUser.role ===
											// 				'MODERATOR'
											// 	)
											const isAdmin =
												chatroomsDataFromQuery?.getChatroomsForUser?.some(
													chatroom =>
														chatroom.ChatroomUsers?.some(
															(
																chatroomUser: any
															) =>
																chatroomUser
																	.user.id ===
																	user.id &&
																chatroomUser.role ===
																	'ADMIN'
														)
												)

											const isModerator =
												chatroomsDataFromQuery?.getChatroomsForUser?.some(
													chatroom =>
														chatroom.ChatroomUsers?.some(
															(
																chatroomUser: any
															) =>
																chatroomUser
																	.user.id ===
																	user.id &&
																chatroomUser.role ===
																	'MODERATOR'
														)
												)
											return (
												<div
													key={user.id}
													className='flex items-center gap-2'
												>
													{typeof avatarSrc ===
														'string' &&
													avatarSrc.length === 1 ? (
														<div className='flex h-6 w-6 items-center justify-center rounded-full bg-[#3a4050] text-xs text-white'>
															{avatarSrc}
														</div>
													) : (
														<Image
															src={avatarSrc}
															width={24} // Указываем ширину
															height={24}
															alt={
																user.username ||
																'User Avatar'
															}
															className='h-6 w-6 rounded-full'
															onError={e =>
																(e.currentTarget.src =
																	'/logos/beeavatar.jpg')
															}
														/>
													)}
													<span>
														{user.username}{' '}
														{isAdmin && (
															<span className='text-xs font-semibold text-[#1264A3]'>
																(Админ)
															</span>
														)}
														{isModerator && (
															<span className='text-xs font-semibold text-[#8caac0]'>
																(Модератор)
															</span>
														)}
													</span>
												</div>
											)
										}
									)}
								</div>
							</div>
							<DialogContent
								className={` ${isMobile ? 'w-[350px]' : 'h-[220px]'} border-[3px] border-[#ecac21]`}
							>
								<DialogHeader>
									<DialogTitle>
										Добавьте участников
									</DialogTitle>
								</DialogHeader>
								<MultiSelect
									onSearchChange={handleSearchChange}
									nothingFound='Ничего не найдено'
									searchable
									pb={'xl'}
									data={selectItems}
									label={plsh2}
									placeholder='Найдите учатников чата по имени'
									onChange={values =>
										setSelectedUsers(values)
									}
									styles={{
										input: {
											backgroundColor: '#1A1B1E', // Черный фон для input
											color: '#ccc', // Серый текст
											borderColor: '#444', // Темно-серые границы
											borderRadius: '6px', // Закругленные углы
											paddingLeft: '12px', // Отступ слева для текста
											paddingRight: '12px' // Отступ справа для текста
										},
										dropdown: {
											backgroundColor: '#1A1B1E', // Черный фон для выпадающего списка
											borderRadius: '6px', // Закругленные углы
											borderColor: '#444' // Темно-серые границы
										},
										item: {
											backgroundColor: '#1A1B1E', // Черный фон для элементов
											color: '#ccc', // Серый цвет текста в элементах
											'&[data-selected]': {
												backgroundColor: '#444', // Темно-серый фон для выбранных элементов
												color: 'white' // Белый текст для выбранных элементов
											},
											'&[data-hovered]': {
												backgroundColor: '#333' // Тень на элементах при наведении
											}
										},
										label: {
											color: '#ccc', // Серый цвет для лейбла
											marginBottom: '8px' // Отступ снизу
										}
									}}
								/>
								{selectedUsers.length > 0 && (
									<Button
										onClick={() =>
											handleAddUsersToChatroom()
										}
									>
										Добавить участников
									</Button>
								)}
							</DialogContent>
						</Dialog>

						{/* Окно удаления участников */}

						{activeChatroom?.ChatroomUsers &&
							activeChatroom?.ChatroomUsers?.some(
								(chatroomUser: any) =>
									chatroomUser.user.id === currentUserId &&
									chatroomUser.role === 'ADMIN'
							) && (
								<button
									onClick={handleDelete}
									className='flex cursor-pointer items-center gap-x-2 rounded-lg border bg-black px-5 py-4 text-rose-600 hover:bg-[#ecac21] hover:bg-destructive/20'
								>
									<TrashIcon className='size-4' />
									<p className='text-sm font-semibold'>
										Удалить чат
									</p>
								</button>
							)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
