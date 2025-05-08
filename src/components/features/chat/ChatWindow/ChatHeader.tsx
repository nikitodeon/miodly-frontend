import { ArrowLeft } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/common/Button'

import { getMediaSource } from '@/utils/get-media-source'

import { ChatMenu } from '../ChatMenu/ChatMenu'
import OverlappingAvatars from '../OverlappingAvatars'

import { ChatHeaderProps } from './types'

const ChatHeader: React.FC<ChatHeaderProps> = ({
	isMobile,
	onBackMobile,
	dataUsersOfChatroom,
	liveUsers = [],
	activeRoom,
	userId,
	onUpdateChatroomsDataToFalse
}) => {
	const getAvatar = (user: any) => {
		const avatarSrc = user.avatar
			? getMediaSource(user.avatar)
			: user.username?.[0]?.toUpperCase() || 'U'

		if (typeof avatarSrc === 'string' && avatarSrc.length === 1) {
			return (
				<div className='flex h-7 w-7 items-center justify-center rounded-full bg-[#3a4050] text-sm text-white'>
					{avatarSrc}
				</div>
			)
		} else {
			return (
				<div className='h-7 w-7 overflow-hidden rounded-full'>
					<img
						width={28}
						height={28}
						src={avatarSrc}
						alt={user.username}
						className='rounded-full'
						onError={(
							e: React.SyntheticEvent<HTMLImageElement, Event>
						) => {
							;(e.target as HTMLImageElement).src =
								'/logos/beeavatar.jpg'
						}}
					/>
				</div>
			)
		}
	}

	return (
		<div
			className={`flex flex-col ${isMobile ? 'mx-3 mt-4' : 'mx-6 mt-2'} mb-1 rounded-xl bg-gradient-to-r from-[#ffc93c] via-[#ffc93c] via-[70%] to-[#997924]`}
		>
			<div className='flex'>
				{isMobile && (
					<Button
						onClick={() => onBackMobile(false)}
						className='mrm-[-20px] w-[10px] rounded-full'
					>
						<ArrowLeft />
					</Button>
				)}
				<div className='flex w-full items-center justify-between'>
					<div className='flex items-center'>
						<div
							className={`flex flex-col ${isMobile ? 'ml-1' : 'ml-7'}`}
						>
							<p
								className={`mb-2 ${isMobile ? 'text-sm' : ''} font-semibold text-[#000000]`}
							>
								Участники
							</p>
							{dataUsersOfChatroom?.getUsersOfChatroom && (
								<div className='mt-[-20px]'>
									<OverlappingAvatars
										users={
											dataUsersOfChatroom.getUsersOfChatroom
										}
									/>
								</div>
							)}
						</div>
						<div className='ml-6 flex flex-col'>
							<ul>
								<p
									className={`${isMobile ? 'text-sm' : ''} font-semibold text-[#000000]`}
								>
									В сети
								</p>
								<div
									className={`max-h-[60px] overflow-y-auto ${liveUsers.length > 2 ? 'pr-2' : ''}`}
								>
									{liveUsers?.map(user => (
										<div
											key={user.id}
											className='flex items-center'
										>
											<div>{getAvatar(user)}</div>
											<div className='mb-[20px] h-[10px] w-[10px] rounded-full bg-green-500' />
											<span
												className={`ml-2 text-black ${isMobile ? 'text-sm' : ''}`}
											>
												{user.username}
											</span>
										</div>
									))}
								</div>
							</ul>
						</div>
					</div>
					<div className=''>
						<ChatMenu
							activeRoomId={activeRoom?.id}
							title={activeRoom?.name}
							currentUserId={userId ?? ''}
							chatroomsData={activeRoom}
							onUpdateChatroomsDataToFalse={
								onUpdateChatroomsDataToFalse
							}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ChatHeader
