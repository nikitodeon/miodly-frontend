'use client'

import { gql, useMutation, useQuery } from '@apollo/client'
import {
	Button,
	Group,
	Modal,
	MultiSelect,
	Stepper,
	TextInput
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'

// import { CREATE_CHATROOM } from "../graphql/mutations/CreateChatroom"

import {
	AddUsersToChatroomMutation,
	Chatroom,
	CreateChatroomMutation,
	SearchUsersQuery
	//   User,
} from '@/graphql/generated/output'

import { useGeneralStore } from '@/store/generalStore'

// import { SEARCH_USERS } from "../graphql/queries/SearchUsers"
// import { ADD_USERS_TO_CHATROOM } from "../graphql/mutations/AddUsersToChatroom"

function AddChatroom() {
	const [active, setActive] = useState(1)
	const [highestStepVisited, setHighestStepVisited] = useState(active)

	const isCreateRoomModalOpen = useGeneralStore(
		state => state.isCreateRoomModalOpen
	)
	const toggleCreateRoomModal = useGeneralStore(
		state => state.toggleCreateRoomModal
	)

	const handleStepChange = (nextStep: number) => {
		const isOutOfBounds = nextStep > 2 || nextStep < 0

		if (isOutOfBounds) {
			return
		}

		setActive(nextStep)
		setHighestStepVisited(hSC => Math.max(hSC, nextStep))
	}
	const addUsersToChatroom = gql`
		mutation addUsersToChatroom($chatroomId: Float!, $userIds: [String!]!) {
			addUsersToChatroom(chatroomId: $chatroomId, userIds: $userIds) {
				name
				id
			}
		}
	`

	const searchUsers = gql`
		query searchUsers($fullname: String!) {
			searchUsers(fullname: $fullname) {
				id
				username
			}
		}
	`
	//   const [createChatroom, { loading }] =
	// useMutation<CreateChatroomMutation>(CREATE_CHATROOM)
	const [createChatroom, { loading }] = useMutation(gql`
		mutation createChatroom($name: String!) {
			createChatroom(name: $name) {
				id
				name
			}
		}
	`)

	//   const [createChatroom, { loading }] =
	//     useMutation<CreateChatroomMutation>(CREATE_CHATROOM)

	const form = useForm({
		initialValues: {
			name: ''
		},
		validate: {
			name: (value: string) =>
				value.trim().length >= 3
					? null
					: 'Name must be at least 3 characters'
		}
	})
	const [newlyCreatedChatroom, setNewlyCreatedChatroom] =
		useState<Chatroom | null>(null)

	const handleCreateChatroom = async () => {
		await createChatroom({
			variables: {
				name: form.values.name
			},
			onCompleted: data => {
				console.log(data)
				setNewlyCreatedChatroom(data.createChatroom)
				handleStepChange(active + 1)
			},
			onError: error => {
				form.setErrors({
					name: error.graphQLErrors[0].extensions?.name as string
				})
			},
			refetchQueries: ['GetChatroomsForUser']
		})
	}
	const [searchTerm, setSearchTerm] = useState('')
	const { data, refetch } = useQuery<SearchUsersQuery>(searchUsers, {
		variables: { fullname: searchTerm }
	})

	//   const { data, refetch } = useQuery<SearchUsersQuery>(SEARCH_USERS, {
	//     variables: { fullname: searchTerm },
	//   })
	//   const [addUsersToChatroom, { loading: loadingAddUsers }] =
	// useMutation<AddUsersToChatroomMutation>(ADD_USERS_TO_CHATROOM, {
	//   refetchQueries: ["GetChatroomsForUser"],
	// })

	const [selectedUsers, setSelectedUsers] = useState<string[]>([])

	const [addUsersToChatroomMutation] = useMutation(addUsersToChatroom)

	// await addUsersToChatroomMutation({

	const handleAddUsersToChatroom = async () => {
		console.log('Selected Users:', selectedUsers) // Логируем выбранных пользователей

		if (!newlyCreatedChatroom?.id) {
			console.error('No chatroom ID available') // Логируем ошибку, если ID чатрума отсутствует
			return
		}

		// Логируем параметры перед мутацией
		console.log('Chatroom ID:', newlyCreatedChatroom.id)
		console.log('User IDs:', selectedUsers)
		const validUserIds = selectedUsers.filter(
			userId => typeof userId === 'string' && userId.trim() !== ''
		)

		if (validUserIds.length === 0) {
			console.error('No valid user IDs')
			return
		}
		await addUsersToChatroomMutation({
			variables: {
				chatroomId:
					newlyCreatedChatroom?.id &&
					parseInt(newlyCreatedChatroom?.id),
				userIds: validUserIds
				//  selectedUsers.map(userId => parseInt(userId))
			},
			onCompleted: () => {
				console.log('Users added successfully') // Лог
				handleStepChange(1)
				toggleCreateRoomModal()
				setSelectedUsers([])
				setNewlyCreatedChatroom(null)
				form.reset()
			},
			onError: (error: any) => {
				console.error('Error adding users:', error) // Логируем ошибку при добавлении пользователей

				form.setErrors({
					name: error.graphQLErrors[0].extensions?.name as string
				})
			}
		})
	}
	let debounceTimeout: NodeJS.Timeout

	const handleSearchChange = (term: string) => {
		// Set the state variable to trigger a re-render and show a loading indicator
		setSearchTerm(term)
		// Debounce the refetching so you're not bombarding the server on every keystroke
		clearTimeout(debounceTimeout)
		debounceTimeout = setTimeout(() => {
			refetch()
		}, 300)
	}

	type SelectItem = {
		label: string
		value: string
		// other properties if required
	}
	const selectItems: SelectItem[] =
		data?.searchUsers?.map((user: any) => ({
			label: user.username,
			value: String(user.id)
		})) || []
	console.log(isCreateRoomModalOpen)
	console.log('AddChatroom rendered')
	return (
		<Modal opened={isCreateRoomModalOpen} onClose={toggleCreateRoomModal}>
			<Stepper active={active} onStepClick={setActive} breakpoint='sm'>
				<Stepper.Step label='First step' description='Create Chatroom'>
					<div>Create a Chatroom</div>
				</Stepper.Step>
				<Stepper.Step label='Second step' description='Add members'>
					<form
						onSubmit={form.onSubmit(() => handleCreateChatroom())}
					>
						<TextInput
							placeholder='Chatroom Name'
							label='Chatroom Name'
							error={form.errors.name}
							{...form.getInputProps('name')}
						/>
						{form.values.name && (
							<Button mt={'md'} type='submit'>
								Create Room
							</Button>
						)}
					</form>
				</Stepper.Step>
				<Stepper.Completed>
					<MultiSelect
						onSearchChange={handleSearchChange}
						nothingFound='No users found'
						searchable
						pb={'xl'}
						data={selectItems}
						label='Choose the members you want to add'
						placeholder='Pick all the users you want to add to this chatroom'
						onChange={values => setSelectedUsers(values)}
					/>
				</Stepper.Completed>
			</Stepper>

			<Group mt='xl'>
				<Button
					variant='default'
					onClick={() => handleStepChange(active - 1)}
				>
					Back
				</Button>
				{/* <Button onClick={() => handleStepChange(active + 1)}>
					Next step
				</Button> */}

				{selectedUsers.length > 0 && (
					<Button
						onClick={() => handleAddUsersToChatroom()}
						color='blue'
						leftIcon={<IconPlus />}
						loading={loading}
					>
						Add Users
					</Button>
				)}
			</Group>
		</Modal>
	)
}

export default AddChatroom
