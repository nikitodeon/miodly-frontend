import { Flex, List, Text } from '@mantine/core'
import { ArrowLeft } from 'lucide-react'
import React, { act } from 'react'

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
	// chatroomsData,
	onUpdateChatroomsDataToFalse
}) => {
	console.log(
		'activeRoomWWWWWWWWWWWWWWWWWWWWWWWWWWWWЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫЫ',
		activeRoom
	)

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
		<Flex
			direction='column'
			className={`${isMobile ? 'mx-3' : 'mx-6'} mb-1 mt-2 rounded-xl bg-gradient-to-r from-[#ffc93c] via-[#ffc93c] via-[70%] to-[#997924]`}
			// bg-[#ffa524]
		>
			<Flex>
				{isMobile && (
					<Button
						onClick={() => onBackMobile(false)}
						className='mrm-[-20px] w-[10px] rounded-full'
					>
						<ArrowLeft />
					</Button>
				)}
				<Flex justify='space-between' align='center' className='w-full'>
					<div className='flex items-center'>
						<Flex
							direction='column'
							className={`${isMobile ? 'ml-1' : 'ml-7'}`}
						>
							<Text
								mb='xs'
								className={`${isMobile ? 'text-sm' : ''} font-semibold text-[#000000]`}
							>
								Участники
							</Text>
							{dataUsersOfChatroom?.getUsersOfChatroom && (
								<div className='mt-[-20px]'>
									<OverlappingAvatars
										users={
											dataUsersOfChatroom.getUsersOfChatroom
										}
									/>
								</div>
							)}
						</Flex>
						<Flex direction='column' className='mmmr-7 mt-[-20px]'>
							<List>
								<Text
									className={`${isMobile ? 'text-sm' : ''} font-semibold text-[#000000]`}
								>
									В сети
								</Text>
								{liveUsers?.map(user => (
									<Flex key={user.id} align='center'>
										<div>{getAvatar(user)}</div>
										<Flex
											bottom={0}
											right={0}
											w={10}
											h={10}
											bg='green'
											style={{ borderRadius: 10 }}
											className='mb-[20px]'
										/>
										<Text
											ml='sm'
											className={`${isMobile ? 'text-sm' : ''}`}
										>
											{user.username}
										</Text>
									</Flex>
								))}
							</List>
						</Flex>
					</div>
					<div className='mr-[50px]'>
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
				</Flex>
			</Flex>
		</Flex>
	)
}

export default ChatHeader
