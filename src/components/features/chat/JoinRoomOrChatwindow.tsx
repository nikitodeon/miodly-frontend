'use client'

import React, { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import Chatwindow from './ChatWindow/ChatWindow'

interface JoinRoomOrChatwindowProps {
	onBackMobile: (selected: boolean) => void // Функция возврата
}
function JoinRoomOrChatwindow({ onBackMobile }: JoinRoomOrChatwindowProps) {
	// const { id } = useParams<{ id: string }>()
	const [searchParams] = useSearchParams()
	const id = searchParams.get('id')
	const [content, setContent] = React.useState<string | React.ReactNode>('')

	useEffect(() => {
		setContent(id ? <Chatwindow onBackMobile={onBackMobile} /> : '')
	}, [id])
	return <>{content}</>
}

export default JoinRoomOrChatwindow
