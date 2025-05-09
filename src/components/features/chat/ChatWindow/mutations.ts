import { gql, useMutation } from '@apollo/client'
import { useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export const useChatroomMutations = (
	activeRoomId: string | null,
	userId: string | undefined,
	scrollAreaRef: React.RefObject<HTMLDivElement | null>
) => {
	const [messageContent, setMessageContent] = useState('')
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const { getRootProps, getInputProps } = useDropzone({
		onDrop: acceptedFiles => {
			if (acceptedFiles.length > 0) {
				setSelectedFile(acceptedFiles[0])
			}
		}
	})
	const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null

	// Мутация отправки сообщения
	const SEND_MESSAGE_MUTATION = gql`
		mutation SendMessage(
			$chatroomId: Float!
			$content: String!
			$file: Upload
		) {
			sendMessage(
				chatroomId: $chatroomId
				content: $content
				file: $file
			) {
				id
				content
				imageUrl
				user {
					id
					username
					email
				}
				chatroom {
					id
				}
			}
		}
	`

	// Мутация входа в чат
	const ENTER_CHATROOM = gql`
		mutation EnterChatroom($chatroomId: Int!) {
			enterChatroom(chatroomId: $chatroomId)
		}
	`

	// Мутация выхода из чата
	const LEAVE_CHATROOM = gql`
		mutation LeaveChatroom($chatroomId: Int!) {
			leaveChatroom(chatroomId: $chatroomId)
		}
	`

	// Мутация начала набора текста
	const USER_STARTED_TYPING_MUTATION = gql`
		mutation UserStartedTypingMutation($chatroomId: Float!) {
			userStartedTypingMutation(chatroomId: $chatroomId) {
				id
				username
				email
			}
		}
	`

	// Мутация остановки набора текста
	const USER_STOPPED_TYPING_MUTATION = gql`
		mutation UserStoppedTypingMutation($chatroomId: Float!) {
			userStoppedTypingMutation(chatroomId: $chatroomId) {
				id
				username
				email
			}
		}
	`

	const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION, {
		update(cache, { data }) {
			const newMessage = data?.sendMessage
			if (!newMessage) return

			const chatroomId = newMessage.chatroom.id

			cache.modify({
				id: `Chatroom:${chatroomId}`,
				fields: {
					messages(existingMessages = []) {
						return [...existingMessages, newMessage]
					}
				}
			})
		}
	})

	const [enterChatroom] = useMutation(ENTER_CHATROOM)
	const [leaveChatroom] = useMutation(LEAVE_CHATROOM, {
		onError: error => {
			if (error.message.includes('Forbidden')) {
				console.log('User was already removed from chatroom')
			}
		}
	})
	const [userStartedTypingMutation] = useMutation(
		USER_STARTED_TYPING_MUTATION
	)
	const [userStoppedTypingMutation] = useMutation(
		USER_STOPPED_TYPING_MUTATION
	)

	const typingTimeoutsRef = useRef<{ [key: string]: NodeJS.Timeout }>({})

	// Функция входа в чат
	const handleEnter = async () => {
		if (!activeRoomId) return

		try {
			await enterChatroom({
				variables: { chatroomId: parseInt(activeRoomId) }
			})
			console.log('Successfully entered chatroom!')
		} catch (error) {
			console.error('Error entering chatroom:', error)
		}
	}

	// Функция выхода из чата
	const handleLeave = async () => {
		if (!activeRoomId) return

		try {
			await leaveChatroom({
				variables: { chatroomId: parseInt(activeRoomId) }
			})
			console.log('Successfully left chatroom!')
		} catch (error) {
			console.error('Error leaving chatroom:', error)
		}
	}

	// Обработчик начала набора текста
	const handleUserStartedTyping = async () => {
		if (!activeRoomId || !userId) return

		await userStartedTypingMutation({
			variables: { chatroomId: parseFloat(activeRoomId) }
		})

		if (typingTimeoutsRef.current[userId]) {
			clearTimeout(typingTimeoutsRef.current[userId])
		}

		typingTimeoutsRef.current[userId] = setTimeout(async () => {
			await userStoppedTypingMutation({
				variables: { chatroomId: parseFloat(activeRoomId) }
			})
		}, 2000)
	}

	// Обработчик отправки сообщения
	const handleSendMessage = async () => {
		if (!messageContent.trim() && !selectedFile) return
		if (!activeRoomId) return

		try {
			await sendMessage({
				variables: {
					chatroomId: parseFloat(activeRoomId),
					content: messageContent,
					file: selectedFile || null
				}
			})

			setMessageContent('')
			setSelectedFile(null)

			if (scrollAreaRef.current) {
				scrollAreaRef.current.scrollTo({
					top: scrollAreaRef.current.scrollHeight,
					behavior: 'smooth'
				})
			}
		} catch (err) {
			console.error('Error sending message:', err)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMessageContent(e.target.value)
	}

	return {
		messageContent,
		setMessageContent,
		selectedFile,
		previewUrl,
		handleInputChange,
		handleUserStartedTyping,
		handleSendMessage,
		getRootProps,
		getInputProps,
		handleEnter,
		handleLeave
	}
}
