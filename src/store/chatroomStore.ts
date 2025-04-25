// import { create } from 'zustand'

// import { Chatroom, Message } from '@/graphql/generated/output'

// type ChatroomStore = {
// 	chatrooms: Map<string, Chatroom>
// 	messages: Map<string, Message[]>
// 	isUserPartOfChatroom: boolean // Добавляем состояние для проверки, является ли пользователь частью чата
// 	setChatroom: (chatroomId: string, data: Chatroom) => void
// 	setMessages: (chatroomId: string, msgs: Message[]) => void
// 	updateMessage: (chatroomId: string, msg: Message) => void
// 	resetChatroom: (chatroomId: string) => void
// 	setIsUserPartOfChatroom: (value: boolean) => void // Функция для обновления состояния isUserPartOfChatroom
// }

// export const useChatroomStore = create<ChatroomStore>(set => ({
// 	chatrooms: new Map(),
// 	messages: new Map(),
// 	isUserPartOfChatroom: false, // Изначально false

// 	setChatroom: (chatroomId, data) => {
// 		set(state => {
// 			const updated = new Map(state.chatrooms)
// 			updated.set(chatroomId, data)
// 			return { chatrooms: updated }
// 		})
// 	},

// 	setMessages: (chatroomId, msgs) => {
// 		set(state => {
// 			const updated = new Map(state.messages)
// 			updated.set(chatroomId, msgs)
// 			return { messages: updated }
// 		})
// 	},

// 	updateMessage: (chatroomId, msg) => {
// 		set(state => {
// 			const prevMsgs = state.messages.get(chatroomId) || []
// 			const merged = [
// 				...new Map([...prevMsgs, msg].map(m => [m.id, m])).values()
// 			]
// 			const updated = new Map(state.messages)
// 			updated.set(chatroomId, merged)
// 			return { messages: updated }
// 		})
// 	},

// 	resetChatroom: chatroomId => {
// 		set(state => {
// 			const newChatrooms = new Map(state.chatrooms)
// 			const newMessages = new Map(state.messages)
// 			newChatrooms.delete(chatroomId)
// 			newMessages.delete(chatroomId)
// 			return { chatrooms: newChatrooms, messages: newMessages }
// 		})
// 	},

// 	// Функция для обновления состояния isUserPartOfChatroom
// 	setIsUserPartOfChatroom: (value: boolean) => {
// 		set({ isUserPartOfChatroom: value })
// 	}
// }))
