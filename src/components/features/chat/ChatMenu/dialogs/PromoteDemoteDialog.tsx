import { useMutation } from '@apollo/client'
import { MultiSelect } from '@mantine/core'
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

import { DEMOTE_USERS_ROLES, UPDATE_USERS_ROLES } from '../mutations'

interface PromoteDemoteDialogProps {
	type: 'promote' | 'demote'
	activeRoomId: string | null | undefined
	currentUserId: string | null
	selectedUsers: string[]
	setSelectedUsers: (users: string[]) => void
}

export default function PromoteDemoteDialog({
	type,
	activeRoomId,
	currentUserId,
	selectedUsers,
	setSelectedUsers
}: PromoteDemoteDialogProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [actionMutation] = useMutation(
		type === 'promote' ? UPDATE_USERS_ROLES : DEMOTE_USERS_ROLES
	)

	const plsh2 = <span className='text-white'>Выберите участников</span>

	const handleAction = async () => {
		const validUserIds = selectedUsers.filter(
			userId => typeof userId === 'string' && userId.trim() !== ''
		)

		if (validUserIds.length === 0) {
			toast.warning('Нет пользователей для действия')
			return
		}

		try {
			await actionMutation({
				variables: {
					data: {
						chatroomId: activeRoomId && parseInt(activeRoomId),
						targetUserIds: validUserIds
					}
				}
			})
			toast.success(
				`Пользователи успешно ${type === 'promote' ? 'повышены' : 'понижены'}`
			)
			setSelectedUsers([])
			setIsOpen(false)
		} catch (error: any) {
			if (error.message.includes('Forbidden')) {
				toast.error('Вы не можете выполнить это действие')
			} else {
				toast.error('Ошибка при выполнении действия')
			}
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<p className='text-sm font-semibold text-[#1264A3] hover:underline'>
					{type === 'promote' ? 'Повысить' : 'Понизить'}
				</p>
			</DialogTrigger>
			<DialogContent className='h-[220px] rounded-xl border-[3px] border-[#ecac21]'>
				<DialogHeader>
					<DialogTitle>
						{type === 'promote'
							? 'Повысьте статус участников чата'
							: 'Понизьте статус участников чата'}
					</DialogTitle>
				</DialogHeader>
				<MultiSelect
					nothingFound='Ничего не найдено'
					searchable
					pb={'xl'}
					data={[]} // Здесь должны быть данные пользователей
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
