import { gql } from '@apollo/client'

export const DELETE_CHATROOM = gql`
	mutation deleteChatroom($chatroomId: Float!) {
		deleteChatroom(chatroomId: $chatroomId)
	}
`

export const REMOVE_USERS_FROM_CHATROOM = gql`
	mutation RemoveUsersFromChatroom(
		$chatroomId: Float!
		$userIds: [String!]!
	) {
		removeUsersFromChatroom(chatroomId: $chatroomId, userIds: $userIds) {
			name
			id
		}
	}
`

export const ADD_USERS_TO_CHATROOM = gql`
	mutation addUsersToChatroom($chatroomId: Float!, $userIds: [String!]!) {
		addUsersToChatroom(chatroomId: $chatroomId, userIds: $userIds) {
			name
			id
		}
	}
`

export const UPDATE_USERS_ROLES = gql`
	mutation UpdateUsersRoles($data: UpdateUsersRolesInput!) {
		updateUsersRoles(data: $data) {
			updatedUsers {
				userId
				role
			}
		}
	}
`

export const DEMOTE_USERS_ROLES = gql`
	mutation DemoteUsersRoles($data: UpdateUsersRolesInput!) {
		updateUsersRolesForDemotion(data: $data) {
			updatedUsers {
				userId
				role
			}
		}
	}
`
