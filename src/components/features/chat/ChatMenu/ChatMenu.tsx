import { gql, useMutation } from '@apollo/client'
import { useMediaQuery } from '@mantine/hooks'
import { LogOut, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { toast } from 'sonner'

import { Button } from '@/components/ui/common/Button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/common/Dialog'

import { useConfirm } from '@/hooks/useConfirm'

import EditChatNameDialog from './dialogs/EditChatNameDialog'
import ExitChatDialog from './dialogs/ExitChatDialog'
import ManageMembersDialog from './dialogs/ManageMembersDialog'
import { DELETE_CHATROOM } from './mutations'
import { GET_CHATROOMS_FOR_USER } from './queries'

// import { HeaderProps } from './types'

export const ChatMenu = (
	{
		title,
		activeRoomId,
		currentUserId,
		chatroomsData,
		onUpdateChatroomsDataToFalse
	}: any
	//  HeaderProps
) => {
	const [editOpen, setEditOpen] = useState(false)
	const [membersEditOpen, setMembersEditOpen] = useState(false)
	const isMobile = useMediaQuery('(max-width: 768px)')
	const [ConfirmDialog, confirm] = useConfirm(
		'Вы уверены, что хотите удалить чат?',
		'Это действие нельзя будет отменить.'
	)

	const activeChatroom =
		chatroomsData?.id === activeRoomId ? chatroomsData : null
	console.log(
		'activeChatroomLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
		activeChatroom
	)
	console.log(
		'chatroomsDatakgooooovpokkkkkkkkkkKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
		chatroomsData
	)
	const handleEditOpen = (value: boolean) => {
		setEditOpen(value)
	}

	const handleMembersEditOpen = (value: boolean) => {
		setMembersEditOpen(value)
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
				toast.success('Чат успешно удален')
			}
		}
	)

	const handleDelete = async () => {
		const ok = await confirm()
		if (!ok) return
		deleteChatroom()

		onUpdateChatroomsDataToFalse()
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
						<EditChatNameDialog
							editOpen={editOpen}
							onEditOpenChange={handleEditOpen}
							activeRoomId={activeRoomId}
							title={title}
						/>

						<ManageMembersDialog
							membersEditOpen={membersEditOpen}
							onMembersEditOpenChange={handleMembersEditOpen}
							activeRoomId={activeRoomId}
							currentUserId={currentUserId}
							// chatroomsData={chatroomsData}
						/>

						<ExitChatDialog
							activeRoomId={activeRoomId}
							currentUserId={currentUserId}
							isAdminExit={isAdminExit}
							onUpdateChatroomsDataToFalse={
								onUpdateChatroomsDataToFalse
							}
						/>

						{activeChatroom?.ChatroomUsers &&
							activeChatroom?.ChatroomUsers?.some(
								(chatroomUser: any) =>
									chatroomUser.user.id === currentUserId &&
									chatroomUser.role === 'ADMIN'
							) && (
								<Button
									className='focuskkk:outline-none focuskkk:ring-2 focuskkk:ring-gray-300 w-full rounded-lg border-[1px] bg-black text-red-600 transition-colors duration-300 hover:border-[1.5px] hover:border-[#ff9900] hover:bg-[#1a1a1a] hover:text-[#ecac21]'
									onClick={handleDelete}
								>
									<TrashIcon className='size-4' />
									<p className='text-sm font-semibold'>
										Удалить чат
									</p>
								</Button>
							)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
