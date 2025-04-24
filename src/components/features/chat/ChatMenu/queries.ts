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
export const GET_CHATROOMS_FOR_USER_WITHOUT_ROLE = gql`
	query GetChatroomsForUser($userId: String!) {
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
