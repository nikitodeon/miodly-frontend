'use client'

import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/common/Button'
import { Dialog } from '@/components/ui/common/Dialog'
import { Textarea } from '@/components/ui/common/Textarea'
import { Step, StepItem, Stepper } from '@/components/ui/elements/stepper'

import { Chatroom } from '@/graphql/generated/output'

import { useGeneralStore } from '@/store/generalStore'

// Correct import for form handling

// Запросы GraphQL
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

function AddChatroom() {
	const [active, setActive] = useState<number>(1)
	const [highestStepVisited, setHighestStepVisited] = useState<number>(active)
	const [chatroomName, setChatroomName] = useState<string>('')
	const [nameError, setNameError] = useState<string | null>(null)

	const isCreateRoomModalOpen = useGeneralStore(
		state => state.isCreateRoomModalOpen
	)
	const toggleCreateRoomModal = useGeneralStore(
		state => state.toggleCreateRoomModal
	)

	const handleStepChange = (nextStep: number) => {
		if (nextStep < 0 || nextStep > 2) return
		setActive(nextStep)
		setHighestStepVisited(hSC => Math.max(hSC, nextStep))
	}

	const [createChatroom, { loading }] = useMutation(gql`
		mutation createChatroom($name: String!) {
			createChatroom(name: $name) {
				id
				name
			}
		}
	`)

	const [newlyCreatedChatroom, setNewlyCreatedChatroom] =
		useState<Chatroom | null>(null)

	const handleCreateChatroom = async () => {
		if (chatroomName.trim().length < 3) {
			setNameError('Name must be at least 3 characters')
			return
		}
		setNameError(null)

		try {
			const { data } = await createChatroom({
				variables: { name: chatroomName },
				refetchQueries: ['GetChatroomsForUser']
			})
			setNewlyCreatedChatroom(data?.createChatroom || null)
			handleStepChange(active + 1)
		} catch (error: any) {
			setNameError(error.graphQLErrors?.[0]?.extensions?.name as string)
		}
	}

	const [searchTerm, setSearchTerm] = useState<string>('')

	const { data, refetch } = useQuery(searchUsers, {
		variables: { fullname: searchTerm }
	})

	const [addUsersToChatroomMutation, { loading: loadingAddUsers }] =
		useMutation(addUsersToChatroom, {
			refetchQueries: ['GetChatroomsForUser']
		})

	const [selectedUsers, setSelectedUsers] = useState<string[]>([])

	const handleAddUsersToChatroom = async () => {
		try {
			await addUsersToChatroomMutation({
				variables: {
					chatroomId: newlyCreatedChatroom?.id
						? parseInt(newlyCreatedChatroom.id)
						: null,
					userIds: selectedUsers.map(id => parseInt(id))
				}
			})
			toggleCreateRoomModal()
			setSelectedUsers([])
			setNewlyCreatedChatroom(null)
			setChatroomName('')
		} catch (error: any) {
			console.error(error)
		}
	}

	let debounceTimeout: NodeJS.Timeout
	const handleSearchChange = (term: string) => {
		setSearchTerm(term)
		clearTimeout(debounceTimeout)
		debounceTimeout = setTimeout(() => refetch(), 300)
	}

	const selectItems =
		data?.searchUsers?.map((user: any) => ({
			label: user.username,
			value: String(user.id)
		})) || []

	const steps: StepItem[] = [
		{ label: 'Step 1' },
		{ label: 'Step 2' },
		{ label: 'Step 3' }
	]

	// useForm hook initialization
	const { handleSubmit } = useForm()

	// onSubmit function for form submission
	const onSubmit = () => {
		handleCreateChatroom()
	}

	return (
		<span>
			<Dialog
				open={isCreateRoomModalOpen}
				onOpenChange={toggleCreateRoomModal}
			>
				<Stepper
					initialStep={active}
					onClickStep={setActive}
					mobileBreakpoint='sm'
					steps={steps}
				>
					<Step label='First step' description='Create Chatroom'>
						<div>Create a Chatroom</div>
					</Step>
					<Step label='Second step' description='Add members'>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div>
								<label htmlFor='chatroomName'>
									Chatroom Name
								</label>
								<Textarea
									id='chatroomName'
									placeholder='Chatroom Name'
									value={chatroomName}
									onChange={e =>
										setChatroomName(e.target.value)
									}
								/>
								{nameError && (
									<div className='error'>{nameError}</div>
								)}{' '}
								{/* Display the error */}
							</div>
							{chatroomName && (
								<Button type='submit'>Create Room</Button>
							)}
						</form>
					</Step>
					<Step label='Third step' description='Add members'>
						<div>
							<label htmlFor='users'>Choose members to add</label>
							<select
								id='users'
								multiple
								value={selectedUsers}
								onChange={e =>
									setSelectedUsers(
										[...e.target.selectedOptions].map(
											option => option.value
										)
									)
								}
							>
								{selectItems.map((user: any) => (
									<option key={user.value} value={user.value}>
										{user.label}
									</option>
								))}
							</select>
						</div>
					</Step>
				</Stepper>

				<div style={{ marginTop: '20px' }}>
					<Button
						variant='default'
						onClick={() => handleStepChange(active - 1)}
					>
						Back
					</Button>
					{selectedUsers.length > 0 && (
						<Button onClick={handleAddUsersToChatroom} color='blue'>
							Add Users
						</Button>
					)}
				</div>
			</Dialog>
		</span>
	)
}

export default AddChatroom
