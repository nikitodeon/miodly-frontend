import { Image } from '@mantine/core'

import { Button } from '@/components/ui/common/Button'

interface JoinChatPromptProps {
	isMobile: boolean
	onBackMobile: (selected: boolean) => void
	toggleCreateRoomModal: () => void
}

const JoinChatPrompt: React.FC<JoinChatPromptProps> = ({
	isMobile,
	onBackMobile,
	toggleCreateRoomModal
}) => (
	<div className='flex h-screen items-center justify-center bg-[#000000]'>
		<div className='w-full max-w-lg rounded-lg bg-opacity-80 p-8 text-center text-white backdrop-blur-lg'>
			<h1 className='mb-6 bg-gradient-to-t from-[#905e26] via-[#905e26] to-[#dbc77d] bg-clip-text text-4xl font-extrabold text-transparent'>
				Создайте или Войдите в чат, чтобы начать общение!
			</h1>

			<Image
				width={200}
				height={200}
				src='/logos/biglogoblgl.png'
				alt='Кот'
				className='mx-auto mb-6 rounded-lg shadow-lg'
			/>

			<div className='space-x-4'>
				{!isMobile && (
					<Button
						className='rounded-lg bg-[#ffc83d] px-6 py-6 text-xl font-semibold text-black transition-all duration-300 hover:bg-[#e5ac28]'
						onClick={toggleCreateRoomModal}
					>
						Создать чат
					</Button>
				)}
				{isMobile && (
					<Button
						onClick={() => onBackMobile(false)}
						className='rounded-lg bg-[#ffc83d] px-6 py-6 text-xl font-semibold text-black transition-all duration-300 hover:bg-[#e5ac28]'
					>
						Перейти к чатам
					</Button>
				)}
			</div>
		</div>
	</div>
)

export default JoinChatPrompt
