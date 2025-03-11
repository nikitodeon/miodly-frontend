import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
	T extends { [key: string]: unknown },
	K extends keyof T
> = { [_ in K]?: never }
export type Incremental<T> =
	| T
	| {
			[P in keyof T]?: P extends ' $fragmentName' | '__typename'
				? T[P]
				: never
	  }
const defaultOptions = {} as const
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string }
	String: { input: string; output: string }
	Boolean: { input: boolean; output: boolean }
	Int: { input: number; output: number }
	Float: { input: number; output: number }
	DateTime: { input: any; output: any }
	Upload: { input: any; output: any }
}

export type AuthModel = {
	__typename?: 'AuthModel'
	message?: Maybe<Scalars['String']['output']>
	user?: Maybe<UserModel>
}

export type ChangeChatnameInput = {
	name: Scalars['String']['input']
}

export type ChangeEmailInput = {
	email: Scalars['String']['input']
}

export type ChangeNotificationsSettingsInput = {
	siteNotifications: Scalars['Boolean']['input']
	telegramNotifications: Scalars['Boolean']['input']
}

export type ChangeNotificationsSettingsResponse = {
	__typename?: 'ChangeNotificationsSettingsResponse'
	notificationSettings: NotificationSettingsModel
	telegramAuthToken?: Maybe<Scalars['String']['output']>
}

export type ChangePasswordInput = {
	newPassword: Scalars['String']['input']
	oldPassword: Scalars['String']['input']
}

export type ChangeProfileInfoInput = {
	bio: Scalars['String']['input']
	displayName: Scalars['String']['input']
	username: Scalars['String']['input']
}

export type Chatroom = {
	__typename?: 'Chatroom'
	ChatroomUsers?: Maybe<Array<ChatroomUsers>>
	createdAt?: Maybe<Scalars['DateTime']['output']>
	id?: Maybe<Scalars['ID']['output']>
	messages?: Maybe<Array<Message>>
	name?: Maybe<Scalars['String']['output']>
	updatedAt?: Maybe<Scalars['DateTime']['output']>
}

export type ChatroomUsers = {
	__typename?: 'ChatroomUsers'
	chatroom: Chatroom
	chatroomId: Scalars['ID']['output']
	role?: Maybe<Scalars['String']['output']>
	user: UserModel
	userId: Scalars['ID']['output']
}

export type CreateUserInput = {
	email: Scalars['String']['input']
	password: Scalars['String']['input']
	username: Scalars['String']['input']
}

export type DeactivateAccountInput = {
	email: Scalars['String']['input']
	password: Scalars['String']['input']
	pin?: InputMaybe<Scalars['String']['input']>
}

export type DeviceModel = {
	__typename?: 'DeviceModel'
	browser: Scalars['String']['output']
	os: Scalars['String']['output']
	type: Scalars['String']['output']
}

export type EnableTotpInput = {
	pin: Scalars['String']['input']
	secret: Scalars['String']['input']
}

export type LocationModel = {
	__typename?: 'LocationModel'
	city: Scalars['String']['output']
	country: Scalars['String']['output']
	latidute: Scalars['Float']['output']
	longitude: Scalars['Float']['output']
}

export type LoginInput = {
	login: Scalars['String']['input']
	password: Scalars['String']['input']
	pin?: InputMaybe<Scalars['String']['input']>
}

export type Message = {
	__typename?: 'Message'
	chatroom?: Maybe<Chatroom>
	content?: Maybe<Scalars['String']['output']>
	createdAt?: Maybe<Scalars['DateTime']['output']>
	id?: Maybe<Scalars['ID']['output']>
	imageUrl?: Maybe<Scalars['String']['output']>
	updatedAt?: Maybe<Scalars['DateTime']['output']>
	user?: Maybe<UserModel>
}

export type Mutation = {
	__typename?: 'Mutation'
	addUsersToChatroom: Chatroom
	changeChatName: Chatroom
	changeEmail: Scalars['Boolean']['output']
	changeNotificationsSettings: ChangeNotificationsSettingsResponse
	changePassword: Scalars['Boolean']['output']
	changeProfileAvatar: Scalars['Boolean']['output']
	changeProfileInfo: Scalars['Boolean']['output']
	clearSessionCookie: Scalars['Boolean']['output']
	createChatroom: Chatroom
	createSocialLink: Scalars['Boolean']['output']
	createUser: Scalars['Boolean']['output']
	deactivateAccount: AuthModel
	deleteChatroom: Scalars['String']['output']
	disableTotp: Scalars['Boolean']['output']
	enableTotp: Scalars['Boolean']['output']
	enterChatroom: Scalars['Boolean']['output']
	leaveChatroom: Scalars['Boolean']['output']
	loginUser: AuthModel
	logoutUser: Scalars['Boolean']['output']
	newPassword: Scalars['Boolean']['output']
	removeProfileAvatar: Scalars['Boolean']['output']
	removeSession: Scalars['Boolean']['output']
	removeSocialLink: Scalars['Boolean']['output']
	reorderSocialLinks: Scalars['Boolean']['output']
	resetPassword: Scalars['Boolean']['output']
	sendMessage: Message
	updateSocialLink: Scalars['Boolean']['output']
	userStartedTypingMutation: UserModel
	userStoppedTypingMutation: UserModel
	verifyAccount: AuthModel
}

export type MutationAddUsersToChatroomArgs = {
	chatroomId: Scalars['Float']['input']
	userIds: Array<Scalars['String']['input']>
}

export type MutationChangeChatNameArgs = {
	chatroomId: Scalars['Float']['input']
	data: ChangeChatnameInput
}

export type MutationChangeEmailArgs = {
	data: ChangeEmailInput
}

export type MutationChangeNotificationsSettingsArgs = {
	data: ChangeNotificationsSettingsInput
}

export type MutationChangePasswordArgs = {
	data: ChangePasswordInput
}

export type MutationChangeProfileAvatarArgs = {
	avatar: Scalars['Upload']['input']
}

export type MutationChangeProfileInfoArgs = {
	data: ChangeProfileInfoInput
}

export type MutationCreateChatroomArgs = {
	name: Scalars['String']['input']
}

export type MutationCreateSocialLinkArgs = {
	data: SocialLinkInput
}

export type MutationCreateUserArgs = {
	data: CreateUserInput
}

export type MutationDeactivateAccountArgs = {
	data: DeactivateAccountInput
}

export type MutationDeleteChatroomArgs = {
	chatroomId: Scalars['Float']['input']
}

export type MutationEnableTotpArgs = {
	data: EnableTotpInput
}

export type MutationEnterChatroomArgs = {
	chatroomId: Scalars['Int']['input']
}

export type MutationLeaveChatroomArgs = {
	chatroomId: Scalars['Int']['input']
}

export type MutationLoginUserArgs = {
	data: LoginInput
}

export type MutationNewPasswordArgs = {
	data: NewPasswordInput
}

export type MutationRemoveSessionArgs = {
	id: Scalars['String']['input']
}

export type MutationRemoveSocialLinkArgs = {
	id: Scalars['String']['input']
}

export type MutationReorderSocialLinksArgs = {
	list: Array<SocialLinkOrderInput>
}

export type MutationResetPasswordArgs = {
	data: ResetPasswordInput
}

export type MutationSendMessageArgs = {
	chatroomId: Scalars['Float']['input']
	content: Scalars['String']['input']
	file?: InputMaybe<Scalars['Upload']['input']>
}

export type MutationUpdateSocialLinkArgs = {
	data: SocialLinkInput
	id: Scalars['String']['input']
}

export type MutationUserStartedTypingMutationArgs = {
	chatroomId: Scalars['Float']['input']
}

export type MutationUserStoppedTypingMutationArgs = {
	chatroomId: Scalars['Float']['input']
}

export type MutationVerifyAccountArgs = {
	data: VerificationInput
}

export type NewPasswordInput = {
	password: Scalars['String']['input']
	passwordRepeat: Scalars['String']['input']
	token: Scalars['String']['input']
}

export type NotificationModel = {
	__typename?: 'NotificationModel'
	createdAt: Scalars['DateTime']['output']
	id: Scalars['String']['output']
	isRead: Scalars['Boolean']['output']
	message: Scalars['String']['output']
	type: NotificationType
	updatedAt: Scalars['DateTime']['output']
	user: UserModel
	userId: Scalars['String']['output']
}

export type NotificationSettingsModel = {
	__typename?: 'NotificationSettingsModel'
	createdAt: Scalars['DateTime']['output']
	id: Scalars['String']['output']
	siteNotifications: Scalars['Boolean']['output']
	telegramNotifications: Scalars['Boolean']['output']
	updatedAt: Scalars['DateTime']['output']
	user: UserModel
	userId: Scalars['String']['output']
}

export enum NotificationType {
	EnableTwoFactor = 'ENABLE_TWO_FACTOR'
}

export type Query = {
	__typename?: 'Query'
	findCurrentSession: SessionModel
	findNotificationsByUser: Array<NotificationModel>
	findNotificationsUnreadCount: Scalars['Float']['output']
	findProfile: UserModel
	findSessionsByUser: Array<SessionModel>
	findSocialLinks: Array<SocialLinkModel>
	generateTotpSecret: TotpModel
	getChatroomsForUser: Array<Chatroom>
	getMessagesForChatroom: Array<Message>
	getUsersOfChatroom: Array<UserModel>
	searchUsers: Array<UserModel>
}

export type QueryGetChatroomsForUserArgs = {
	userId: Scalars['String']['input']
}

export type QueryGetMessagesForChatroomArgs = {
	chatroomId: Scalars['Float']['input']
}

export type QueryGetUsersOfChatroomArgs = {
	chatroomId: Scalars['Float']['input']
}

export type QuerySearchUsersArgs = {
	fullname: Scalars['String']['input']
}

export type ResetPasswordInput = {
	email: Scalars['String']['input']
}

export type SessionMetadataModel = {
	__typename?: 'SessionMetadataModel'
	device: DeviceModel
	ip: Scalars['String']['output']
	location: LocationModel
}

export type SessionModel = {
	__typename?: 'SessionModel'
	createdAt: Scalars['String']['output']
	id: Scalars['ID']['output']
	metadata: SessionMetadataModel
	userId: Scalars['String']['output']
}

export type SocialLinkInput = {
	title: Scalars['String']['input']
	url: Scalars['String']['input']
}

export type SocialLinkModel = {
	__typename?: 'SocialLinkModel'
	createdAt: Scalars['DateTime']['output']
	id: Scalars['ID']['output']
	position: Scalars['Float']['output']
	title: Scalars['String']['output']
	updatedAt: Scalars['DateTime']['output']
	url: Scalars['String']['output']
	userId: Scalars['String']['output']
}

export type SocialLinkOrderInput = {
	id: Scalars['String']['input']
	position: Scalars['Float']['input']
}

export type Subscription = {
	__typename?: 'Subscription'
	liveUsersInChatroom?: Maybe<Array<UserModel>>
	newMessage?: Maybe<Message>
	userStartedTyping?: Maybe<UserModel>
	userStoppedTyping?: Maybe<UserModel>
}

export type SubscriptionLiveUsersInChatroomArgs = {
	chatroomId: Scalars['Int']['input']
}

export type SubscriptionNewMessageArgs = {
	chatroomId: Scalars['Float']['input']
}

export type SubscriptionUserStartedTypingArgs = {
	chatroomId: Scalars['Float']['input']
	userId: Scalars['String']['input']
}

