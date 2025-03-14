import { gql, useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMediaQuery } from '@mantine/hooks'
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

						{activeChatroom?.ChatroomUsers &&
							activeChatroom?.ChatroomUsers?.some(
								(chatroomUser: any) =>
									chatroomUser.user.id === userId &&
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
