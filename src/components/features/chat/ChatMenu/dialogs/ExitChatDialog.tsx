import { gql, useMutation, useQuery } from '@apollo/client'
import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/common/Button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/common/Dialog'

import { GetChatroomsForUserQuery } from '@/graphql/generated/output'

import { REMOVE_USERS_FROM_CHATROOM } from '../mutations'
import { GET_CHATROOMS_FOR_USER } from '../queries'

interface ExitChatDialogProps {
	activeRoomId: string | null | undefined
	currentUserId: string | null
	isAdminExit: boolean
	onUpdateChatroomsDataToFalse: () => void
}

export default function ExitChatDialog({
	activeRoomId,
	currentUserId,
	isAdminExit,
	onUpdateChatroomsDataToFalse
}: ExitChatDialogProps) {
	const [isOpen, setIsOpen] = useState(false)

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
				toast.success('Чат успешно удален')
			}
		}
	)

	const [removeUsersFromChatroomMutation] = useMutation(
		REMOVE_USERS_FROM_CHATROOM,
		{
			onCompleted: async () => {
				console.log('Users removed successfully')
			},
			onError: error => {
				console.error('Error removing users:', error)
			}
		}
	)
	const { data: chatroomsDataFromQuery } = useQuery<GetChatroomsForUserQuery>(
		GET_CHATROOMS_FOR_USER,
		{
			variables: { userId: currentUserId },
			fetchPolicy: 'network-only'
		}
	)

	const handleExitConfirm = async () => {
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
		setIsOpen(false)
	}
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
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<div className='flex items-center'>
					<Button className='focuskkk:outline-none focuskkk:ring-2 focuskkk:ring-gray-300 w-full rounded-lg border-[1px] bg-black text-red-600 transition-colors duration-300 hover:border-[1.5px] hover:border-[#ff9900] hover:bg-[#1a1a1a] hover:text-[#ecac21]'>
						<LogOut /> Выйти из чата
					</Button>
				</div>
			</DialogTrigger>
			<DialogContent className='overflow-hidden rounded-xl border-[3px] border-[#ecac21] bg-black p-0'>
				<DialogHeader className='border-b-none bordermm-b-[3px] bg-black p-4'>
					<DialogTitle>Выход из комнаты</DialogTitle>
				</DialogHeader>
				<div className='flex flex-col gap-y-2 bg-black px-4 pb-4'>
					<p className='text-sm text-white'>
						{isAdminExit
							? 'Убедитесь, что в чате есть другие администраторы, иначе чат будет удален.'
							: 'Вы уверены, что хотите выйти из комнаты?'}
					</p>
					<DialogFooter className='gap-x-3 gap-y-3 pt-2'>
						<Button
							onClick={() => setIsOpen(false)}
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
				</div>
			</DialogContent>
		</Dialog>
	)
}