export type SubscriptionUserStoppedTypingArgs = {
	chatroomId: Scalars['Float']['input']
	userId: Scalars['String']['input']
}

export type TotpModel = {
	__typename?: 'TotpModel'
	qrcodeUrl: Scalars['String']['output']
	secret: Scalars['String']['output']
}

export type UserModel = {
	__typename?: 'UserModel'
	avatar?: Maybe<Scalars['String']['output']>
	bio?: Maybe<Scalars['String']['output']>
	createdAt: Scalars['DateTime']['output']
	deactivatedAt?: Maybe<Scalars['DateTime']['output']>
	displayName: Scalars['String']['output']
	email: Scalars['String']['output']
	id: Scalars['ID']['output']
	isDeactivated: Scalars['Boolean']['output']
	isEmailVerified: Scalars['Boolean']['output']
	isTotpEnabled: Scalars['Boolean']['output']
	isVerified: Scalars['Boolean']['output']
	notificationSettings?: Maybe<NotificationSettingsModel>
	notifications: Array<NotificationModel>
	password: Scalars['String']['output']
	socialLinks: Array<SocialLinkModel>
	telegramId?: Maybe<Scalars['String']['output']>
	totpSecret?: Maybe<Scalars['String']['output']>
	updatedAt: Scalars['DateTime']['output']
	username: Scalars['String']['output']
}

export type VerificationInput = {
	token: Scalars['String']['input']
}

export type CreateUserMutationVariables = Exact<{
	data: CreateUserInput
}>

export type CreateUserMutation = {
	__typename?: 'Mutation'
	createUser: boolean
}

export type DeactivateAccountMutationVariables = Exact<{
	data: DeactivateAccountInput
}>

export type DeactivateAccountMutation = {
	__typename?: 'Mutation'
	deactivateAccount: {
		__typename?: 'AuthModel'
		message?: string | null
		user?: { __typename?: 'UserModel'; isDeactivated: boolean } | null
	}
}

export type LoginUserMutationVariables = Exact<{
	data: LoginInput
}>

export type LoginUserMutation = {
	__typename?: 'Mutation'
	loginUser: {
		__typename?: 'AuthModel'
		message?: string | null
		user?: { __typename?: 'UserModel'; username: string } | null
	}
}

export type LogoutUserMutationVariables = Exact<{ [key: string]: never }>

export type LogoutUserMutation = {
	__typename?: 'Mutation'
	logoutUser: boolean
}

export type NewPasswordMutationVariables = Exact<{
	data: NewPasswordInput
}>

export type NewPasswordMutation = {
	__typename?: 'Mutation'
	newPassword: boolean
}

export type ResetPasswordMutationVariables = Exact<{
	data: ResetPasswordInput
}>

export type ResetPasswordMutation = {
	__typename?: 'Mutation'
	resetPassword: boolean
}

export type VerifyAccountMutationVariables = Exact<{
	data: VerificationInput
}>

export type VerifyAccountMutation = {
	__typename?: 'Mutation'
	verifyAccount: {
		__typename?: 'AuthModel'
		message?: string | null
		user?: { __typename?: 'UserModel'; isEmailVerified: boolean } | null
	}
}

export type AddUsersToChatroomMutationVariables = Exact<{
	chatroomId: Scalars['Float']['input']
	userIds: Array<Scalars['String']['input']> | Scalars['String']['input']
}>

export type AddUsersToChatroomMutation = {
	__typename?: 'Mutation'
	addUsersToChatroom: {
		__typename?: 'Chatroom'
		name?: string | null
		id?: string | null
	}
}

export type ChangeChatNameMutationVariables = Exact<{
	chatroomId: Scalars['Float']['input']
	data: ChangeChatnameInput
}>

export type ChangeChatNameMutation = {
	__typename?: 'Mutation'
	changeChatName: {
		__typename?: 'Chatroom'
		id?: string | null
		name?: string | null
		updatedAt?: any | null
	}
}

export type CreateChatroomMutationVariables = Exact<{
	name: Scalars['String']['input']
}>

export type CreateChatroomMutation = {
	__typename?: 'Mutation'
	createChatroom: {
		__typename?: 'Chatroom'
		name?: string | null
		id?: string | null
	}
}

export type DeleteChatroomMutationVariables = Exact<{
	chatroomId: Scalars['Float']['input']
}>

export type DeleteChatroomMutation = {
	__typename?: 'Mutation'
	deleteChatroom: string
}

export type EnterChatroomMutationVariables = Exact<{
	chatroomId: Scalars['Int']['input']
}>

export type EnterChatroomMutation = {
	__typename?: 'Mutation'
	enterChatroom: boolean
}

export type LeaveChatroomMutationVariables = Exact<{
	chatroomId: Scalars['Int']['input']
}>

export type LeaveChatroomMutation = {
	__typename?: 'Mutation'
	leaveChatroom: boolean
}

export type SendMessageMutationVariables = Exact<{
	chatroomId: Scalars['Float']['input']
	content: Scalars['String']['input']
	file?: InputMaybe<Scalars['Upload']['input']>
}>

export type SendMessageMutation = {
	__typename?: 'Mutation'
	sendMessage: {
		__typename?: 'Message'
		id?: string | null
		content?: string | null
		imageUrl?: string | null
		user?: {
			__typename?: 'UserModel'
			id: string
			username: string
			email: string
		} | null
	}
}

export type UserStartedTypingMutationMutationVariables = Exact<{
	chatroomId: Scalars['Float']['input']
}>

export type UserStartedTypingMutationMutation = {
	__typename?: 'Mutation'
	userStartedTypingMutation: {
		__typename?: 'UserModel'
		id: string
		username: string
		email: string
	}
}

export type UserStoppedTypingMutationMutationVariables = Exact<{
	chatroomId: Scalars['Float']['input']
}>

export type UserStoppedTypingMutationMutation = {
	__typename?: 'Mutation'
	userStoppedTypingMutation: {
		__typename?: 'UserModel'
		id: string
		username: string
		email: string
	}
}

export type ChangeEmailMutationVariables = Exact<{
	data: ChangeEmailInput
}>

export type ChangeEmailMutation = {
	__typename?: 'Mutation'
	changeEmail: boolean
}

export type ChangeNotificationsSettingsMutationVariables = Exact<{
	data: ChangeNotificationsSettingsInput
}>

export type ChangeNotificationsSettingsMutation = {
	__typename?: 'Mutation'
	changeNotificationsSettings: {
		__typename?: 'ChangeNotificationsSettingsResponse'
		telegramAuthToken?: string | null
		notificationSettings: {
			__typename?: 'NotificationSettingsModel'
			siteNotifications: boolean
			telegramNotifications: boolean
		}
	}
}

export type ChangePasswordMutationVariables = Exact<{
	data: ChangePasswordInput
}>

export type ChangePasswordMutation = {
	__typename?: 'Mutation'
	changePassword: boolean
}

export type ChangeProfileAvatarMutationVariables = Exact<{
	avatar: Scalars['Upload']['input']
}>

export type ChangeProfileAvatarMutation = {
	__typename?: 'Mutation'
	changeProfileAvatar: boolean
}

export type ChangeProfileInfoMutationVariables = Exact<{
	data: ChangeProfileInfoInput
}>

export type ChangeProfileInfoMutation = {
	__typename?: 'Mutation'
	changeProfileInfo: boolean
}

export type ClearSessionCookieMutationVariables = Exact<{
	[key: string]: never
}>

export type ClearSessionCookieMutation = {
	__typename?: 'Mutation'
	clearSessionCookie: boolean
}

export type CreateSocialLinkMutationVariables = Exact<{
	data: SocialLinkInput
}>

export type CreateSocialLinkMutation = {
	__typename?: 'Mutation'
	createSocialLink: boolean
}

export type DisableTotpMutationVariables = Exact<{ [key: string]: never }>

export type DisableTotpMutation = {
	__typename?: 'Mutation'
	disableTotp: boolean
}

export type EnableTotpMutationVariables = Exact<{
	data: EnableTotpInput
}>

export type EnableTotpMutation = {
	__typename?: 'Mutation'
	enableTotp: boolean
}

export type RemoveProfileAvatarMutationVariables = Exact<{
	[key: string]: never
}>

export type RemoveProfileAvatarMutation = {
	__typename?: 'Mutation'
	removeProfileAvatar: boolean
}

export type RemoveSessionMutationVariables = Exact<{
	id: Scalars['String']['input']
}>

export type RemoveSessionMutation = {
	__typename?: 'Mutation'
	removeSession: boolean
}

export type RemoveSocialLinkMutationVariables = Exact<{
	id: Scalars['String']['input']
}>

export type RemoveSocialLinkMutation = {
	__typename?: 'Mutation'
	removeSocialLink: boolean
}

export type ReorderSocialLinksMutationVariables = Exact<{
	list: Array<SocialLinkOrderInput> | SocialLinkOrderInput
}>

export type ReorderSocialLinksMutation = {
	__typename?: 'Mutation'
	reorderSocialLinks: boolean
}

export type UpdateSocialLinkMutationVariables = Exact<{
	id: Scalars['String']['input']
	data: SocialLinkInput
}>

export type UpdateSocialLinkMutation = {
	__typename?: 'Mutation'
	updateSocialLink: boolean
}

export type GetChatroomsForUserQueryVariables = Exact<{
	userId: Scalars['String']['input']
}>

export type GetChatroomsForUserQuery = {
	__typename?: 'Query'
	getChatroomsForUser: Array<{
		__typename?: 'Chatroom'
		id?: string | null
		name?: string | null
		messages?: Array<{
			__typename?: 'Message'
			id?: string | null
			content?: string | null
			createdAt?: any | null
			user?: {
				__typename?: 'UserModel'
				id: string
				username: string
			} | null
		}> | null
		ChatroomUsers?: Array<{
			__typename?: 'ChatroomUsers'
			role?: string | null
			user: {
				__typename?: 'UserModel'
				id: string
				username: string
				email: string
				avatar?: string | null
			}
		}> | null
	}>
}

export type GetMessagesForChatroomQueryVariables = Exact<{
	chatroomId: Scalars['Float']['input']
}>

export type GetMessagesForChatroomQuery = {
	__typename?: 'Query'
	getMessagesForChatroom: Array<{
		__typename?: 'Message'
		id?: string | null
		content?: string | null
		imageUrl?: string | null
		createdAt?: any | null
		user?: {
			__typename?: 'UserModel'
			id: string
			username: string
			email: string
			avatar?: string | null
		} | null
		chatroom?: {
			__typename?: 'Chatroom'
			id?: string | null
			name?: string | null
			ChatroomUsers?: Array<{
				__typename?: 'ChatroomUsers'
				user: {
					__typename?: 'UserModel'
					id: string
					username: string
					email: string
					avatar?: string | null
				}
			}> | null
		} | null
	}>
}

export type GetUsersOfChatroomQueryVariables = Exact<{
	chatroomId: Scalars['Float']['input']
}>

export type GetUsersOfChatroomQuery = {
	__typename?: 'Query'
	getUsersOfChatroom: Array<{
		__typename?: 'UserModel'
		id: string
		username: string
		email: string
		avatar?: string | null
	}>
}

export type SearchUsersQueryVariables = Exact<{
	fullname: Scalars['String']['input']
}>

