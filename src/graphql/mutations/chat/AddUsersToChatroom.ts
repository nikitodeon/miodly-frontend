import { gql } from '@apollo/client'

export const ADD_USERS_TO_CHATROOM = gql`
	mutation AddUsersToChatroom($chatroomId: Float!, $userIds: [String!]!) {
		addUsersToChatroom(chatroomId: $chatroomId, userIds: $userIds) {
			name
			id
		}
	}
`
