import { useQuery } from '@apollo/client'
import Image from 'next/image'
import { useState } from 'react'

import { Dialog, DialogTrigger } from '@/components/ui/common/Dialog'

import {
	SearchUsersDocument,
	SearchUsersQuery
} from '@/graphql/generated/output'

import { getMediaSource } from '@/utils/get-media-source'

import { GET_CHATROOMS_FOR_USER } from '../queries'

import AddMembersDialog from './AddMembersDialog'
import PromoteDemoteDialog from './PromoteDemoteDialog'
import RemoveMembersDialog from './RemoveMembersDialog'

interface ManageMembersDialogProps {
	membersEditOpen: boolean
	onMembersEditOpenChange: (value: boolean) => void
	activeRoomId: string | null | undefined
	currentUserId: string | null
}

export default function ManageMembersDialog({
	membersEditOpen,
	onMembersEditOpenChange,
	activeRoomId,
	currentUserId
}: ManageMembersDialogProps) {
	const [selectedUsers, setSelectedUsers] = useState<string[]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const { data: allchatroomsData } = useQuery(GET_CHATROOMS_FOR_USER, {
		variables: { userId: currentUserId }
	})
	const chatroomsData = allchatroomsData?.getChatroomsForUser.find(
		(chatroom: any) => chatroom.id === activeRoomId
	)
	const { data, refetch } = useQuery<SearchUsersQuery>(SearchUsersDocument, {
		variables: { fullname: searchTerm }
	})
	const selectItems: any =
		data?.searchUsers?.map((user: any) => ({
			label: user.username,
			value: String(user.id)
		})) || []

	const activeChatroom =
		chatroomsData?.id === activeRoomId ? chatroomsData : null

	let debounceTimeout: NodeJS.Timeout
	const handleSearchChange = (term: string) => {
		setSearchTerm(term)
		clearTimeout(debounceTimeout)
		debounceTimeout = setTimeout(() => {
			refetch()
		}, 300)
	}

	return (
		<Dialog open={membersEditOpen} onOpenChange={onMembersEditOpenChange}>
			<div className='hoverhh:bg-[#ecac21] cursor-pointer rounded-lg border bg-black px-5 py-4'>
				<div className='flex items-center justify-between'>
					<p className='text-sm font-semibold text-white'>
						Участники
					</p>
					<div className='flex flex-col'>
						<DialogTrigger asChild>
							<p className='text-sm font-semibold text-[#ecac21] hover:underline'>
								Добавить
							</p>
						</DialogTrigger>
						{activeChatroom?.ChatroomUsers &&
							activeChatroom?.ChatroomUsers?.some(
								(chatroomUser: any) =>
									chatroomUser.user.id === currentUserId &&
									chatroomUser.role === 'ADMIN'
							) && (
								<PromoteDemoteDialog
									type='promote'
									activeRoomId={activeRoomId}
									currentUserId={currentUserId}
									selectItems={selectItems}
								/>
							)}
						{activeChatroom?.ChatroomUsers &&
							activeChatroom?.ChatroomUsers?.some(
								(chatroomUser: any) =>
									chatroomUser.user.id === currentUserId &&
									chatroomUser.role === 'ADMIN'
							) && (
								<PromoteDemoteDialog
									type='demote'
									activeRoomId={activeRoomId}
									currentUserId={currentUserId}
									selectItems={selectItems}
								/>
							)}
						{activeChatroom?.ChatroomUsers &&
							activeChatroom?.ChatroomUsers?.some(
								(chatroomUser: any) =>
									chatroomUser.user.id === currentUserId &&
									(chatroomUser.role === 'ADMIN' ||
										chatroomUser.role === 'MODERATOR')
							) && (
								<RemoveMembersDialog
									activeRoomId={activeRoomId}
									currentUserId={currentUserId}
									selectedUsers={selectedUsers}
									setSelectedUsers={setSelectedUsers}
									selectItems={selectItems}
									handleSearchChange={handleSearchChange}
								/>
							)}
					</div>
				</div>
				<div className='mt-6 max-h-[200px] overflow-y-auto text-sm text-white'>
					{activeChatroom?.ChatroomUsers?.slice()
						.sort((a: any, b: any) => {
							const roleOrder: Record<string, number> = {
								ADMIN: 0,
								MODERATOR: 1,
								USER: 2
							}
							return roleOrder[a.role] - roleOrder[b.role]
						})
						.map((chatroomUser: any) => {
							const user = chatroomUser.user
							const avatarSrc = user.avatar
								? getMediaSource(user.avatar)
								: user.username?.[0]?.toUpperCase() || 'U'

							const isAdmin = chatroomUser.role === 'ADMIN'
							const isModerator =
								chatroomUser.role === 'MODERATOR'

							return (
								<div
									key={user.id}
									className='flex items-center gap-2 py-1'
								>
									{typeof avatarSrc === 'string' &&
									avatarSrc.length === 1 ? (
										<div className='flex h-6 w-6 items-center justify-center rounded-full bg-[#3a4050] text-xs text-white'>
											{avatarSrc}
										</div>
									) : (
										<Image
											src={avatarSrc}
											width={24}
											height={24}
											alt={user.username || 'User Avatar'}
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
											<span className='text-xs font-semibold text-[#ecac21]'>
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
						})}
				</div>
			</div>
			<AddMembersDialog
				activeRoomId={activeRoomId}
				currentUserId={currentUserId}
				selectedUsers={selectedUsers}
				setSelectedUsers={setSelectedUsers}
				selectItems={selectItems}
				handleSearchChange={handleSearchChange}
			/>
		</Dialog>
	)
}
