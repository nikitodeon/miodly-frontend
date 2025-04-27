import { gql } from '@apollo/client'

export const GET_USERS_OF_CHATROOM = gql`
	query GetUsersOfChatroom($chatroomId: Float!) {
		getUsersOfChatroom(chatroomId: $chatroomId) {
			id
			username
			email
			avatar
		}
	}
`
export const GET_MESSAGES_FOR_CHATROOM = gql`
	query GetMessagesForChatroom($chatroomId: Float!) {
		getMessagesForChatroom(chatroomId: $chatroomId) {
			id
			content
			imageUrl
			createdAt
			user {
				id
				username
				email
				avatar
			}
			chatroom {
				id
				name
				ChatroomUsers {
					role
					user {
						id
						username
						avatar
						email
					}
				}
			}
		}
	}
`

export const GET_CHATROOMS_FOR_USER = gql`
	query getChatroomsForUser($userId: String!) {
		getChatroomsForUser(userId: $userId) {
			id
			name
			messages {
				id
				content
				createdAt
				user {
					id
					username
				}
			}
			ChatroomUsers {
				role
				user {
					id
					username
					email
					avatar
				}
			}
		}
	}
`

export const SEARCH_USERS = gql`
	query searchUsers($fullname: String!) {
		searchUsers(fullname: $fullname) {
			id
			username
		}
	}
`
