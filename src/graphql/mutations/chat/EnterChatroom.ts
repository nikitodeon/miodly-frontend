import { gql } from '@apollo/client'

export const ENTER_CHATROOM = gql`
	mutation EnterChatroom($chatroomId: Int!) {
		enterChatroom(chatroomId: $chatroomId)
	}
`
