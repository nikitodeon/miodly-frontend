'use client'

import { Flex, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import React, { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import ChatWindow from './Chatwindow'

interface JoinRoomOrChatwindowProps {
	onBackMobile: (selected: boolean) => void // Функция возврата
}
function JoinRoomOrChatwindow({ onBackMobile }: JoinRoomOrChatwindowProps) {
	// const { id } = useParams<{ id: string }>()
	const [searchParams] = useSearchParams()
	const id = searchParams.get('id')
	const [content, setContent] = React.useState<string | React.ReactNode>('')

	// useEffect(() => {
	// 	if (!id) {
	// 		setContent('Please choose a room')
	// 	} else {
	// 		setContent(<ChatWindow />)
	// 	}
	// }, [setContent, id])
	useEffect(() => {
		setContent(id ? <ChatWindow onBackMobile={onBackMobile} /> : '')
	}, [id])
	return (
		<>
			{/* <Flex h='100vh' align={'center'} justify={'center'}> */}
			{/* <Text ml={!id ? 'xl' : 'none'} size={!id ? 'xl' : ''}> */}
			{content}
			{/* </Text> */}
			{/* </Flex> */}
		</>
	)
}

export default JoinRoomOrChatwindow
