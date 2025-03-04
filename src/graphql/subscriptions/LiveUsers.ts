import gql from 'graphql-tag'

export const LIVE_USERS_SUBSCRIPTION = gql`
	subscription LiveUsersInChatroom($chatroomId: Int!) {
		liveUsersInChatroom(chatroomId: $chatroomId) {
			id
			username
			avatar
			email
		}
	}
`
