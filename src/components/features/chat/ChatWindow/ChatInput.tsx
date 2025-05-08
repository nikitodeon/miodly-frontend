import { Image } from '@mantine/core'

import { Button } from '@/components/ui/common/Button'
import { AttachIcon, SendIcon } from '@/components/ui/common/Icons'
import { Input } from '@/components/ui/common/Input'
import { EmojiPicker } from '@/components/ui/elements/EmojiPicker'

import { ChatInputProps } from './types'

const ChatInput: React.FC<ChatInputProps> = ({
	messageContent,
	selectedFile,
	previewUrl,
	handleInputChange,
	handleUserStartedTyping,
	handleSendMessage,
	getRootProps,
	getInputProps,
	setMessageContent
}) => {
	const handleEmojiSelect = (emoji: string) => {
		setMessageContent(prev => prev + emoji)
	}

	return (
		<div className='mb-8 mt-4 flex items-center gap-x-2'>
			<div {...getRootProps()}>
				{selectedFile && (
					<Image
						mr='md'
						width={50}
						height={50}
						src={previewUrl}
						alt='Preview'
						radius='md'
					/>
				)}
				<Button className='ml-2 rounded-sm hover:bg-[#e5ac28]'>
					<AttachIcon />
				</Button>
				<input {...getInputProps()} className='hidden' />
			</div>
			<div className='flex w-full items-center justify-between'>
				<Input
					className='flex-1'
					placeholder='Введите сообщение...'
					value={messageContent}
					onChange={handleInputChange}
					onKeyDown={handleUserStartedTyping}
				/>

				<EmojiPicker onChange={handleEmojiSelect} isDisabled={false} />

				<Button
					onClick={handleSendMessage}
					color='blue'
					className='ml-2 mr-3 hover:bg-[#e5ac28]'
				>
					<SendIcon />
				</Button>
			</div>
		</div>
	)
}

export default ChatInput