export type SearchUsersQuery = {
	__typename?: 'Query'
	searchUsers: Array<{
		__typename?: 'UserModel'
		id: string
		username: string
		email: string
	}>
}

export type FindCurrentSessionQueryVariables = Exact<{ [key: string]: never }>

export type FindCurrentSessionQuery = {
	__typename?: 'Query'
	findCurrentSession: {
		__typename?: 'SessionModel'
		id: string
		createdAt: string
		metadata: {
			__typename?: 'SessionMetadataModel'
			ip: string
			location: {
				__typename?: 'LocationModel'
				country: string
				city: string
				latidute: number
				longitude: number
			}
			device: { __typename?: 'DeviceModel'; browser: string; os: string }
		}
	}
}

export type FindNotificationsByUserQueryVariables = Exact<{
	[key: string]: never
}>

export type FindNotificationsByUserQuery = {
	__typename?: 'Query'
	findNotificationsByUser: Array<{
		__typename?: 'NotificationModel'
		id: string
		message: string
		type: NotificationType
	}>
}

export type FindNotificationsUnreadCountQueryVariables = Exact<{
	[key: string]: never
}>

export type FindNotificationsUnreadCountQuery = {
	__typename?: 'Query'
	findNotificationsUnreadCount: number
}

export type FindProfileQueryVariables = Exact<{ [key: string]: never }>

export type FindProfileQuery = {
	__typename?: 'Query'
	findProfile: {
		__typename?: 'UserModel'
		id: string
		username: string
		displayName: string
		email: string
		avatar?: string | null
		bio?: string | null
		isVerified: boolean
		isTotpEnabled: boolean
		notificationSettings?: {
			__typename?: 'NotificationSettingsModel'
			siteNotifications: boolean
			telegramNotifications: boolean
		} | null
	}
}

export type FindSessionsByUserQueryVariables = Exact<{ [key: string]: never }>

export type FindSessionsByUserQuery = {
	__typename?: 'Query'
	findSessionsByUser: Array<{
		__typename?: 'SessionModel'
		id: string
		createdAt: string
		metadata: {
			__typename?: 'SessionMetadataModel'
			ip: string
			location: {
				__typename?: 'LocationModel'
				country: string
				city: string
				latidute: number
				longitude: number
			}
			device: { __typename?: 'DeviceModel'; browser: string; os: string }
		}
	}>
}

export type FindSocialLinksQueryVariables = Exact<{ [key: string]: never }>

export type FindSocialLinksQuery = {
	__typename?: 'Query'
	findSocialLinks: Array<{
		__typename?: 'SocialLinkModel'
		id: string
		title: string
		url: string
		position: number
	}>
}

export type GenerateTotpSecretQueryVariables = Exact<{ [key: string]: never }>

export type GenerateTotpSecretQuery = {
	__typename?: 'Query'
	generateTotpSecret: {
		__typename?: 'TotpModel'
		qrcodeUrl: string
		secret: string
	}
}

export type LiveUsersInChatroomSubscriptionVariables = Exact<{
	chatroomId: Scalars['Int']['input']
}>

export type LiveUsersInChatroomSubscription = {
	__typename?: 'Subscription'
	liveUsersInChatroom?: Array<{
		__typename?: 'UserModel'
		id: string
		username: string
		avatar?: string | null
		email: string
	}> | null
}

export type NewMessageSubscriptionVariables = Exact<{
	chatroomId: Scalars['Float']['input']
}>

export type NewMessageSubscription = {
	__typename?: 'Subscription'
	newMessage?: {
		__typename?: 'Message'
		id?: string | null
		content?: string | null
		imageUrl?: string | null
		createdAt?: any | null
		user?: {
			__typename?: 'UserModel'
			id: string
			username: string
			email: string
			avatar?: string | null
		} | null
	} | null
}

export type UserStartedTypingSubscriptionVariables = Exact<{
	chatroomId: Scalars['Float']['input']
	userId: Scalars['String']['input']
}>

export type UserStartedTypingSubscription = {
	__typename?: 'Subscription'
	userStartedTyping?: {
		__typename?: 'UserModel'
		id: string
		username: string
		email: string
		avatar?: string | null
	} | null
}

export type UserStoppedTypingSubscriptionVariables = Exact<{
	chatroomId: Scalars['Float']['input']
	userId: Scalars['String']['input']
}>

export type UserStoppedTypingSubscription = {
	__typename?: 'Subscription'
	userStoppedTyping?: {
		__typename?: 'UserModel'
		id: string
		username: string
		email: string
		avatar?: string | null
	} | null
}

export const CreateUserDocument = gql`
	mutation CreateUser($data: CreateUserInput!) {
		createUser(data: $data)
	}
`
export type CreateUserMutationFn = Apollo.MutationFunction<
	CreateUserMutation,
	CreateUserMutationVariables
>

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateUserMutation(
	baseOptions?: Apollo.MutationHookOptions<
		CreateUserMutation,
		CreateUserMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(
		CreateUserDocument,
		options
	)
}
export type CreateUserMutationHookResult = ReturnType<
	typeof useCreateUserMutation
>
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<
	CreateUserMutation,
	CreateUserMutationVariables
>
export const DeactivateAccountDocument = gql`
	mutation DeactivateAccount($data: DeactivateAccountInput!) {
		deactivateAccount(data: $data) {
			user {
				isDeactivated
			}
			message
		}
	}
`
export type DeactivateAccountMutationFn = Apollo.MutationFunction<
	DeactivateAccountMutation,
	DeactivateAccountMutationVariables
>

/**
 * __useDeactivateAccountMutation__
 *
 * To run a mutation, you first call `useDeactivateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeactivateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deactivateAccountMutation, { data, loading, error }] = useDeactivateAccountMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDeactivateAccountMutation(
	baseOptions?: Apollo.MutationHookOptions<
		DeactivateAccountMutation,
		DeactivateAccountMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		DeactivateAccountMutation,
		DeactivateAccountMutationVariables
	>(DeactivateAccountDocument, options)
}
export type DeactivateAccountMutationHookResult = ReturnType<
	typeof useDeactivateAccountMutation
>
export type DeactivateAccountMutationResult =
	Apollo.MutationResult<DeactivateAccountMutation>
export type DeactivateAccountMutationOptions = Apollo.BaseMutationOptions<
	DeactivateAccountMutation,
	DeactivateAccountMutationVariables
>
export const LoginUserDocument = gql`
	mutation LoginUser($data: LoginInput!) {
		loginUser(data: $data) {
			user {
				username
			}
			message
		}
	}
`
export type LoginUserMutationFn = Apollo.MutationFunction<
	LoginUserMutation,
	LoginUserMutationVariables
>

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLoginUserMutation(
	baseOptions?: Apollo.MutationHookOptions<
		LoginUserMutation,
		LoginUserMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<LoginUserMutation, LoginUserMutationVariables>(
		LoginUserDocument,
		options
	)
}
export type LoginUserMutationHookResult = ReturnType<
	typeof useLoginUserMutation
>
export type LoginUserMutationResult = Apollo.MutationResult<LoginUserMutation>
export type LoginUserMutationOptions = Apollo.BaseMutationOptions<
	LoginUserMutation,
	LoginUserMutationVariables
>
export const LogoutUserDocument = gql`
	mutation LogoutUser {
		logoutUser
	}
`
export type LogoutUserMutationFn = Apollo.MutationFunction<
	LogoutUserMutation,
	LogoutUserMutationVariables
>

/**
 * __useLogoutUserMutation__
 *
 * To run a mutation, you first call `useLogoutUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutUserMutation, { data, loading, error }] = useLogoutUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutUserMutation(
	baseOptions?: Apollo.MutationHookOptions<
		LogoutUserMutation,
		LogoutUserMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<LogoutUserMutation, LogoutUserMutationVariables>(
		LogoutUserDocument,
		options
	)
}
export type LogoutUserMutationHookResult = ReturnType<
	typeof useLogoutUserMutation
>
export type LogoutUserMutationResult = Apollo.MutationResult<LogoutUserMutation>
export type LogoutUserMutationOptions = Apollo.BaseMutationOptions<
	LogoutUserMutation,
	LogoutUserMutationVariables
>
export const NewPasswordDocument = gql`
	mutation NewPassword($data: NewPasswordInput!) {
		newPassword(data: $data)
	}
`
export type NewPasswordMutationFn = Apollo.MutationFunction<
	NewPasswordMutation,
	NewPasswordMutationVariables
>

/**
 * __useNewPasswordMutation__
 *
 * To run a mutation, you first call `useNewPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNewPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [newPasswordMutation, { data, loading, error }] = useNewPasswordMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useNewPasswordMutation(
	baseOptions?: Apollo.MutationHookOptions<
		NewPasswordMutation,
		NewPasswordMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		NewPasswordMutation,
		NewPasswordMutationVariables
	>(NewPasswordDocument, options)
}
export type NewPasswordMutationHookResult = ReturnType<
	typeof useNewPasswordMutation
>
export type NewPasswordMutationResult =
	Apollo.MutationResult<NewPasswordMutation>
export type NewPasswordMutationOptions = Apollo.BaseMutationOptions<
	NewPasswordMutation,
	NewPasswordMutationVariables
>
export const ResetPasswordDocument = gql`
	mutation ResetPassword($data: ResetPasswordInput!) {
		resetPassword(data: $data)
	}
`
export type ResetPasswordMutationFn = Apollo.MutationFunction<
	ResetPasswordMutation,
	ResetPasswordMutationVariables
>

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useResetPasswordMutation(
	baseOptions?: Apollo.MutationHookOptions<
		ResetPasswordMutation,
		ResetPasswordMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		ResetPasswordMutation,
		ResetPasswordMutationVariables
	>(ResetPasswordDocument, options)
}
export type ResetPasswordMutationHookResult = ReturnType<
	typeof useResetPasswordMutation
>
export type ResetPasswordMutationResult =
	Apollo.MutationResult<ResetPasswordMutation>
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<
	ResetPasswordMutation,
	ResetPasswordMutationVariables
>
export const VerifyAccountDocument = gql`
	mutation VerifyAccount($data: VerificationInput!) {
		verifyAccount(data: $data) {
			user {
				isEmailVerified
			}
			message
		}
	}
`
export type VerifyAccountMutationFn = Apollo.MutationFunction<
	VerifyAccountMutation,
	VerifyAccountMutationVariables
>

/**
 * __useVerifyAccountMutation__
 *
 * To run a mutation, you first call `useVerifyAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyAccountMutation, { data, loading, error }] = useVerifyAccountMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useVerifyAccountMutation(
	baseOptions?: Apollo.MutationHookOptions<
		VerifyAccountMutation,
		VerifyAccountMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		VerifyAccountMutation,
		VerifyAccountMutationVariables
	>(VerifyAccountDocument, options)
}
export type VerifyAccountMutationHookResult = ReturnType<
	typeof useVerifyAccountMutation
>
export type VerifyAccountMutationResult =
	Apollo.MutationResult<VerifyAccountMutation>
export type VerifyAccountMutationOptions = Apollo.BaseMutationOptions<
	VerifyAccountMutation,
	VerifyAccountMutationVariables
>
export const AddUsersToChatroomDocument = gql`
	mutation AddUsersToChatroom($chatroomId: Float!, $userIds: [String!]!) {
		addUsersToChatroom(chatroomId: $chatroomId, userIds: $userIds) {
			name
			id
		}
	}
`
export type AddUsersToChatroomMutationFn = Apollo.MutationFunction<
	AddUsersToChatroomMutation,
	AddUsersToChatroomMutationVariables
>

/**
 * __useAddUsersToChatroomMutation__
 *
 * To run a mutation, you first call `useAddUsersToChatroomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUsersToChatroomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUsersToChatroomMutation, { data, loading, error }] = useAddUsersToChatroomMutation({
 *   variables: {
 *      chatroomId: // value for 'chatroomId'
 *      userIds: // value for 'userIds'
 *   },
 * });
 */
