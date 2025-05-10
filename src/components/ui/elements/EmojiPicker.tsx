import Picker, {
	type EmojiClickData,
	EmojiStyle,
	Theme
} from 'emoji-picker-react'
import { Smile } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '../common/Button'
// import { useTheme } from 'next-themes'

import { Popover, PopoverContent, PopoverTrigger } from '../common/Popover'

interface EmojiPickerProps {
	onChange: (value: string) => void
	isDisabled: boolean
}

export function EmojiPicker({ onChange, isDisabled }: EmojiPickerProps) {
	// const { theme } = useTheme()

	return (
		<Popover>
			<PopoverTrigger
				asChild
				className='ml-2 disabled:cursor-not-allowed'
				disabled={isDisabled}
			>
				<Button className='w-[5px] rounded-full hover:bg-[#e5ac28]'>
					<Smile className='size-[22px]' />
				</Button>
			</PopoverTrigger>
			<PopoverContent side='top' className='mb-4 mr-28 p-0'>
				<Picker
					onEmojiClick={(emoji: EmojiClickData) =>
						onChange(emoji.emoji)
					}
					emojiStyle={EmojiStyle.APPLE}

					// theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT}
				/>
			</PopoverContent>
		</Popover>
	)
}
