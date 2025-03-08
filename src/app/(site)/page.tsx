/////////////////
import { gql } from '@apollo/client'
import { Flex } from '@mantine/core'
import { getTranslations } from 'next-intl/server'

// Используем твой клиент

// import { useRouter } from 'next/router'
// import { useEffect } from 'react'

import AddChatroom from '@/components/features/chat/AddChatroom'
import JoinRoomOrChatwindow from '@/components/features/chat/JoinRoomOrChatwindow'
import PreRoomList from '@/components/features/chat/PreRoomList'
import RoomList from '@/components/features/chat/RoomList'
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup
} from '@/components/ui/elements/Resizable'

// import { useCurrent } from '@/hooks/useCurrent'

import { client } from '@/libs/apollo-client'

import { TypingUsersProvider } from '@/store/typingUsers'

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
// export async function getServerSideProps(context: any) {
// 	const GET_CHATROOMS_FOR_USER = gql`
// 		query GetChatroomsForUser($userId: String!) {
// 			getChatroomsForUser(userId: $userId) {
// 				id
// 				name
// 			}
// 		}
// 	`

// 	const router = useRouter()

// 	useEffect(() => {
// 		console.log(router.query.id, 'ID в URL при первом рендере')
// 	}, [router.query.id])
// 	const user = useCurrent().user
// 	const userId = user?.id
// 	// Тут должен быть ID пользователя из сессии / куков

// 	const { data } = await client.query({
// 		query: GET_CHATROOMS_FOR_USER,
// 		variables: { userId }
// 	})

// 	if (data.getChatroomsForUser.length > 0) {
// 		const firstChatId = data.getChatroomsForUser[0].id

// 		// Если параметра нет, редиректим на URL с id
// 		if (!context.query.id) {
// 			return {
// 				redirect: {
// 					destination: `/?id=${firstChatId}`,
// 					permanent: false
// 				}
// 			}
// 		}
// 	}

// 	return {
// 		props: {} // Просто передаем пустые пропсы, так как данные уже есть
// 	}
// }

export default async function HomePage() {
	// const user = useCurrent().user
	const t = await getTranslations('home')
	/////////////////////////////////

	///////////////////////////////////////
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
			<div
				className='hm-[calc(100vh-0px)] flex'
				// className='flex h-[1000px]'
			>
				{/* <Sidebar /> */}
				<ResizablePanelGroup
					className=''
					direction='horizontal'
					autoSaveId='ca-workspace-layout'
				>
					<ResizablePanel
						defaultSize={20}
						minSize={5}
						className='bg-[#1a0d0d]'
					>
						{/* <div className='mt-[150px]'> */}
						<AddChatroom />
						{/* <Flex direction={{ base: 'column', md: 'row' }}> */}
						{/* <div className='mtmm-[70px] w-full'> */}
						{/* <RoomList /> */}
						<PreRoomList />
						{/* </div> */}
						{/* <JoinRoomOrChatwindow /> */}
						{/* </Flex> */}
						{/* </div> */}
						{/* <WorkspaceSidebar /> */}
					</ResizablePanel>
					<ResizableHandle
					// withHandle
					/>
					<ResizablePanel minSize={20} defaultSize={80} className='s'>
						{/* {children} */}

						<TypingUsersProvider>
							{/* <div className='h-['> */}
							<JoinRoomOrChatwindow />
							{/* </div> */}
						</TypingUsersProvider>
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