export function useAddUsersToChatroomMutation(
	baseOptions?: Apollo.MutationHookOptions<
		AddUsersToChatroomMutation,
		AddUsersToChatroomMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		AddUsersToChatroomMutation,
		AddUsersToChatroomMutationVariables
	>(AddUsersToChatroomDocument, options)
}
export type AddUsersToChatroomMutationHookResult = ReturnType<
	typeof useAddUsersToChatroomMutation
>
export type AddUsersToChatroomMutationResult =
	Apollo.MutationResult<AddUsersToChatroomMutation>
export type AddUsersToChatroomMutationOptions = Apollo.BaseMutationOptions<
	AddUsersToChatroomMutation,
	AddUsersToChatroomMutationVariables
>
export const ChangeChatNameDocument = gql`
	mutation changeChatName($chatroomId: Float!, $data: ChangeChatnameInput!) {
		changeChatName(chatroomId: $chatroomId, data: $data) {
			id
			name
			updatedAt
		}
	}
`
export type ChangeChatNameMutationFn = Apollo.MutationFunction<
	ChangeChatNameMutation,
	ChangeChatNameMutationVariables
>

/**
 * __useChangeChatNameMutation__
 *
 * To run a mutation, you first call `useChangeChatNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeChatNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeChatNameMutation, { data, loading, error }] = useChangeChatNameMutation({
 *   variables: {
 *      chatroomId: // value for 'chatroomId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useChangeChatNameMutation(
	baseOptions?: Apollo.MutationHookOptions<
		ChangeChatNameMutation,
		ChangeChatNameMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		ChangeChatNameMutation,
		ChangeChatNameMutationVariables
	>(ChangeChatNameDocument, options)
}
export type ChangeChatNameMutationHookResult = ReturnType<
	typeof useChangeChatNameMutation
>
export type ChangeChatNameMutationResult =
	Apollo.MutationResult<ChangeChatNameMutation>
export type ChangeChatNameMutationOptions = Apollo.BaseMutationOptions<
	ChangeChatNameMutation,
	ChangeChatNameMutationVariables
>
export const CreateChatroomDocument = gql`
	mutation CreateChatroom($name: String!) {
		createChatroom(name: $name) {
			name
			id
		}
	}
`
export type CreateChatroomMutationFn = Apollo.MutationFunction<
	CreateChatroomMutation,
	CreateChatroomMutationVariables
>

/**
 * __useCreateChatroomMutation__
 *
 * To run a mutation, you first call `useCreateChatroomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChatroomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChatroomMutation, { data, loading, error }] = useCreateChatroomMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateChatroomMutation(
	baseOptions?: Apollo.MutationHookOptions<
		CreateChatroomMutation,
		CreateChatroomMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		CreateChatroomMutation,
		CreateChatroomMutationVariables
	>(CreateChatroomDocument, options)
}
export type CreateChatroomMutationHookResult = ReturnType<
	typeof useCreateChatroomMutation
>
export type CreateChatroomMutationResult =
	Apollo.MutationResult<CreateChatroomMutation>
export type CreateChatroomMutationOptions = Apollo.BaseMutationOptions<
	CreateChatroomMutation,
	CreateChatroomMutationVariables
>
export const DeleteChatroomDocument = gql`
	mutation DeleteChatroom($chatroomId: Float!) {
		deleteChatroom(chatroomId: $chatroomId)
	}
`
export type DeleteChatroomMutationFn = Apollo.MutationFunction<
	DeleteChatroomMutation,
	DeleteChatroomMutationVariables
>

/**
 * __useDeleteChatroomMutation__
 *
 * To run a mutation, you first call `useDeleteChatroomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteChatroomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteChatroomMutation, { data, loading, error }] = useDeleteChatroomMutation({
 *   variables: {
 *      chatroomId: // value for 'chatroomId'
 *   },
 * });
 */
export function useDeleteChatroomMutation(
	baseOptions?: Apollo.MutationHookOptions<
		DeleteChatroomMutation,
		DeleteChatroomMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		DeleteChatroomMutation,
		DeleteChatroomMutationVariables
	>(DeleteChatroomDocument, options)
}
export type DeleteChatroomMutationHookResult = ReturnType<
	typeof useDeleteChatroomMutation
>
export type DeleteChatroomMutationResult =
	Apollo.MutationResult<DeleteChatroomMutation>
export type DeleteChatroomMutationOptions = Apollo.BaseMutationOptions<
	DeleteChatroomMutation,
	DeleteChatroomMutationVariables
>
export const EnterChatroomDocument = gql`
	mutation EnterChatroom($chatroomId: Int!) {
		enterChatroom(chatroomId: $chatroomId)
	}
`
export type EnterChatroomMutationFn = Apollo.MutationFunction<
	EnterChatroomMutation,
	EnterChatroomMutationVariables
>

/**
 * __useEnterChatroomMutation__
 *
 * To run a mutation, you first call `useEnterChatroomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnterChatroomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [enterChatroomMutation, { data, loading, error }] = useEnterChatroomMutation({
 *   variables: {
 *      chatroomId: // value for 'chatroomId'
 *   },
 * });
 */
export function useEnterChatroomMutation(
	baseOptions?: Apollo.MutationHookOptions<
		EnterChatroomMutation,
		EnterChatroomMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		EnterChatroomMutation,
		EnterChatroomMutationVariables
	>(EnterChatroomDocument, options)
}
export type EnterChatroomMutationHookResult = ReturnType<
	typeof useEnterChatroomMutation
>
export type EnterChatroomMutationResult =
	Apollo.MutationResult<EnterChatroomMutation>
export type EnterChatroomMutationOptions = Apollo.BaseMutationOptions<
	EnterChatroomMutation,
	EnterChatroomMutationVariables
>
export const LeaveChatroomDocument = gql`
	mutation LeaveChatroom($chatroomId: Int!) {
		leaveChatroom(chatroomId: $chatroomId)
	}
`
export type LeaveChatroomMutationFn = Apollo.MutationFunction<
	LeaveChatroomMutation,
	LeaveChatroomMutationVariables
>

/**
 * __useLeaveChatroomMutation__
 *
 * To run a mutation, you first call `useLeaveChatroomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveChatroomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveChatroomMutation, { data, loading, error }] = useLeaveChatroomMutation({
 *   variables: {
 *      chatroomId: // value for 'chatroomId'
 *   },
 * });
 */
export function useLeaveChatroomMutation(
	baseOptions?: Apollo.MutationHookOptions<
		LeaveChatroomMutation,
		LeaveChatroomMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		LeaveChatroomMutation,
		LeaveChatroomMutationVariables
	>(LeaveChatroomDocument, options)
}
export type LeaveChatroomMutationHookResult = ReturnType<
	typeof useLeaveChatroomMutation
>
export type LeaveChatroomMutationResult =
	Apollo.MutationResult<LeaveChatroomMutation>
export type LeaveChatroomMutationOptions = Apollo.BaseMutationOptions<
	LeaveChatroomMutation,
	LeaveChatroomMutationVariables
>
export const SendMessageDocument = gql`
	mutation SendMessage(
		$chatroomId: Float!
		$content: String!
		$file: Upload
	) {
		sendMessage(chatroomId: $chatroomId, content: $content, file: $file) {
			id
			content
			imageUrl
			user {
				id
				username
				email
			}
		}
	}
`
export type SendMessageMutationFn = Apollo.MutationFunction<
	SendMessageMutation,
	SendMessageMutationVariables
>

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      chatroomId: // value for 'chatroomId'
 *      content: // value for 'content'
 *      file: // value for 'file'
 *   },
 * });
 */
export function useSendMessageMutation(
	baseOptions?: Apollo.MutationHookOptions<
		SendMessageMutation,
		SendMessageMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		SendMessageMutation,
		SendMessageMutationVariables
	>(SendMessageDocument, options)
}
export type SendMessageMutationHookResult = ReturnType<
	typeof useSendMessageMutation
>
export type SendMessageMutationResult =
	Apollo.MutationResult<SendMessageMutation>
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<
	SendMessageMutation,
	SendMessageMutationVariables
>
export const UserStartedTypingMutationDocument = gql`
	mutation UserStartedTypingMutation($chatroomId: Float!) {
		userStartedTypingMutation(chatroomId: $chatroomId) {
			id
			username
			email
		}
	}
`
export type UserStartedTypingMutationMutationFn = Apollo.MutationFunction<
	UserStartedTypingMutationMutation,
	UserStartedTypingMutationMutationVariables
>

/**
 * __useUserStartedTypingMutationMutation__
 *
 * To run a mutation, you first call `useUserStartedTypingMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserStartedTypingMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userStartedTypingMutationMutation, { data, loading, error }] = useUserStartedTypingMutationMutation({
 *   variables: {
 *      chatroomId: // value for 'chatroomId'
 *   },
 * });
 */
export function useUserStartedTypingMutationMutation(
	baseOptions?: Apollo.MutationHookOptions<
		UserStartedTypingMutationMutation,
		UserStartedTypingMutationMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		UserStartedTypingMutationMutation,
		UserStartedTypingMutationMutationVariables
	>(UserStartedTypingMutationDocument, options)
}
export type UserStartedTypingMutationMutationHookResult = ReturnType<
	typeof useUserStartedTypingMutationMutation
>
export type UserStartedTypingMutationMutationResult =
	Apollo.MutationResult<UserStartedTypingMutationMutation>
export type UserStartedTypingMutationMutationOptions =
	Apollo.BaseMutationOptions<
		UserStartedTypingMutationMutation,
		UserStartedTypingMutationMutationVariables
	>
export const UserStoppedTypingMutationDocument = gql`
	mutation UserStoppedTypingMutation($chatroomId: Float!) {
		userStoppedTypingMutation(chatroomId: $chatroomId) {
			id
			username
			email
		}
	}
`
export type UserStoppedTypingMutationMutationFn = Apollo.MutationFunction<
	UserStoppedTypingMutationMutation,
	UserStoppedTypingMutationMutationVariables
>

/**
 * __useUserStoppedTypingMutationMutation__
 *
 * To run a mutation, you first call `useUserStoppedTypingMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserStoppedTypingMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userStoppedTypingMutationMutation, { data, loading, error }] = useUserStoppedTypingMutationMutation({
 *   variables: {
 *      chatroomId: // value for 'chatroomId'
 *   },
 * });
 */
export function useUserStoppedTypingMutationMutation(
	baseOptions?: Apollo.MutationHookOptions<
		UserStoppedTypingMutationMutation,
		UserStoppedTypingMutationMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		UserStoppedTypingMutationMutation,
		UserStoppedTypingMutationMutationVariables
	>(UserStoppedTypingMutationDocument, options)
}
export type UserStoppedTypingMutationMutationHookResult = ReturnType<
	typeof useUserStoppedTypingMutationMutation
>
export type UserStoppedTypingMutationMutationResult =
	Apollo.MutationResult<UserStoppedTypingMutationMutation>
