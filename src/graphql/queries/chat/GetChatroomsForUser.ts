import { gql } from '@apollo/client'

export const GET_CHATROOMS_FOR_USER = gql`
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
			users {
				avatar
				id
				username
				email
			}
		}
	}
`
