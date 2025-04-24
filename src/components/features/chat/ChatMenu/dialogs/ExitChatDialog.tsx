import { useMutation } from '@apollo/client'
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

import { DELETE_CHATROOM, REMOVE_USERS_FROM_CHATROOM } from '../mutations'

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
	const [removeUsers] = useMutation(REMOVE_USERS_FROM_CHATROOM)
	const [deleteChatroom] = useMutation(DELETE_CHATROOM)

	const handleExitConfirm = async () => {
		try {
			if (isAdminExit) {
				await deleteChatroom({
					variables: {
						chatroomId: parseFloat(activeRoomId ?? '0')
					}
				})
			} else {
				await removeUsers({
					variables: {
						chatroomId: parseInt(activeRoomId ?? '0'),
						userIds: [currentUserId]
					}
				})
			}
			toast.success(
				isAdminExit ? 'Чат успешно удален' : 'Вы успешно вышли из чата'
			)
			onUpdateChatroomsDataToFalse()
			setIsOpen(false)
		} catch (error) {
			toast.error('Ошибка при выполнении действия')
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<div className='flex items-center'>
					<Button className='focuskkk:outline-none focuskkk:ring-2 focuskkk:ring-gray-300 w-full rounded-lg border border-[#384252] bg-transparent px-4 py-2 text-red-600 transition-all hover:bg-[#ecac21] hover:text-gray-900'>
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