export type UserStoppedTypingMutationMutationOptions =
	Apollo.BaseMutationOptions<
		UserStoppedTypingMutationMutation,
		UserStoppedTypingMutationMutationVariables
	>
export const ChangeEmailDocument = gql`
	mutation ChangeEmail($data: ChangeEmailInput!) {
		changeEmail(data: $data)
	}
`
export type ChangeEmailMutationFn = Apollo.MutationFunction<
	ChangeEmailMutation,
	ChangeEmailMutationVariables
>

/**
 * __useChangeEmailMutation__
 *
 * To run a mutation, you first call `useChangeEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeEmailMutation, { data, loading, error }] = useChangeEmailMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useChangeEmailMutation(
	baseOptions?: Apollo.MutationHookOptions<
		ChangeEmailMutation,
		ChangeEmailMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		ChangeEmailMutation,
		ChangeEmailMutationVariables
	>(ChangeEmailDocument, options)
}
export type ChangeEmailMutationHookResult = ReturnType<
	typeof useChangeEmailMutation
>
export type ChangeEmailMutationResult =
	Apollo.MutationResult<ChangeEmailMutation>
export type ChangeEmailMutationOptions = Apollo.BaseMutationOptions<
	ChangeEmailMutation,
	ChangeEmailMutationVariables
>
export const ChangeNotificationsSettingsDocument = gql`
	mutation ChangeNotificationsSettings(
		$data: ChangeNotificationsSettingsInput!
	) {
		changeNotificationsSettings(data: $data) {
			notificationSettings {
				siteNotifications
				telegramNotifications
			}
			telegramAuthToken
		}
	}
`
export type ChangeNotificationsSettingsMutationFn = Apollo.MutationFunction<
	ChangeNotificationsSettingsMutation,
	ChangeNotificationsSettingsMutationVariables
>

/**
 * __useChangeNotificationsSettingsMutation__
 *
 * To run a mutation, you first call `useChangeNotificationsSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeNotificationsSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeNotificationsSettingsMutation, { data, loading, error }] = useChangeNotificationsSettingsMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useChangeNotificationsSettingsMutation(
	baseOptions?: Apollo.MutationHookOptions<
		ChangeNotificationsSettingsMutation,
		ChangeNotificationsSettingsMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		ChangeNotificationsSettingsMutation,
		ChangeNotificationsSettingsMutationVariables
	>(ChangeNotificationsSettingsDocument, options)
}
export type ChangeNotificationsSettingsMutationHookResult = ReturnType<
	typeof useChangeNotificationsSettingsMutation
>
export type ChangeNotificationsSettingsMutationResult =
	Apollo.MutationResult<ChangeNotificationsSettingsMutation>
export type ChangeNotificationsSettingsMutationOptions =
	Apollo.BaseMutationOptions<
		ChangeNotificationsSettingsMutation,
		ChangeNotificationsSettingsMutationVariables
	>
export const ChangePasswordDocument = gql`
	mutation ChangePassword($data: ChangePasswordInput!) {
		changePassword(data: $data)
	}
`
export type ChangePasswordMutationFn = Apollo.MutationFunction<
	ChangePasswordMutation,
	ChangePasswordMutationVariables
>

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useChangePasswordMutation(
	baseOptions?: Apollo.MutationHookOptions<
		ChangePasswordMutation,
		ChangePasswordMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		ChangePasswordMutation,
		ChangePasswordMutationVariables
	>(ChangePasswordDocument, options)
}
export type ChangePasswordMutationHookResult = ReturnType<
	typeof useChangePasswordMutation
>
export type ChangePasswordMutationResult =
	Apollo.MutationResult<ChangePasswordMutation>
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<
	ChangePasswordMutation,
	ChangePasswordMutationVariables
>
export const ChangeProfileAvatarDocument = gql`
	mutation ChangeProfileAvatar($avatar: Upload!) {
		changeProfileAvatar(avatar: $avatar)
	}
`
export type ChangeProfileAvatarMutationFn = Apollo.MutationFunction<
	ChangeProfileAvatarMutation,
	ChangeProfileAvatarMutationVariables
>

/**
 * __useChangeProfileAvatarMutation__
 *
 * To run a mutation, you first call `useChangeProfileAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeProfileAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeProfileAvatarMutation, { data, loading, error }] = useChangeProfileAvatarMutation({
 *   variables: {
 *      avatar: // value for 'avatar'
 *   },
 * });
 */
export function useChangeProfileAvatarMutation(
	baseOptions?: Apollo.MutationHookOptions<
		ChangeProfileAvatarMutation,
		ChangeProfileAvatarMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		ChangeProfileAvatarMutation,
		ChangeProfileAvatarMutationVariables
	>(ChangeProfileAvatarDocument, options)
}
export type ChangeProfileAvatarMutationHookResult = ReturnType<
	typeof useChangeProfileAvatarMutation
>
export type ChangeProfileAvatarMutationResult =
	Apollo.MutationResult<ChangeProfileAvatarMutation>
export type ChangeProfileAvatarMutationOptions = Apollo.BaseMutationOptions<
	ChangeProfileAvatarMutation,
	ChangeProfileAvatarMutationVariables
>
export const ChangeProfileInfoDocument = gql`
	mutation ChangeProfileInfo($data: ChangeProfileInfoInput!) {
		changeProfileInfo(data: $data)
	}
`
export type ChangeProfileInfoMutationFn = Apollo.MutationFunction<
	ChangeProfileInfoMutation,
	ChangeProfileInfoMutationVariables
>

/**
 * __useChangeProfileInfoMutation__
 *
 * To run a mutation, you first call `useChangeProfileInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeProfileInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeProfileInfoMutation, { data, loading, error }] = useChangeProfileInfoMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useChangeProfileInfoMutation(
	baseOptions?: Apollo.MutationHookOptions<
		ChangeProfileInfoMutation,
		ChangeProfileInfoMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		ChangeProfileInfoMutation,
		ChangeProfileInfoMutationVariables
	>(ChangeProfileInfoDocument, options)
}
export type ChangeProfileInfoMutationHookResult = ReturnType<
	typeof useChangeProfileInfoMutation
>
export type ChangeProfileInfoMutationResult =
	Apollo.MutationResult<ChangeProfileInfoMutation>
export type ChangeProfileInfoMutationOptions = Apollo.BaseMutationOptions<
	ChangeProfileInfoMutation,
	ChangeProfileInfoMutationVariables
>
export const ClearSessionCookieDocument = gql`
	mutation ClearSessionCookie {
		clearSessionCookie
	}
`
export type ClearSessionCookieMutationFn = Apollo.MutationFunction<
	ClearSessionCookieMutation,
	ClearSessionCookieMutationVariables
>

/**
 * __useClearSessionCookieMutation__
 *
 * To run a mutation, you first call `useClearSessionCookieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClearSessionCookieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [clearSessionCookieMutation, { data, loading, error }] = useClearSessionCookieMutation({
 *   variables: {
 *   },
 * });
 */
export function useClearSessionCookieMutation(
	baseOptions?: Apollo.MutationHookOptions<
		ClearSessionCookieMutation,
		ClearSessionCookieMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		ClearSessionCookieMutation,
		ClearSessionCookieMutationVariables
	>(ClearSessionCookieDocument, options)
}
export type ClearSessionCookieMutationHookResult = ReturnType<
	typeof useClearSessionCookieMutation
>
export type ClearSessionCookieMutationResult =
	Apollo.MutationResult<ClearSessionCookieMutation>
export type ClearSessionCookieMutationOptions = Apollo.BaseMutationOptions<
	ClearSessionCookieMutation,
	ClearSessionCookieMutationVariables
>
export const CreateSocialLinkDocument = gql`
	mutation CreateSocialLink($data: SocialLinkInput!) {
		createSocialLink(data: $data)
	}
`
export type CreateSocialLinkMutationFn = Apollo.MutationFunction<
	CreateSocialLinkMutation,
	CreateSocialLinkMutationVariables
>

/**
 * __useCreateSocialLinkMutation__
 *
 * To run a mutation, you first call `useCreateSocialLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSocialLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSocialLinkMutation, { data, loading, error }] = useCreateSocialLinkMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateSocialLinkMutation(
	baseOptions?: Apollo.MutationHookOptions<
		CreateSocialLinkMutation,
		CreateSocialLinkMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		CreateSocialLinkMutation,
		CreateSocialLinkMutationVariables
	>(CreateSocialLinkDocument, options)
}
export type CreateSocialLinkMutationHookResult = ReturnType<
	typeof useCreateSocialLinkMutation
>
export type CreateSocialLinkMutationResult =
	Apollo.MutationResult<CreateSocialLinkMutation>
export type CreateSocialLinkMutationOptions = Apollo.BaseMutationOptions<
	CreateSocialLinkMutation,
	CreateSocialLinkMutationVariables
>
export const DisableTotpDocument = gql`
	mutation DisableTotp {
		disableTotp
	}
`
export type DisableTotpMutationFn = Apollo.MutationFunction<
	DisableTotpMutation,
	DisableTotpMutationVariables
>

/**
 * __useDisableTotpMutation__
 *
 * To run a mutation, you first call `useDisableTotpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDisableTotpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [disableTotpMutation, { data, loading, error }] = useDisableTotpMutation({
 *   variables: {
 *   },
 * });
 */
export function useDisableTotpMutation(
	baseOptions?: Apollo.MutationHookOptions<
		DisableTotpMutation,
		DisableTotpMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		DisableTotpMutation,
		DisableTotpMutationVariables
	>(DisableTotpDocument, options)
}
export type DisableTotpMutationHookResult = ReturnType<
	typeof useDisableTotpMutation
>
export type DisableTotpMutationResult =
	Apollo.MutationResult<DisableTotpMutation>
export type DisableTotpMutationOptions = Apollo.BaseMutationOptions<
	DisableTotpMutation,
	DisableTotpMutationVariables
>
export const EnableTotpDocument = gql`
	mutation EnableTotp($data: EnableTotpInput!) {
		enableTotp(data: $data)
	}
`
export type EnableTotpMutationFn = Apollo.MutationFunction<
	EnableTotpMutation,
	EnableTotpMutationVariables
>

/**
 * __useEnableTotpMutation__
 *
 * To run a mutation, you first call `useEnableTotpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnableTotpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [enableTotpMutation, { data, loading, error }] = useEnableTotpMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useEnableTotpMutation(
	baseOptions?: Apollo.MutationHookOptions<
		EnableTotpMutation,
		EnableTotpMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<EnableTotpMutation, EnableTotpMutationVariables>(
		EnableTotpDocument,
		options
	)
}
export type EnableTotpMutationHookResult = ReturnType<
	typeof useEnableTotpMutation
>
export type EnableTotpMutationResult = Apollo.MutationResult<EnableTotpMutation>
export type EnableTotpMutationOptions = Apollo.BaseMutationOptions<
	EnableTotpMutation,
	EnableTotpMutationVariables
>
export const RemoveProfileAvatarDocument = gql`
	mutation RemoveProfileAvatar {
		removeProfileAvatar
	}
`
export type RemoveProfileAvatarMutationFn = Apollo.MutationFunction<
	RemoveProfileAvatarMutation,
	RemoveProfileAvatarMutationVariables
>

/**
 * __useRemoveProfileAvatarMutation__
 *
 * To run a mutation, you first call `useRemoveProfileAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveProfileAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeProfileAvatarMutation, { data, loading, error }] = useRemoveProfileAvatarMutation({
 *   variables: {
 *   },
 * });
 */
