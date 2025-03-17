import { gql, useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { MultiSelect } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Modal } from 'antd'
import { LogOut, TrashIcon } from 'lucide-react'
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

// Подключаем антовскую модалку

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
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [modalContent, setModalContent] = useState({
		title: '',
		description: '',
		onConfirm: () => {}
	})

	const showModal = (
		title: string,
		description: string,
		onConfirm: () => void
	) => {
		setModalContent({ title, description, onConfirm })
		setIsModalVisible(true)
	}
	// const [ConfirmDialog2, confirm2] = useConfirm(
	// 	'Вы уверены, что хотите выйти из чата?',
	// 	''
	// )
	// const [ConfirmDialog3, confirm3] = useConfirm(
	// 	'Убедитесь, что в чате есть другой администратор!',
	// 	'При выходе единственного администратора чат будет удален безвозвратно.'
	// )
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
				console.log(
					'Chat deleted successfully,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,'
				)
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

	const handleLeaveChatroom = async () => {
		console.log('Выход из чата, текущий ID:', currentUserId)

		if (!activeRoomId) {
			toast.error('Ошибка: чат не найден')
			return
		}

		// Получаем текущий чат
		const currentChatroom =
			chatroomsDataFromQuery?.getChatroomsForUser.find(
				chat => chat.id === activeRoomId
			)

		if (!currentChatroom) {
			toast.error('Ошибка: данные чата не найдены')
			return
		}
		handleExit()
		// Проверяем, является ли текущий пользователь админом
		// const currentUserRole = currentChatroom.ChatroomUsers?.find(
		// 	chatUser => chatUser.user.id === currentUserId
		// )?.role

		// const remainingAdmins = currentChatroom.ChatroomUsers?.filter(
		// 	chatUser =>
		// 		chatUser.role === 'ADMIN' && chatUser.user.id !== currentUserId
		// )

		// const isLastAdminLeaving = remainingAdmins?.length === 0
		// Окно подтверждения в зависимости от роли

		// if (currentUserRole === 'ADMIN') {
		// 	showModal(
		// 		'Вы уверены, что хотите выйти?',
		// 		isLastAdminLeaving
		// 			? 'Вы единственный админ, при выходе чат будет удалён!'
		// 			: 'Вы покинете чат, но чат останется, так как есть другие админы.',
		// 		handleExit
		// 	)
		// } else {
		// 	showModal(
		// 		'Вы уверены, что хотите выйти?',
		// 		'Вы покинете чат, но сможете снова присоединиться, если вас добавят.',
		// 		handleExit
		// 	)
		// }
	}

	// Функция для подтверждения выхода для админа

	// Функция для подтверждения выхода для обычного пользователя

	// Основная логика для выхода из чата
	const handleExit = async () => {
		// Получаем текущий чат снова, так как после подтверждения может быть изменено состояние
		const currentChatroom =
			chatroomsDataFromQuery?.getChatroomsForUser.find(
				chat => chat.id === activeRoomId
			)

		if (!currentChatroom) {
			toast.error('Ошибка: данные чата не найдены')
			return
		}

		// Проверяем, есть ли в чате админы (кроме текущего пользователя)
		const remainingAdmins = currentChatroom.ChatroomUsers?.filter(
			chatUser =>
				chatUser.role === 'ADMIN' && chatUser.user.id !== currentUserId
		)

		const isLastAdminLeaving = remainingAdmins?.length === 0
		if (isLastAdminLeaving) {
			console.log('Последний админ покинул чат, удаляем чат...')
			await deleteChatroom() // Удаляем чат
			onUpdateChatroomsDataToFalse()
		} else {
			// Просто удаляем себя из чата
			console.log('Выход из чата без удаления чата...')
			await removeUsersFromChatroomMutation({
				variables: {
					chatroomId: parseInt(activeRoomId ?? '0'),
					userIds: [currentUserId]
				},
				onCompleted: () => {
					onUpdateChatroomsDataToFalse()
					toast.success('Вы успешно вышли из чата')
					console.log('User left chat successfully')
				},
				onError: (error: any) => {
					toast.error('Ошибка при выходе из чата')
					console.error('Leave chat error:', error)
				},
				update: (cache, { data }) => {
					if (!data || !data.removeUsersFromChatroom) return
					// Обновляем кэш, убирая этот чат из списка чатов пользователя
					cache.modify({
						fields: {
							getChatroomsForUser(
								existingChats = [],
								{ readField }
							) {
								return existingChats.filter(
									(chat: any) =>
										readField('id', chat) !== activeRoomId
								)
							}
						}
					})
				}
			})
		}
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

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	// Условие для текста в диалоге (exit/удаление)

	// Обработчик открытия диалога
	const handleDialogOpen = () => setIsDialogOpen(true)
	// Обработчик закрытия диалога
	const handleDialogClose = () => setIsDialogOpen(false)

	// Логика для выполнения действия (выход или удаление)
	const handleExitConfirm = () => {
		handleLeaveChatroom()
		handleDialogClose()
	}
	const isAdminExit = activeChatroom?.ChatroomUsers?.some(
		(chatroomUser: any) =>
			chatroomUser.user.id === currentUserId &&
			chatroomUser.role === 'ADMIN'
	)
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
					className={` ${isMobile ? 'w-[350px]' : ''} overflow-hidden rounded-xl border-[3px] border-[#ecac21] bg-black p-0`}
				>
					<DialogHeader className='border-b-[3px] border-b-[#ecac21] bg-black p-4'>
						<DialogTitle className=''>{title}</DialogTitle>
					</DialogHeader>
					<div className='flex flex-col gap-y-2 bg-black px-4 pb-4'>
						<Dialog open={editOpen} onOpenChange={handleEditOpen}>
							<DialogTrigger asChild>
								<div className='group cursor-pointer rounded-lg border bg-black px-5 py-4 hover:bg-[#ecac21] hover:text-black'>
									<div className='flex items-center justify-between'>
										<p className='text-sm font-semibold text-white group-hover:text-black'>
											Имя чата
										</p>
										<p className='text-sm font-semibold text-[#1264A3] hover:text-black hover:underline group-hover:text-black'>
											Изменить
										</p>
									</div>
									<p className='text-sm text-white group-hover:text-black'>
										{title}
									</p>
								</div>
							</DialogTrigger>
							<DialogContent
								className={` ${isMobile ? 'w-[350px]' : 'h-[220px]'} rounded-xl border-[3px] border-[#ecac21]`}
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
												// variant='outline'
												className='bg-gray-500 px-4 py-2 text-white hover:bg-gray-600'
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
											className='bg-[#ecac21] px-4 py-2 text-black hover:bg-[#d09e17]'
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
														className={` ${isMobile ? 'w-[350px]' : 'h-[220px]'} rounded-xl border-[3px] border-[#ecac21]`}
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
																className='bg-[#ecac21] px-4 py-2 text-black hover:bg-[#d09e17]'
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
														className={` ${isMobile ? 'w-[350px]' : 'h-[220px]'} rounded-xl border-[3px] border-[#ecac21]`}
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
																className='bg-[#ecac21] px-4 py-2 text-black hover:bg-[#d09e17]'
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
													(chatroomUser.role ===
														'ADMIN' ||
														chatroomUser.role ===
															'MODERATOR')
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
														className={` ${isMobile ? 'w-[350px]' : 'h-[220px]'} rounded-xl border-[3px] border-[#ecac21]`}
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
																className='bg-[#ecac21] px-4 py-2 text-black hover:bg-[#d09e17]'
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
														chatroom.id ===
															activeRoomId && // 🔥 Проверяем только в нужном чате
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
														chatroom.id ===
															activeRoomId && // 🔥 Проверяем только в нужном чате
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
										className='bg-[#ecac21] px-4 py-2 text-black hover:bg-[#d09e17]'
										onClick={() =>
											handleAddUsersToChatroom()
										}
									>
										Добавить участников
									</Button>
								)}
							</DialogContent>
						</Dialog>

						{/* <Button
							className='rounded-lg border border-[#384252] bg-transparent px-4 py-2 text-red-600 transition-all hover:bg-[#ecac21] hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300'
							onClick={handleLeaveChatroom}
						>
							<LogOut /> Выйти из чата
						</Button>
						<span className='bg-black'>
							<Modal
								className='bg-black'
								title={modalContent.title}
								open={isModalVisible}
								onCancel={() => setIsModalVisible(false)}
								onOk={() => {
									modalContent.onConfirm()
									setIsModalVisible(false)
								}}
								okText={
									<span className='text-black'>Выйти</span>
								}
								cancelText='Отмена'
								style={{
									// backgroundColor: '#1e1e1e',
									// color: '#ffffff', //
									borderRadius: '10px', //
									width: '400px' //
								}}
								bodyStyle={{
									// backgroundColor: '#1e1e1e', //
									// color: '#ffffff', //
									fontSize: '16px' //
								}}
								//
							>
								<p>{modalContent.description}</p>
							</Modal>
						</span> */}
						{/* Окно удаления участников */}

						{/* <div className='h-24 w-24'> */}
						{/* Кнопка для открытия диалога */}

						<Dialog
							open={isDialogOpen}
							onOpenChange={setIsDialogOpen}
						>
							<DialogTrigger asChild>
								<div className='flex items-center'>
									<Button
										className='focuskkk:outline-none focuskkk:ring-2 focuskkk:ring-gray-300 w-full rounded-lg border border-[#384252] bg-transparent px-4 py-2 text-red-600 transition-all hover:bg-[#ecac21] hover:text-gray-900'
										// onClick={handleLeaveChatroom}
									>
										<LogOut /> Выйти из чата
									</Button>
								</div>
							</DialogTrigger>

							{/* Контент диалога */}
							<DialogContent
								className={`${isMobile ? 'w-[350px]' : ''} overflow-hidden rounded-xl border-[3px] border-[#ecac21] bg-black p-0`}
							>
								<DialogHeader className='border-b-none bordermm-b-[3px] bg-black p-4'>
									<DialogTitle>Выход из комнаты</DialogTitle>
								</DialogHeader>

								<div className='flex flex-col gap-y-2 bg-black px-4 pb-4'>
									<p className='text-sm text-white'>
										{isAdminExit
											? 'Убедитесь, что в чате есть другие администраторы, иначе чат будет удален.'
											: 'Вы уверены, что хотите выйти из комнаты?'}
									</p>

									{/* <div className='flex justify-end gap-2'> */}

									{/* Кнопки подтверждения и отмены */}
									<DialogFooter className='gap-x-3 gap-y-3 pt-2'>
										<Button
											onClick={handleDialogClose}
											className='rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600'
										>
											Отменить
										</Button>
										<Button
											onClick={handleExitConfirm}
											className='rounded-md bg-[#ecac21] px-4 py-2 text-black hover:bg-[#d09e17]'
										>
											Подтвердить
										</Button>
									</DialogFooter>
									{/* </div> */}
								</div>
							</DialogContent>
						</Dialog>
						{activeChatroom?.ChatroomUsers &&
							activeChatroom?.ChatroomUsers?.some(
								(chatroomUser: any) =>
									chatroomUser.user.id === currentUserId &&
									chatroomUser.role === 'ADMIN'
							) && (
								<Button
									className='focuskkk:ring-gray-300 focuskkk:outline-none focuskkk:ring-2 rounded-lg border border-[#384252] bg-transparent px-4 py-2 text-red-600 transition-all hover:bg-[#ecac21] hover:text-gray-900'
									onClick={handleDelete}
								>
									<TrashIcon className='size-4' />
									<p className='text-sm font-semibold'>
										Удалить чат
									</p>
								</Button>
							)}
					</div>
					{/* </div> */}
				</DialogContent>
			</Dialog>
		</div>
	)
}
