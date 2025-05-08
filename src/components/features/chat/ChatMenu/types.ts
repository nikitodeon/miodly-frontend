export interface HeaderProps {
	title: string | null | undefined
	activeRoomId: any
	currentUserId: string | null
	chatroomsData: any
	onUpdateChatroomsDataToFalse: any
}

// export interface User {
// 	id: string
// 	username: string
// 	email?: string
// 	avatar?: string
// }

// export interface ChatroomWithUsers extends Chatroom {
//   ChatroomUsers?: {
//     role: string
//     user: User
//   }[]
// }

// export interface ChatroomWithUsers {
//   id: string
//   name: string
//   ChatroomUsers?: {
//     role: string
//     user: User
//   }[]
// }