export function useRemoveProfileAvatarMutation(
	baseOptions?: Apollo.MutationHookOptions<
		RemoveProfileAvatarMutation,
		RemoveProfileAvatarMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		RemoveProfileAvatarMutation,
		RemoveProfileAvatarMutationVariables
	>(RemoveProfileAvatarDocument, options)
}
export type RemoveProfileAvatarMutationHookResult = ReturnType<
	typeof useRemoveProfileAvatarMutation
>
export type RemoveProfileAvatarMutationResult =
	Apollo.MutationResult<RemoveProfileAvatarMutation>
export type RemoveProfileAvatarMutationOptions = Apollo.BaseMutationOptions<
	RemoveProfileAvatarMutation,
	RemoveProfileAvatarMutationVariables
>
export const RemoveSessionDocument = gql`
	mutation RemoveSession($id: String!) {
		removeSession(id: $id)
	}
`
export type RemoveSessionMutationFn = Apollo.MutationFunction<
	RemoveSessionMutation,
	RemoveSessionMutationVariables
>

/**
 * __useRemoveSessionMutation__
 *
 * To run a mutation, you first call `useRemoveSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeSessionMutation, { data, loading, error }] = useRemoveSessionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveSessionMutation(
	baseOptions?: Apollo.MutationHookOptions<
		RemoveSessionMutation,
		RemoveSessionMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		RemoveSessionMutation,
		RemoveSessionMutationVariables
	>(RemoveSessionDocument, options)
}
export type RemoveSessionMutationHookResult = ReturnType<
	typeof useRemoveSessionMutation
>
export type RemoveSessionMutationResult =
	Apollo.MutationResult<RemoveSessionMutation>
export type RemoveSessionMutationOptions = Apollo.BaseMutationOptions<
	RemoveSessionMutation,
	RemoveSessionMutationVariables
>
export const RemoveSocialLinkDocument = gql`
	mutation RemoveSocialLink($id: String!) {
		removeSocialLink(id: $id)
	}
`
export type RemoveSocialLinkMutationFn = Apollo.MutationFunction<
	RemoveSocialLinkMutation,
	RemoveSocialLinkMutationVariables
>

/**
 * __useRemoveSocialLinkMutation__
 *
 * To run a mutation, you first call `useRemoveSocialLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveSocialLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeSocialLinkMutation, { data, loading, error }] = useRemoveSocialLinkMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveSocialLinkMutation(
	baseOptions?: Apollo.MutationHookOptions<
		RemoveSocialLinkMutation,
		RemoveSocialLinkMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		RemoveSocialLinkMutation,
		RemoveSocialLinkMutationVariables
	>(RemoveSocialLinkDocument, options)
}
export type RemoveSocialLinkMutationHookResult = ReturnType<
	typeof useRemoveSocialLinkMutation
>
export type RemoveSocialLinkMutationResult =
	Apollo.MutationResult<RemoveSocialLinkMutation>
export type RemoveSocialLinkMutationOptions = Apollo.BaseMutationOptions<
	RemoveSocialLinkMutation,
	RemoveSocialLinkMutationVariables
>
export const ReorderSocialLinksDocument = gql`
	mutation ReorderSocialLinks($list: [SocialLinkOrderInput!]!) {
		reorderSocialLinks(list: $list)
	}
`
export type ReorderSocialLinksMutationFn = Apollo.MutationFunction<
	ReorderSocialLinksMutation,
	ReorderSocialLinksMutationVariables
>

/**
 * __useReorderSocialLinksMutation__
 *
 * To run a mutation, you first call `useReorderSocialLinksMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReorderSocialLinksMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reorderSocialLinksMutation, { data, loading, error }] = useReorderSocialLinksMutation({
 *   variables: {
 *      list: // value for 'list'
 *   },
 * });
 */
export function useReorderSocialLinksMutation(
	baseOptions?: Apollo.MutationHookOptions<
		ReorderSocialLinksMutation,
		ReorderSocialLinksMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		ReorderSocialLinksMutation,
		ReorderSocialLinksMutationVariables
	>(ReorderSocialLinksDocument, options)
}
export type ReorderSocialLinksMutationHookResult = ReturnType<
	typeof useReorderSocialLinksMutation
>
export type ReorderSocialLinksMutationResult =
	Apollo.MutationResult<ReorderSocialLinksMutation>
export type ReorderSocialLinksMutationOptions = Apollo.BaseMutationOptions<
	ReorderSocialLinksMutation,
	ReorderSocialLinksMutationVariables
>
export const UpdateSocialLinkDocument = gql`
	mutation UpdateSocialLink($id: String!, $data: SocialLinkInput!) {
		updateSocialLink(id: $id, data: $data)
	}
`
export type UpdateSocialLinkMutationFn = Apollo.MutationFunction<
	UpdateSocialLinkMutation,
	UpdateSocialLinkMutationVariables
>

/**
 * __useUpdateSocialLinkMutation__
 *
 * To run a mutation, you first call `useUpdateSocialLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSocialLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSocialLinkMutation, { data, loading, error }] = useUpdateSocialLinkMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateSocialLinkMutation(
	baseOptions?: Apollo.MutationHookOptions<
		UpdateSocialLinkMutation,
		UpdateSocialLinkMutationVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<
		UpdateSocialLinkMutation,
		UpdateSocialLinkMutationVariables
	>(UpdateSocialLinkDocument, options)
}
export type UpdateSocialLinkMutationHookResult = ReturnType<
	typeof useUpdateSocialLinkMutation
>
export type UpdateSocialLinkMutationResult =
	Apollo.MutationResult<UpdateSocialLinkMutation>
export type UpdateSocialLinkMutationOptions = Apollo.BaseMutationOptions<
	UpdateSocialLinkMutation,
	UpdateSocialLinkMutationVariables
>
export const GetChatroomsForUserDocument = gql`
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

/**
 * __useGetChatroomsForUserQuery__
 *
 * To run a query within a React component, call `useGetChatroomsForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatroomsForUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatroomsForUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetChatroomsForUserQuery(
	baseOptions: Apollo.QueryHookOptions<
		GetChatroomsForUserQuery,
		GetChatroomsForUserQueryVariables
	> &
		(
			| { variables: GetChatroomsForUserQueryVariables; skip?: boolean }
			| { skip: boolean }
		)
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useQuery<
		GetChatroomsForUserQuery,
		GetChatroomsForUserQueryVariables
	>(GetChatroomsForUserDocument, options)
}
export function useGetChatroomsForUserLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<
		GetChatroomsForUserQuery,
		GetChatroomsForUserQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useLazyQuery<
		GetChatroomsForUserQuery,
		GetChatroomsForUserQueryVariables
	>(GetChatroomsForUserDocument, options)
}
export function useGetChatroomsForUserSuspenseQuery(
	baseOptions?:
		| Apollo.SkipToken
		| Apollo.SuspenseQueryHookOptions<
				GetChatroomsForUserQuery,
				GetChatroomsForUserQueryVariables
		  >
) {
	const options =
		baseOptions === Apollo.skipToken
			? baseOptions
			: { ...defaultOptions, ...baseOptions }
	return Apollo.useSuspenseQuery<
		GetChatroomsForUserQuery,
		GetChatroomsForUserQueryVariables
	>(GetChatroomsForUserDocument, options)
}
export type GetChatroomsForUserQueryHookResult = ReturnType<
	typeof useGetChatroomsForUserQuery
>
export type GetChatroomsForUserLazyQueryHookResult = ReturnType<
	typeof useGetChatroomsForUserLazyQuery
>
export type GetChatroomsForUserSuspenseQueryHookResult = ReturnType<
	typeof useGetChatroomsForUserSuspenseQuery
>
export type GetChatroomsForUserQueryResult = Apollo.QueryResult<
	GetChatroomsForUserQuery,
	GetChatroomsForUserQueryVariables
>
export const GetMessagesForChatroomDocument = gql`
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
					user {
						id
						username
						email
						avatar
					}
				}
			}
		}
	}
`

/**
 * __useGetMessagesForChatroomQuery__
 *
 * To run a query within a React component, call `useGetMessagesForChatroomQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesForChatroomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesForChatroomQuery({
 *   variables: {
 *      chatroomId: // value for 'chatroomId'
 *   },
 * });
 */
export function useGetMessagesForChatroomQuery(
	baseOptions: Apollo.QueryHookOptions<
		GetMessagesForChatroomQuery,
		GetMessagesForChatroomQueryVariables
	> &
		(
			| {
					variables: GetMessagesForChatroomQueryVariables
					skip?: boolean
			  }
			| { skip: boolean }
		)
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useQuery<
		GetMessagesForChatroomQuery,
		GetMessagesForChatroomQueryVariables
	>(GetMessagesForChatroomDocument, options)
}
export function useGetMessagesForChatroomLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<
		GetMessagesForChatroomQuery,
		GetMessagesForChatroomQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useLazyQuery<
		GetMessagesForChatroomQuery,
		GetMessagesForChatroomQueryVariables
	>(GetMessagesForChatroomDocument, options)
}
export function useGetMessagesForChatroomSuspenseQuery(
	baseOptions?:
		| Apollo.SkipToken
		| Apollo.SuspenseQueryHookOptions<
				GetMessagesForChatroomQuery,
				GetMessagesForChatroomQueryVariables
		  >
) {
	const options =
		baseOptions === Apollo.skipToken
			? baseOptions
			: { ...defaultOptions, ...baseOptions }
	return Apollo.useSuspenseQuery<
		GetMessagesForChatroomQuery,
		GetMessagesForChatroomQueryVariables
	>(GetMessagesForChatroomDocument, options)
}
export type GetMessagesForChatroomQueryHookResult = ReturnType<
	typeof useGetMessagesForChatroomQuery
>
export type GetMessagesForChatroomLazyQueryHookResult = ReturnType<
	typeof useGetMessagesForChatroomLazyQuery
>
export type GetMessagesForChatroomSuspenseQueryHookResult = ReturnType<
	typeof useGetMessagesForChatroomSuspenseQuery
>
export type GetMessagesForChatroomQueryResult = Apollo.QueryResult<
	GetMessagesForChatroomQuery,
	GetMessagesForChatroomQueryVariables
>
export const GetUsersOfChatroomDocument = gql`
	query GetUsersOfChatroom($chatroomId: Float!) {
		getUsersOfChatroom(chatroomId: $chatroomId) {
			id
			username
			email
			avatar
		}
	}
`

/**
 * __useGetUsersOfChatroomQuery__
 *
 * To run a query within a React component, call `useGetUsersOfChatroomQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersOfChatroomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersOfChatroomQuery({
 *   variables: {
 *      chatroomId: // value for 'chatroomId'
 *   },
 * });
 */
