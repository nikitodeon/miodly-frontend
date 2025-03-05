import { Flex } from '@mantine/core'
import { getTranslations } from 'next-intl/server'

import AddChatroom from '@/components/features/chat/AddChatroom'
import RoomList from '@/components/features/chat/RoomList'
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup
} from '@/components/ui/elements/Resizable'

// import { CategoriesList } from '@/components/features/category/list/CategoriesList'
// import { StreamsList } from '@/components/features/stream/list/StreamsList'

// import {
// 	FindRandomCategoriesDocument,
// 	type FindRandomCategoriesQuery,
// 	FindRandomStreamsDocument,
// 	type FindRandomStreamsQuery
// } from '@/graphql/generated/output'

// import { SERVER_URL } from '@/libs/constants/url.constants'

// async function findRandomStreams() {
// 	try {
// 		const query = FindRandomStreamsDocument.loc?.source.body

// 		const response = await fetch(SERVER_URL, {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json'
// 			},
// 			body: JSON.stringify({ query }),
// 			next: {
// 				revalidate: 30
// 			}
// 		})

// 		const data = await response.json()

// 		return {
// 			streams: data.data
// 				.findRandomStreams as FindRandomStreamsQuery['findRandomStreams']
// 		}
// 	} catch (error) {
// 		console.log(error)
// 		throw new Error('Ошибка при получении стримов')
// 	}
// }

// async function findRandomCategories() {
// 	try {
// 		const query = FindRandomCategoriesDocument.loc?.source.body

// 		const response = await fetch(SERVER_URL, {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json'
// 			},
// 			body: JSON.stringify({ query }),
// 			next: {
// 				revalidate: 30
// 			}
// 		})

// 		const data = await response.json()

// 		return {
// 			categories: data.data
// 				.findRandomCategories as FindRandomCategoriesQuery['findRandomCategories']
// 		}
// 	} catch (error) {
// 		console.log(error)
// 		throw new Error('Ошибка при получении категорий')
// 	}
// }

export default async function HomePage() {
	const t = await getTranslations('home')

	// const { streams } = await findRandomStreams()
	// const { categories } = await findRandomCategories()

	return (
		// <div className='space-y-10'>

		// 	{/* <StreamsList heading={t('streamsHeading')} streams={streams} /> */}
		// 	{/* <CategoriesList */}
		// 	{/* heading={t('categoriesHeading')}
		// 		categories={categories}
		// 	/> */}
		// </div>
		<div className='h-full'>
			{/* <Toolbar /> */}
			<div className='flex h-[calc(100vh-40px)]'>
				{/* <Sidebar /> */}
				<ResizablePanelGroup
					direction='horizontal'
					autoSaveId='ca-workspace-layout'
				>
					<ResizablePanel
						defaultSize={20}
						minSize={5}
						className='bg-[#5E2C5F]'
					>
						{/* <div className='mt-[150px]'> */}
						<AddChatroom />
						{/* <Flex direction={{ base: 'column', md: 'row' }}> */}
						<div className='mt-[150px]'>
							<RoomList />
						</div>
						{/* <JoinRoomOrChatwindow /> */}
						{/* </Flex> */}
						{/* </div> */}
						{/* <WorkspaceSidebar /> */}
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel minSize={20} defaultSize={80}>
						{/* {children} */}
					</ResizablePanel>

					{/* {showPanel && ( */}
					{/* <> */}
					{/* <ResizableHandle withHandle /> */}
					{/* <ResizablePanel minSize={20} defaultSize={29}> */}
					{/* {parentMessageId ? ( */}
					{/* <Thread
					  messageId={parentMessageId as Id<"messages">}
					  onClose={onClose}
					/> */}
					{/* ) : profileMemberId ? ( */}
					{/* <Profile
					  memberId={profileMemberId as Id<"members">}
					  onClose={onClose}
					/>
				  ) : (
					<div className="flex h-full items-center justify-center">
					  <Loader className="size-5 animate-spin text-muted-foreground" />
					</div>
				  )} */}
					{/* </ResizablePanel> */}
					{/* </>
			)} */}
				</ResizablePanelGroup>
			</div>
		</div>
	)
}
