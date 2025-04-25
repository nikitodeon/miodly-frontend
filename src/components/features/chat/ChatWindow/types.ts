import {
	Chatroom,
	GetChatroomsForUserQuery,
	GetMessagesForChatroomQuery,
	GetUsersOfChatroomQuery
} from '@/graphql/generated/output'

export interface Message {
	id: string
	content: string
	imageUrl?: string
	createdAt: string
	user: {
		id: string
		username: string
		email: string
		avatar?: string
	}
	chatroom: {
		id: string
	}
}

export interface User {
	id: string
	username: string
	email: string
	avatar?: string
}

export interface ChatroomData {
	getChatroomsForUser?: GetChatroomsForUserQuery['getChatroomsForUser']
}

export interface MessagesData {
	getMessagesForChatroom?: GetMessagesForChatroomQuery['getMessagesForChatroom']
}

export interface UsersData {
	getUsersOfChatroom?: GetUsersOfChatroomQuery['getUsersOfChatroom']
}

export interface ChatHeaderProps {
	isMobile: boolean
	onBackMobile: (selected: boolean) => void
	dataUsersOfChatroom: UsersData
	liveUsers: User[]
	activeRoom: any

	userId: string | undefined

	onUpdateChatroomsDataToFalse: () => void
}

export interface ChatMessagesProps {
	messages: Message[]
	loading: boolean
	userId: string | undefined
	scrollAreaRef: React.RefObject<HTMLDivElement | null>
}

export interface ChatInputProps {
	messageContent: string
	selectedFile: File | null
	previewUrl: string | null
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	handleUserStartedTyping: () => void
	handleSendMessage: () => Promise<void>
	getRootProps: () => any
	getInputProps: () => any
	setMessageContent: React.Dispatch<React.SetStateAction<string>>
}