export function useGetUsersOfChatroomQuery(
	baseOptions: Apollo.QueryHookOptions<
		GetUsersOfChatroomQuery,
		GetUsersOfChatroomQueryVariables
	> &
		(
			| { variables: GetUsersOfChatroomQueryVariables; skip?: boolean }
			| { skip: boolean }
		)
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useQuery<
		GetUsersOfChatroomQuery,
		GetUsersOfChatroomQueryVariables
	>(GetUsersOfChatroomDocument, options)
}
export function useGetUsersOfChatroomLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<
		GetUsersOfChatroomQuery,
		GetUsersOfChatroomQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useLazyQuery<
		GetUsersOfChatroomQuery,
		GetUsersOfChatroomQueryVariables
	>(GetUsersOfChatroomDocument, options)
}
export function useGetUsersOfChatroomSuspenseQuery(
	baseOptions?:
		| Apollo.SkipToken
		| Apollo.SuspenseQueryHookOptions<
				GetUsersOfChatroomQuery,
				GetUsersOfChatroomQueryVariables
		  >
) {
	const options =
		baseOptions === Apollo.skipToken
			? baseOptions
			: { ...defaultOptions, ...baseOptions }
	return Apollo.useSuspenseQuery<
		GetUsersOfChatroomQuery,
		GetUsersOfChatroomQueryVariables
	>(GetUsersOfChatroomDocument, options)
}
export type GetUsersOfChatroomQueryHookResult = ReturnType<
	typeof useGetUsersOfChatroomQuery
>
export type GetUsersOfChatroomLazyQueryHookResult = ReturnType<
	typeof useGetUsersOfChatroomLazyQuery
>
export type GetUsersOfChatroomSuspenseQueryHookResult = ReturnType<
	typeof useGetUsersOfChatroomSuspenseQuery
>
export type GetUsersOfChatroomQueryResult = Apollo.QueryResult<
	GetUsersOfChatroomQuery,
	GetUsersOfChatroomQueryVariables
>
export const SearchUsersDocument = gql`
	query SearchUsers($fullname: String!) {
		searchUsers(fullname: $fullname) {
			id
			username
			email
		}
	}
`

/**
 * __useSearchUsersQuery__
 *
 * To run a query within a React component, call `useSearchUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersQuery({
 *   variables: {
 *      fullname: // value for 'fullname'
 *   },
 * });
 */
export function useSearchUsersQuery(
	baseOptions: Apollo.QueryHookOptions<
		SearchUsersQuery,
		SearchUsersQueryVariables
	> &
		(
			| { variables: SearchUsersQueryVariables; skip?: boolean }
			| { skip: boolean }
		)
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useQuery<SearchUsersQuery, SearchUsersQueryVariables>(
		SearchUsersDocument,
		options
	)
}
export function useSearchUsersLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<
		SearchUsersQuery,
		SearchUsersQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useLazyQuery<SearchUsersQuery, SearchUsersQueryVariables>(
		SearchUsersDocument,
		options
	)
}
export function useSearchUsersSuspenseQuery(
	baseOptions?:
		| Apollo.SkipToken
		| Apollo.SuspenseQueryHookOptions<
				SearchUsersQuery,
				SearchUsersQueryVariables
		  >
) {
	const options =
		baseOptions === Apollo.skipToken
			? baseOptions
			: { ...defaultOptions, ...baseOptions }
	return Apollo.useSuspenseQuery<SearchUsersQuery, SearchUsersQueryVariables>(
		SearchUsersDocument,
		options
	)
}
export type SearchUsersQueryHookResult = ReturnType<typeof useSearchUsersQuery>
export type SearchUsersLazyQueryHookResult = ReturnType<
	typeof useSearchUsersLazyQuery
>
export type SearchUsersSuspenseQueryHookResult = ReturnType<
	typeof useSearchUsersSuspenseQuery
>
export type SearchUsersQueryResult = Apollo.QueryResult<
	SearchUsersQuery,
	SearchUsersQueryVariables
>
export const FindCurrentSessionDocument = gql`
	query FindCurrentSession {
		findCurrentSession {
			id
			createdAt
			metadata {
				location {
					country
					city
					latidute
					longitude
				}
				device {
					browser
					os
				}
				ip
			}
		}
	}
`

/**
 * __useFindCurrentSessionQuery__
 *
 * To run a query within a React component, call `useFindCurrentSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindCurrentSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindCurrentSessionQuery({
 *   variables: {
 *   },
 * });
 */
export function useFindCurrentSessionQuery(
	baseOptions?: Apollo.QueryHookOptions<
		FindCurrentSessionQuery,
		FindCurrentSessionQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useQuery<
		FindCurrentSessionQuery,
		FindCurrentSessionQueryVariables
	>(FindCurrentSessionDocument, options)
}
export function useFindCurrentSessionLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<
		FindCurrentSessionQuery,
		FindCurrentSessionQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useLazyQuery<
		FindCurrentSessionQuery,
		FindCurrentSessionQueryVariables
	>(FindCurrentSessionDocument, options)
}
export function useFindCurrentSessionSuspenseQuery(
	baseOptions?:
		| Apollo.SkipToken
		| Apollo.SuspenseQueryHookOptions<
				FindCurrentSessionQuery,
				FindCurrentSessionQueryVariables
		  >
) {
	const options =
		baseOptions === Apollo.skipToken
			? baseOptions
			: { ...defaultOptions, ...baseOptions }
	return Apollo.useSuspenseQuery<
		FindCurrentSessionQuery,
		FindCurrentSessionQueryVariables
	>(FindCurrentSessionDocument, options)
}
export type FindCurrentSessionQueryHookResult = ReturnType<
	typeof useFindCurrentSessionQuery
>
export type FindCurrentSessionLazyQueryHookResult = ReturnType<
	typeof useFindCurrentSessionLazyQuery
>
export type FindCurrentSessionSuspenseQueryHookResult = ReturnType<
	typeof useFindCurrentSessionSuspenseQuery
>
export type FindCurrentSessionQueryResult = Apollo.QueryResult<
	FindCurrentSessionQuery,
	FindCurrentSessionQueryVariables
>
export const FindNotificationsByUserDocument = gql`
	query FindNotificationsByUser {
		findNotificationsByUser {
			id
			message
			type
		}
	}
`

/**
 * __useFindNotificationsByUserQuery__
 *
 * To run a query within a React component, call `useFindNotificationsByUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindNotificationsByUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindNotificationsByUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useFindNotificationsByUserQuery(
	baseOptions?: Apollo.QueryHookOptions<
		FindNotificationsByUserQuery,
		FindNotificationsByUserQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useQuery<
		FindNotificationsByUserQuery,
		FindNotificationsByUserQueryVariables
	>(FindNotificationsByUserDocument, options)
}
export function useFindNotificationsByUserLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<
		FindNotificationsByUserQuery,
		FindNotificationsByUserQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useLazyQuery<
		FindNotificationsByUserQuery,
		FindNotificationsByUserQueryVariables
	>(FindNotificationsByUserDocument, options)
}
export function useFindNotificationsByUserSuspenseQuery(
	baseOptions?:
		| Apollo.SkipToken
		| Apollo.SuspenseQueryHookOptions<
				FindNotificationsByUserQuery,
				FindNotificationsByUserQueryVariables
		  >
) {
	const options =
		baseOptions === Apollo.skipToken
			? baseOptions
			: { ...defaultOptions, ...baseOptions }
	return Apollo.useSuspenseQuery<
		FindNotificationsByUserQuery,
		FindNotificationsByUserQueryVariables
	>(FindNotificationsByUserDocument, options)
}
export type FindNotificationsByUserQueryHookResult = ReturnType<
	typeof useFindNotificationsByUserQuery
>
export type FindNotificationsByUserLazyQueryHookResult = ReturnType<
	typeof useFindNotificationsByUserLazyQuery
>
export type FindNotificationsByUserSuspenseQueryHookResult = ReturnType<
	typeof useFindNotificationsByUserSuspenseQuery
>
export type FindNotificationsByUserQueryResult = Apollo.QueryResult<
	FindNotificationsByUserQuery,
	FindNotificationsByUserQueryVariables
>
export const FindNotificationsUnreadCountDocument = gql`
	query FindNotificationsUnreadCount {
		findNotificationsUnreadCount
	}
`

/**
 * __useFindNotificationsUnreadCountQuery__
 *
 * To run a query within a React component, call `useFindNotificationsUnreadCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindNotificationsUnreadCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindNotificationsUnreadCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useFindNotificationsUnreadCountQuery(
	baseOptions?: Apollo.QueryHookOptions<
		FindNotificationsUnreadCountQuery,
		FindNotificationsUnreadCountQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useQuery<
		FindNotificationsUnreadCountQuery,
		FindNotificationsUnreadCountQueryVariables
	>(FindNotificationsUnreadCountDocument, options)
}
export function useFindNotificationsUnreadCountLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<
		FindNotificationsUnreadCountQuery,
		FindNotificationsUnreadCountQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useLazyQuery<
		FindNotificationsUnreadCountQuery,
		FindNotificationsUnreadCountQueryVariables
	>(FindNotificationsUnreadCountDocument, options)
}
export function useFindNotificationsUnreadCountSuspenseQuery(
	baseOptions?:
		| Apollo.SkipToken
		| Apollo.SuspenseQueryHookOptions<
				FindNotificationsUnreadCountQuery,
				FindNotificationsUnreadCountQueryVariables
		  >
) {
	const options =
		baseOptions === Apollo.skipToken
			? baseOptions
			: { ...defaultOptions, ...baseOptions }
	return Apollo.useSuspenseQuery<
		FindNotificationsUnreadCountQuery,
		FindNotificationsUnreadCountQueryVariables
	>(FindNotificationsUnreadCountDocument, options)
}
export type FindNotificationsUnreadCountQueryHookResult = ReturnType<
	typeof useFindNotificationsUnreadCountQuery
>
export type FindNotificationsUnreadCountLazyQueryHookResult = ReturnType<
	typeof useFindNotificationsUnreadCountLazyQuery
>
export type FindNotificationsUnreadCountSuspenseQueryHookResult = ReturnType<
	typeof useFindNotificationsUnreadCountSuspenseQuery
>
export type FindNotificationsUnreadCountQueryResult = Apollo.QueryResult<
	FindNotificationsUnreadCountQuery,
	FindNotificationsUnreadCountQueryVariables
>
export const FindProfileDocument = gql`
	query FindProfile {
		findProfile {
			id
			username
			displayName
			email
			avatar
			bio
			isVerified
			isTotpEnabled
			notificationSettings {
				siteNotifications
				telegramNotifications
			}
		}
	}
`

/**
 * __useFindProfileQuery__
 *
 * To run a query within a React component, call `useFindProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useFindProfileQuery(
	baseOptions?: Apollo.QueryHookOptions<
		FindProfileQuery,
		FindProfileQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useQuery<FindProfileQuery, FindProfileQueryVariables>(
		FindProfileDocument,
		options
	)
}
export function useFindProfileLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<
		FindProfileQuery,
		FindProfileQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useLazyQuery<FindProfileQuery, FindProfileQueryVariables>(
		FindProfileDocument,
		options
	)
}
export function useFindProfileSuspenseQuery(
	baseOptions?:
		| Apollo.SkipToken
		| Apollo.SuspenseQueryHookOptions<
				FindProfileQuery,
				FindProfileQueryVariables
		  >
) {
	const options =
		baseOptions === Apollo.skipToken
			? baseOptions
			: { ...defaultOptions, ...baseOptions }
	return Apollo.useSuspenseQuery<FindProfileQuery, FindProfileQueryVariables>(
		FindProfileDocument,
		options
	)
}
export type FindProfileQueryHookResult = ReturnType<typeof useFindProfileQuery>
export type FindProfileLazyQueryHookResult = ReturnType<
	typeof useFindProfileLazyQuery
>
export type FindProfileSuspenseQueryHookResult = ReturnType<
	typeof useFindProfileSuspenseQuery
>
export type FindProfileQueryResult = Apollo.QueryResult<
	FindProfileQuery,
	FindProfileQueryVariables
>
export const FindSessionsByUserDocument = gql`
	query FindSessionsByUser {
		findSessionsByUser {
			id
			createdAt
			metadata {
				location {
					country
					city
					latidute
					longitude
				}
				device {
					browser
					os
				}
				ip
			}
		}
	}
`

/**
 * __useFindSessionsByUserQuery__
 *
 * To run a query within a React component, call `useFindSessionsByUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindSessionsByUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindSessionsByUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useFindSessionsByUserQuery(
	baseOptions?: Apollo.QueryHookOptions<
		FindSessionsByUserQuery,
		FindSessionsByUserQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useQuery<
		FindSessionsByUserQuery,
		FindSessionsByUserQueryVariables
	>(FindSessionsByUserDocument, options)
}
export function useFindSessionsByUserLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<
		FindSessionsByUserQuery,
		FindSessionsByUserQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useLazyQuery<
		FindSessionsByUserQuery,
		FindSessionsByUserQueryVariables
	>(FindSessionsByUserDocument, options)
}
export function useFindSessionsByUserSuspenseQuery(
	baseOptions?:
		| Apollo.SkipToken
		| Apollo.SuspenseQueryHookOptions<
				FindSessionsByUserQuery,
				FindSessionsByUserQueryVariables
		  >
) {
	const options =
		baseOptions === Apollo.skipToken
			? baseOptions
			: { ...defaultOptions, ...baseOptions }
	return Apollo.useSuspenseQuery<
		FindSessionsByUserQuery,
		FindSessionsByUserQueryVariables
	>(FindSessionsByUserDocument, options)
}
export type FindSessionsByUserQueryHookResult = ReturnType<
	typeof useFindSessionsByUserQuery
>
export type FindSessionsByUserLazyQueryHookResult = ReturnType<
	typeof useFindSessionsByUserLazyQuery
>
export type FindSessionsByUserSuspenseQueryHookResult = ReturnType<
	typeof useFindSessionsByUserSuspenseQuery
>
export type FindSessionsByUserQueryResult = Apollo.QueryResult<
	FindSessionsByUserQuery,
	FindSessionsByUserQueryVariables
>
export const FindSocialLinksDocument = gql`
	query FindSocialLinks {
		findSocialLinks {
			id
			title
			url
			position
		}
	}
`

/**
 * __useFindSocialLinksQuery__
 *
 * To run a query within a React component, call `useFindSocialLinksQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindSocialLinksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindSocialLinksQuery({
 *   variables: {
 *   },
 * });
 */
