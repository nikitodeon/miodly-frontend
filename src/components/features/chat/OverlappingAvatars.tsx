import { Tooltip } from '@mantine/core'

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/components/ui/common/Avatar'

import { getMediaSource } from '@/utils/get-media-source'

function OverlappingAvatars({ users }: { users: any }) {
	const remainingUsers = users.length > 3 ? users.slice(3) : []
	const remainingNames = remainingUsers
		.map((user: any) => user.fullname)
		.join(', ')

	return (
		<Tooltip.Group openDelay={300} closeDelay={100}>
			<div className='relative flex'>
				{/* Отображаем первые три аватара */}
				{users.slice(0, 3).map((user: any, index: number) => (
					<Tooltip key={user.id} label={user.fullname}>
						<div
							className={`absolute left-${index * 8} z-${index + 10}`} // Налегание аватаров с отступами
							style={{
								position: 'absolute',
								left: `${index * 25}px`, // Налегание по оси X
								zIndex: 10 - index // Налегание по Z-осе, чтобы избежать перекрытия
							}}
						>
							<Avatar
							//   size={40}
							>
								<AvatarImage
									src={getMediaSource(user.avatar)}
									className='size-[40px] object-cover'
								/>
								<AvatarFallback>
									{user.username ? user.username[0] : 'U'}
								</AvatarFallback>
							</Avatar>
						</div>
					</Tooltip>
				))}

				{/* Отображаем аватар для оставшихся пользователей, если их больше 3 */}
				{users.length > 3 && (
					<Tooltip label={remainingNames}>
						<div
							className='absolute left-0 top-0 z-20' // Наложение для аватара "другие пользователи"
							style={{
								position: 'absolute',
								left: '75px', // Позиционируем аккуратно для "остальных"
								zIndex: 5 // Низкий z-index для наложения на других
							}}
						>
							<Avatar
								//    size={40}
								className='size-[40px] bg-gray-500'
							>
								+{users.length - 3}
							</Avatar>
						</div>
					</Tooltip>
				)}
			</div>
		</Tooltip.Group>
	)
}

export default OverlappingAvatars
