'use client'

/////////////////
// import { gql } from '@apollo/client'
import { useMediaQuery } from '@mantine/hooks'
// import { getTranslations } from 'next-intl/server'
// Для определения мобильного экрана
import { useState } from 'react'

import AddChatroom from '@/components/features/chat/AddChatroom'
import JoinRoomOrChatwindow from '@/components/features/chat/JoinRoomOrChatwindow'
//
import RoomList from '@/components/features/chat/RoomList'
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup
} from '@/components/ui/elements/Resizable'

import { TypingUsersProvider } from '@/store/typingUsers'

export default function HomePage() {
	const [isChatSelectedMobile, setChatSelectedMobile] =
		useState<boolean>(false)
	const isMobile = useMediaQuery('(max-width: 768px)')
	// const user = useCurrent().user
	// const t = await getTranslations('home')

	return (
		<div className='h-full'>
			<div className='hm-[calc(100vh-0px)] flex'>
				{isMobile ? (
					isChatSelectedMobile ? (
						<TypingUsersProvider>
							<JoinRoomOrChatwindow
								onBackMobile={() =>
									setChatSelectedMobile(false)
								}
							/>
						</TypingUsersProvider>
					) : (
						<>
							<AddChatroom />
							<RoomList
								onSelectChatMobile={() =>
									setChatSelectedMobile(true)
								}
							/>
						</>
					)
				) : (
					<ResizablePanelGroup
						direction='horizontal'
						autoSaveId='ca-workspace-layout'
					>
						<ResizablePanel
							defaultSize={20}
							minSize={5}
							className='bg-[#000000]'
						>
							<AddChatroom />
							<RoomList
								onSelectChatMobile={() =>
									setChatSelectedMobile(true)
								}
							/>
						</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel minSize={20} defaultSize={80}>
							<TypingUsersProvider>
								<JoinRoomOrChatwindow
									onBackMobile={() =>
										setChatSelectedMobile(false)
									}
								/>
							</TypingUsersProvider>
						</ResizablePanel>
					</ResizablePanelGroup>
				)}
			</div>
		</div>
	)
}