export function useFindSocialLinksQuery(
	baseOptions?: Apollo.QueryHookOptions<
		FindSocialLinksQuery,
		FindSocialLinksQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useQuery<FindSocialLinksQuery, FindSocialLinksQueryVariables>(
		FindSocialLinksDocument,
		options
	)
}
export function useFindSocialLinksLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<
		FindSocialLinksQuery,
		FindSocialLinksQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useLazyQuery<
		FindSocialLinksQuery,
		FindSocialLinksQueryVariables
	>(FindSocialLinksDocument, options)
}
export function useFindSocialLinksSuspenseQuery(
	baseOptions?:
		| Apollo.SkipToken
		| Apollo.SuspenseQueryHookOptions<
				FindSocialLinksQuery,
				FindSocialLinksQueryVariables
		  >
) {
	const options =
		baseOptions === Apollo.skipToken
			? baseOptions
			: { ...defaultOptions, ...baseOptions }
	return Apollo.useSuspenseQuery<
		FindSocialLinksQuery,
		FindSocialLinksQueryVariables
	>(FindSocialLinksDocument, options)
}
export type FindSocialLinksQueryHookResult = ReturnType<
	typeof useFindSocialLinksQuery
>
export type FindSocialLinksLazyQueryHookResult = ReturnType<
	typeof useFindSocialLinksLazyQuery
>
export type FindSocialLinksSuspenseQueryHookResult = ReturnType<
	typeof useFindSocialLinksSuspenseQuery
>
export type FindSocialLinksQueryResult = Apollo.QueryResult<
	FindSocialLinksQuery,
	FindSocialLinksQueryVariables
>
export const GenerateTotpSecretDocument = gql`
	query GenerateTotpSecret {
		generateTotpSecret {
			qrcodeUrl
			secret
		}
	}
`

/**
 * __useGenerateTotpSecretQuery__
 *
 * To run a query within a React component, call `useGenerateTotpSecretQuery` and pass it any options that fit your needs.
 * When your component renders, `useGenerateTotpSecretQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGenerateTotpSecretQuery({
 *   variables: {
 *   },
 * });
 */
export function useGenerateTotpSecretQuery(
	baseOptions?: Apollo.QueryHookOptions<
		GenerateTotpSecretQuery,
		GenerateTotpSecretQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useQuery<
		GenerateTotpSecretQuery,
		GenerateTotpSecretQueryVariables
	>(GenerateTotpSecretDocument, options)
}
export function useGenerateTotpSecretLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<
		GenerateTotpSecretQuery,
		GenerateTotpSecretQueryVariables
	>
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useLazyQuery<
		GenerateTotpSecretQuery,
		GenerateTotpSecretQueryVariables
	>(GenerateTotpSecretDocument, options)
}
export function useGenerateTotpSecretSuspenseQuery(
	baseOptions?:
		| Apollo.SkipToken
		| Apollo.SuspenseQueryHookOptions<
				GenerateTotpSecretQuery,
				GenerateTotpSecretQueryVariables
		  >
) {
	const options =
		baseOptions === Apollo.skipToken
			? baseOptions
			: { ...defaultOptions, ...baseOptions }
	return Apollo.useSuspenseQuery<
		GenerateTotpSecretQuery,
		GenerateTotpSecretQueryVariables
	>(GenerateTotpSecretDocument, options)
}
export type GenerateTotpSecretQueryHookResult = ReturnType<
	typeof useGenerateTotpSecretQuery
>
export type GenerateTotpSecretLazyQueryHookResult = ReturnType<
	typeof useGenerateTotpSecretLazyQuery
>
export type GenerateTotpSecretSuspenseQueryHookResult = ReturnType<
	typeof useGenerateTotpSecretSuspenseQuery
>
export type GenerateTotpSecretQueryResult = Apollo.QueryResult<
	GenerateTotpSecretQuery,
	GenerateTotpSecretQueryVariables
>
export const LiveUsersInChatroomDocument = gql`
	subscription LiveUsersInChatroom($chatroomId: Int!) {
		liveUsersInChatroom(chatroomId: $chatroomId) {
			id
			username
			avatar
			email
		}
	}
`

/**
 * __useLiveUsersInChatroomSubscription__
 *
 * To run a query within a React component, call `useLiveUsersInChatroomSubscription` and pass it any options that fit your needs.
 * When your component renders, `useLiveUsersInChatroomSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLiveUsersInChatroomSubscription({
 *   variables: {
 *      chatroomId: // value for 'chatroomId'
 *   },
 * });
 */
export function useLiveUsersInChatroomSubscription(
	baseOptions: Apollo.SubscriptionHookOptions<
		LiveUsersInChatroomSubscription,
		LiveUsersInChatroomSubscriptionVariables
	> &
		(
			| {
					variables: LiveUsersInChatroomSubscriptionVariables
					skip?: boolean
			  }
			| { skip: boolean }
		)
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useSubscription<
		LiveUsersInChatroomSubscription,
		LiveUsersInChatroomSubscriptionVariables
	>(LiveUsersInChatroomDocument, options)
}
export type LiveUsersInChatroomSubscriptionHookResult = ReturnType<
	typeof useLiveUsersInChatroomSubscription
>
export type LiveUsersInChatroomSubscriptionResult =
	Apollo.SubscriptionResult<LiveUsersInChatroomSubscription>
export const NewMessageDocument = gql`
	subscription NewMessage($chatroomId: Float!) {
		newMessage(chatroomId: $chatroomId) {
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
		}
	}
`

/**
 * __useNewMessageSubscription__
 *
 * To run a query within a React component, call `useNewMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewMessageSubscription({
 *   variables: {
 *      chatroomId: // value for 'chatroomId'
 *   },
 * });
 */
export function useNewMessageSubscription(
	baseOptions: Apollo.SubscriptionHookOptions<
		NewMessageSubscription,
		NewMessageSubscriptionVariables
	> &
		(
			| { variables: NewMessageSubscriptionVariables; skip?: boolean }
			| { skip: boolean }
		)
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useSubscription<
		NewMessageSubscription,
		NewMessageSubscriptionVariables
	>(NewMessageDocument, options)
}
export type NewMessageSubscriptionHookResult = ReturnType<
	typeof useNewMessageSubscription
>
export type NewMessageSubscriptionResult =
	Apollo.SubscriptionResult<NewMessageSubscription>
export const UserStartedTypingDocument = gql`
	subscription UserStartedTyping($chatroomId: Float!, $userId: String!) {
		userStartedTyping(chatroomId: $chatroomId, userId: $userId) {
			id
			username
			email
			avatar
		}
	}
`

/**
 * __useUserStartedTypingSubscription__
 *
 * To run a query within a React component, call `useUserStartedTypingSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUserStartedTypingSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserStartedTypingSubscription({
 *   variables: {
 *      chatroomId: // value for 'chatroomId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUserStartedTypingSubscription(
	baseOptions: Apollo.SubscriptionHookOptions<
		UserStartedTypingSubscription,
		UserStartedTypingSubscriptionVariables
	> &
		(
			| {
					variables: UserStartedTypingSubscriptionVariables
					skip?: boolean
			  }
			| { skip: boolean }
		)
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useSubscription<
		UserStartedTypingSubscription,
		UserStartedTypingSubscriptionVariables
	>(UserStartedTypingDocument, options)
}
export type UserStartedTypingSubscriptionHookResult = ReturnType<
	typeof useUserStartedTypingSubscription
>
export type UserStartedTypingSubscriptionResult =
	Apollo.SubscriptionResult<UserStartedTypingSubscription>
export const UserStoppedTypingDocument = gql`
	subscription UserStoppedTyping($chatroomId: Float!, $userId: String!) {
		userStoppedTyping(chatroomId: $chatroomId, userId: $userId) {
			id
			username
			email
			avatar
		}
	}
`

/**
 * __useUserStoppedTypingSubscription__
 *
 * To run a query within a React component, call `useUserStoppedTypingSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUserStoppedTypingSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserStoppedTypingSubscription({
 *   variables: {
 *      chatroomId: // value for 'chatroomId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUserStoppedTypingSubscription(
	baseOptions: Apollo.SubscriptionHookOptions<
		UserStoppedTypingSubscription,
		UserStoppedTypingSubscriptionVariables
	> &
		(
			| {
					variables: UserStoppedTypingSubscriptionVariables
					skip?: boolean
			  }
			| { skip: boolean }
		)
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useSubscription<
		UserStoppedTypingSubscription,
		UserStoppedTypingSubscriptionVariables
	>(UserStoppedTypingDocument, options)
}
export type UserStoppedTypingSubscriptionHookResult = ReturnType<
	typeof useUserStoppedTypingSubscription
>
export type UserStoppedTypingSubscriptionResult =
	Apollo.SubscriptionResult<UserStoppedTypingSubscription>
