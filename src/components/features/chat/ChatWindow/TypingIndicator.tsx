import { Text, Tooltip } from '@mantine/core'

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/components/ui/common/Avatar'

import { getMediaSource } from '@/utils/get-media-source'

interface TypingIndicatorProps {
	typingUsers: any
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => (
	<div className='relative w-full'>
		<div className='absolute bottom-1 left-1/2 flex w-full -translate-x-1/2 transform justify-center'>
			<div
				className={`flex flex-row items-center gap-x-2 rounded-md bg-gradient-to-r from-[#ffc93c] via-[#997924] via-[70%] to-[#997924] shadow-md ${
					typingUsers.length === 0 ? 'p-0' : 'p-2'
				}`}
			>
				{typingUsers.map((user: any) => (
					<Tooltip key={user.id} label={user.username}>
						<Avatar>
							{/* Если аватарка существует, показываем её */}
							<AvatarImage
								src={getMediaSource(user.avatar)}
								className='size-[40px] object-cover'
							/>
							<AvatarFallback>
								{console.log(
									'Проверка user перед извлечением первой буквы:',
									user
								)}

								{/* Извлекаем первую букву из username, если он существует */}
								{user?.username &&
								typeof user.username === 'string' &&
								user.username.length > 0
									? (console.log(
											'Извлекаем первую букву для:',
											user.username
										),
										user.username[0].toUpperCase())
									: (console.log(
											'Отображаем U, потому что username пустой или отсутствует'
										),
										'U')}
							</AvatarFallback>
						</Avatar>
					</Tooltip>
				))}

				{typingUsers.length > 0 && (
					<Text className='ml-[px] text-[#000000]'>is typing...</Text>
				)}
			</div>
		</div>
	</div>
)

export default TypingIndicator
