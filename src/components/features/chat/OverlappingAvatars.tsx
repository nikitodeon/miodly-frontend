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
		.map((user: any) => user.username)
		.join(', ')

	console.log('Пользователи:', users)

	// Отображаем первые три аватара
	return (
		<Tooltip.Group openDelay={300} closeDelay={100}>
			<div className='relative mr-[20px] mt-[20px] flex h-[50px] w-[100px]'>
				{users.slice(0, 3).map((user: any, index: number) => (
					<Tooltip key={user.id} label={user.username}>
						<div
							className={`absolute left-${index * 8} z-${index + 10}`} // Налегание аватаров с отступами
							style={{
								position: 'absolute',
								left: `${index * 25}px`, // Налегание по оси X
								zIndex: 10 - index // Налегание по Z-осе, чтобы избежать перекрытия
							}}
						>
							<Avatar>
								{/* Если аватарка существует, показываем её */}
								<AvatarImage
									src={getMediaSource(user.avatar)}
									className='size-[40px] object-cover'
								/>
								<AvatarFallback>
									{/* Извлекаем первую букву из username, если он существует */}
									{user?.username &&
									typeof user.username === 'string' &&
									user.username.length > 0
										? user.username[0].toUpperCase()
										: 'U'}
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
							<Avatar className='size-[40px] bg-[#3c3c3c]'>
								<span className='text-md ml-4 mt-[9px]'>
									+{users.length - 3}
								</span>
							</Avatar>
						</div>
					</Tooltip>
				)}
			</div>
		</Tooltip.Group>
	)
}

export default OverlappingAvatars
