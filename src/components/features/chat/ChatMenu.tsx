import { gql, useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { TrashIcon } from 'lucide-react'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaChevronDown } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/common/Button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/common/Dialog'
import { Input } from '@/components/ui/common/Input'

import { useConfirm } from '@/hooks/useConfirm'

import {
	TypeChangeNameSchema,
	changeNameSchema
} from '@/schemas/chat/change-name.schema'
import {
	TypeChangeEmailSchema,
	changeEmailSchema
} from '@/schemas/user/change-email.schema'

// import { useChannelId } from "@/hooks/use-channel-id";
// import { useWorkspaceId } from "@/hooks/use-workspace-id";

// import { useCurrentMember } from "@/features/members/api/use-current-member";
// import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
// import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";

interface HeaderProps {
	title: string | null | undefined
	activeRoomId: string | null | undefined
	userId: string | null
	chatroomsData: any
}

export const ChatMenu = ({
	title,
	activeRoomId,
	userId,
	chatroomsData
}: HeaderProps) => {
	const navigate = useNavigate()
	// const router = useRouter()
	//   const channelId = useChannelId();
	//   const workspaceId = useWorkspaceId();
	const [value, setValue] = useState(title)
	const [editOpen, setEditOpen] = useState(false)

	const [ConfirmDialog, confirm] = useConfirm(
		'Delete this channel ?',
		'You are about to delete this channel. This action is irreversible'
	)
	const activeChatroom = chatroomsData?.getChatroomsForUser?.find(
		(chatroom: any) => chatroom.id === activeRoomId
	)
	//   const { data: member } = useCurrentMember({ workspaceId });
	//   const { mutate: updateChannel, isPending: isUpdatingChannel } =
	//     useUpdateChannel();
	//   const { mutate: removeChannel, isPending: isRemovingChannel } =
	//     useRemoveChannel();

	const handleEditOpen = (value: boolean) => {
		// if (member?.role !== "admin") return;

		setEditOpen(value)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\s+/g, '-').toLowerCase()
		setValue(value)
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
			refetchQueries: [
				{
					query: gql`
						query getChatroomsForUser($userId: String!) {
							getChatroomsForUser(userId: $userId) {
								id
								name
							}
						}
					`,
					variables: {
						userId: userId
					}
				}
			],
			onCompleted: () => {
				window.location.reload()
				// redirect(`/?id=${activeRoomId}`)
			}
		}
	)

	const handleDelete = async () => {
		const ok = await confirm()
		if (!ok) return
		// e.preventDefault()
		deleteChatroom()
		//     , {
		// 	// onSuccess: () => {
		// 	//   toast.success("Channel deleted");
		// 	//   router.push(`/workspace/${workspaceId}`);
		// 	// },
		// 	onError: () => {
		// 		toast.error('Failed to delete channel')
		// 	}
		// }
		toast.success('Channel deleted')

		// removeChannel(
		//   { id: channelId },
		//   {
		//     onSuccess: () => {
		//       toast.success("Channel deleted");
		//       router.push(`/workspace/${workspaceId}`);
		//     },
		//     onError: () => {
		//       toast.error("Failed to delete channel");
		//     },
		//   }
		// );
	}
	const chatName = activeChatroom?.name

	const form = useForm<TypeChangeNameSchema>({
		resolver: zodResolver(changeNameSchema),
		values: {
			name: chatName
		}
	})

	// const [update, { loading: isLoadingUpdate }] = useChangeNameMutation({
	// 		onCompleted() {
	// 			// refetch()
	// 			toast.success(('successMessage'))
	// 		},
	// 		onError() {
	// 			toast.error(('errorMessage'))
	// 		}
	// 	})

	// 	// const { isValid, isDirty } = form.formState

	// 	function onSubmit(data: TypeChangeEmailSchema) {
	// 		update({ variables: { data } })
	// 	}
	//

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		// updateChannel(
		// 	{ id: channelId, name: value },
		// 	{
		// 		onSuccess: () => {
		// 			toast.success('Channel updated')
		// 			setEditOpen(false)
		// 		},
		// 		onError: () => {
		// 			toast.error('Failed to update channel')
		// 		}
		// 	}
		// )
	}

	console.log(
		'activeChatroomvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv',
		activeChatroom
	)
	console.log('activeRoomId', activeRoomId)
	console.log('chatroomsData', chatroomsData)
	console.log(
		'chatroomsData?.getChatroomsForUser',
		chatroomsData?.getChatroomsForUser
	)
	console.log('userId', userId)
	// console.log('activeChatroom.users[0]?.id', activeChatroom.users[0].id) //
	// console.log('activeChatroom.users[0]?.id', activeChatroom.users) //эти две сторочки без перезагрузки дают данный а после перезагрузки Error: Cannot read properties of undefined (reading 'users')

	return (
		<div
			// className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden"
			className='h-24 w-24'
		>
			<ConfirmDialog />
			<Dialog>
				<DialogTrigger asChild>
					<Button
						// variant='ghost'
						className='wmmmm-auto mmmmoverflow-hidden pmmmx-2 bg-transparent text-sm font-semibold'
					>
						<span className='truncate'>{title}</span>
						<FaChevronDown className='ml-2 size-2.5' />
					</Button>
				</DialogTrigger>
				<DialogContent className='overflow-hidden bg-gray-50 p-0'>
					<DialogHeader className='border-b bg-white p-4'>
						<DialogTitle> {title}</DialogTitle>
						<DialogDescription className='hidden'></DialogDescription>
					</DialogHeader>
					<div className='flex flex-col gap-y-2 px-4 pb-4'>
						<Dialog open={editOpen} onOpenChange={handleEditOpen}>
							<DialogTrigger asChild>
								<div className='cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50'>
									<div className='flex items-center justify-between'>
										<p className='text-sm font-semibold text-[#000000]'>
											Channel name
										</p>
										{/* {member?.role === "admin" && ( */}
										<p className='text-sm font-semibold text-[#1264A3] hover:underline'>
											Edit
										</p>
										{/* )} */}
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
									onSubmit={handleSubmit}
									className='space-y-4'
								>
									<Input
										value={value ?? ''}
										// disabled={isUpdatingChannel}
										onChange={handleChange}
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
												//   disabled={isUpdatingChannel}
											>
												cancel
											</Button>
										</DialogClose>
										<Button
										// disabled={isUpdatingChannel}
										>
											Save
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>

						{/* {member?.role === "admin" && ( */}
						{activeChatroom?.ChatroomUsers &&
							activeChatroom?.ChatroomUsers?.some(
								(chatroomUser: any) =>
									chatroomUser.user.id === userId &&
									chatroomUser.role === 'ADMIN'
							) && (
								<button
									onClick={
										// e.preventDefault()

										handleDelete
									}
									// disabled={isRemovingChannel}
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
