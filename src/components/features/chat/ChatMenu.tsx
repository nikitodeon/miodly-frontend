import { gql, useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { TrashIcon } from 'lucide-react'
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

import { useChangeChatNameMutation } from '@/graphql/generated/output'

import { useConfirm } from '@/hooks/useConfirm'

import {
	TypeChangeNameSchema,
	changeNameSchema
} from '@/schemas/chat/change-name.schema'

interface HeaderProps {
	title: string | null | undefined
	activeRoomId: string | null | undefined
	userId: string | null
	chatroomsData: any
	onUpdateChatroomsDataToFalse: any
	// Добавляем новый пропс
}

export const ChatMenu = ({
	title,
	activeRoomId,
	userId,
	chatroomsData,
	onUpdateChatroomsDataToFalse // Получаем callback
}: HeaderProps) => {
	const [editOpen, setEditOpen] = useState(false)

	const [ConfirmDialog, confirm] = useConfirm(
		'Delete this channel ?',
		'You are about to delete this channel. This action is irreversible'
	)
	const activeChatroom = chatroomsData?.getChatroomsForUser?.find(
		(chatroom: any) => chatroom.id === activeRoomId
	)

	const handleEditOpen = (value: boolean) => {
		setEditOpen(value)
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

	// Выводим в консоль состояние формы, чтобы понять, что происходит
	// useEffect(() => {
	// 	console.log('Form is valid:', form.formState.isValid)
	// 	console.log('Form state:', form.formState)
	// }, [form.formState])

	return (
		<div className='h-24 w-24'>
			<ConfirmDialog />
			<Dialog>
				<DialogTrigger asChild>
					<Button className='wmmmm-auto mmmmoverflow-hidden pmmmx-2 bg-transparent text-sm font-semibold'>
						<span className='truncate'>{title}</span>
						<FaChevronDown className='ml-2 size-2.5' />
					</Button>
				</DialogTrigger>
				<DialogContent className='overflow-hidden bg-gray-50 p-0'>
					<DialogHeader className='border-b bg-white p-4'>
						<DialogTitle> {title}</DialogTitle>
					</DialogHeader>
					<div className='flex flex-col gap-y-2 px-4 pb-4'>
						<Dialog open={editOpen} onOpenChange={handleEditOpen}>
							<DialogTrigger asChild>
								<div className='cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50'>
									<div className='flex items-center justify-between'>
										<p className='text-sm font-semibold text-[#000000]'>
											Channel name
										</p>
										<p className='text-sm font-semibold text-[#1264A3] hover:underline'>
											Edit
										</p>
									</div>
									<p className='text-sm'>{title}</p>
								</div>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>
										Rename this channel
									</DialogTitle>
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
										placeholder='e.g. plan-budget'
									/>
									<DialogFooter>
										<DialogClose asChild>
											<Button
												variant='outline'
												disabled={isLoadingUpdate}
											>
												Cancel
											</Button>
										</DialogClose>
										<Button
											disabled={
												isLoadingUpdate ||
												!form.formState.isValid
											} // Проверка валидности формы
										>
											Save
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>

						{activeChatroom?.ChatroomUsers &&
							activeChatroom?.ChatroomUsers?.some(
								(chatroomUser: any) =>
									chatroomUser.user.id === userId &&
									chatroomUser.role === 'ADMIN'
							) && (
								<button
									onClick={handleDelete}
									className='flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 hover:bg-destructive/20'
								>
									<TrashIcon className='size-4' />
									<p className='text-sm font-semibold'>
										Delete channel
									</p>
								</button>
							)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
