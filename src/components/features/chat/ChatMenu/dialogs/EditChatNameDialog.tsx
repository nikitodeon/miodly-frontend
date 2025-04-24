import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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

import {
	TypeChangeNameSchema,
	changeNameSchema
} from '@/schemas/chat/change-name.schema'

interface EditChatNameDialogProps {
	editOpen: boolean
	onEditOpenChange: (value: boolean) => void
	activeRoomId: string | null | undefined
	title: string | null | undefined
}

export default function EditChatNameDialog({
	editOpen,
	onEditOpenChange,
	activeRoomId,
	title
}: EditChatNameDialogProps) {
	const form = useForm<TypeChangeNameSchema>({
		resolver: zodResolver(changeNameSchema),
		defaultValues: {
			name: title || ''
		}
	})

	const [update, { loading: isLoadingUpdate }] = useChangeChatNameMutation({
		onCompleted() {
			toast.success('Channel name updated successfully')
		},
		onError(err) {
			toast.error('Error updating channel name')
			console.error('Error updating channel name:', err)
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
		<Dialog open={editOpen} onOpenChange={onEditOpenChange}>
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
			<DialogContent className='h-[220px] rounded-xl border-[3px] border-[#ecac21]'>
				<DialogHeader>
					<DialogTitle>Переименуйте чат</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className='space-y-4'
				>
					<Input
						{...form.register('name')}
						disabled={isLoadingUpdate}
						required
						autoFocus
						minLength={3}
						maxLength={30}
						placeholder='Имя чата'
					/>
					<DialogFooter className='gap-x-3 gap-y-3 pt-2'>
						<DialogClose asChild>
							<Button
								className='bg-gray-500 px-4 py-2 text-white hover:bg-gray-600'
								disabled={isLoadingUpdate}
							>
								Отменить
							</Button>
						</DialogClose>
						<Button
							disabled={
								isLoadingUpdate || !form.formState.isValid
							}
							className='bg-[#ecac21] px-4 py-2 text-black hover:bg-[#d09e17]'
						>
							Сохранить
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
