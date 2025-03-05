'use client'

import { gql, useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { set } from 'zod'

import { Button } from '@/components/ui/common/Button'
import { Dialog } from '@/components/ui/common/Dialog'
import { Textarea } from '@/components/ui/common/Textarea'
import { Step, StepItem, Stepper } from '@/components/ui/elements/steppereee'
dm '@/graphql/generated/output'

import { useGeneralStore } from '@/store/generalStore'

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

type User = {
	id: string
	username: string
}

type ChatroomType = {
	id: string
	name: string
} | null

function AddChatroom() {
	const [active, setActive] = useState<number>(0)
	// const [highestStepVisited, setHighestStepVisited] = useState<number>(1)
	// const [chatroomName, setChatroomName] = useState<string>('')
	// const [nameError, setNameError] = useState<string | null>(null)
	// const [searchTerm, setSearchTerm] = useState<string>('')
	// const [selectedUsers, setSelectedUsers] = useState<string[]>([])
	// const [newlyCreatedChatroom, setNewlyCreatedChatroom] =
	// 	useState<ChatroomType>(null)

	// const isCreateRoomModalOpen = useGeneralStore(
	// 	state => state.isCreateRoomModalOpen
	// )
	// const toggleCreateRoomModal = useGeneralStore(
	// 	state => state.toggleCreateRoomModal
	// )

	// const handleStepChange = (nextStep: number) => {
	// 	if (nextStep < 0 || nextStep > 2) return
	// 	setActive(nextStep)
	// 	setHighestStepVisited(prev => Math.max(prev, nextStep))
	// }

	// const [createChatroom, { loading }] = useMutation(gql`
	// 	mutation createChatroom($name: String!) {
	// 		createChatroom(name: $name) {
	// 			id
	// 			name
	// 		}
	// 	}
	// `)

	// const handleCreateChatroom = async () => {
	// 	if (chatroomName.trim().length < 3) {
	// 		setNameError('Name must be at least 3 characters')
	// 		return
	// 	}
	// 	setNameError(null)

	// 	try {
	// 		const { data } = await createChatroom({
	// 			variables: { name: chatroomName },
	// 			refetchQueries: ['GetChatroomsForUser']
	// 		})
	// 		setNewlyCreatedChatroom(data?.createChatroom || null)
	// 		handleStepChange(active + 1)
	// 	} catch (error) {
	// 		if (error instanceof Error) {
	// 			setNameError(error.message || 'Error occurred')
	// 		}
	// 	}
	// }

	// const { data, refetch } = useQuery(searchUsers, {
	// 	variables: { fullname: searchTerm }
	// })

	// const [addUsersToChatroomMutation, { loading: loadingAddUsers }] =
	// 	useMutation(addUsersToChatroom, {
	// 		refetchQueries: ['GetChatroomsForUser']
	// 	})

	// const handleAddUsersToChatroom = async () => {
	// 	try {
	// 		if (!newlyCreatedChatroom) return
	// 		await addUsersToChatroomMutation({
	// 			variables: {
	// 				chatroomId: parseInt(newlyCreatedChatroom.id),
	// 				userIds: selectedUsers
	// 			}
	// 		})
	// 		toggleCreateRoomModal()
	// 		setSelectedUsers([])
	// 		setNewlyCreatedChatroom(null)
	// 		setChatroomName('')
	// 	} catch (error) {
	// 		console.error(error)
	// 	}
	// }

	// useEffect(() => {
	// 	const debounceTimeout = setTimeout(() => {
	// 		refetch()
	// 	}, 300)
	// 	return () => clearTimeout(debounceTimeout)
	// }, [searchTerm, refetch])

	// const selectItems =
	// 	data?.searchUsers?.map((user: User) => ({
	// 		label: user.username,
	// 		value: user.id
	// 	})) || []

	const steps = [
		{ label: 'Step 1' },
		{ label: 'Step 2' },
		{ label: 'Step 3' }
	]

	// const { handleSubmit } = useForm()
	// const onSubmit = () => handleCreateChatroom()

	return (
		<Dialog
		// open={isCreateRoomModalOpen}
		// onOpenChange={toggleCreateRoomModal}
		>
			<Stepper
				initialStep={active}
				onClickStep={setActive}
				// mobileBreakpoint='sm'
				steps={steps}
			>
				<Step label='First step' description='Create Chatroom'>
					<div>Create a Chatroom</div>
				</Step>
				<Step label='Second step' description='Add members'>
					{/* <form onSubmit={handleSubmit(onSubmit)}>
						<div>
							<label htmlFor='chatroomName'>Chatroom Name</label>
							<Textarea
								id='chatroomName'
								placeholder='Chatroom Name'
								value={chatroomName}
								onChange={e => setChatroomName(e.target.value)}
							/>
							{nameError && (
								<div className='error'>{nameError}</div>
							)}
						</div>
						{chatroomName && (
							<Button type='submit'>Create Room</Button>
						)}
					</form> */}
				</Step>
				<Step label='Third step' description='Add members'>
					<div>
						<label htmlFor='users'>Choose members to add</label>
						{/* <select
							id='users'
							multiple
							value={selectedUsers}
							onChange={e =>
								setSelectedUsers(
									Array.from(
										e.target.selectedOptions,
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
						</select> */}
					</div>
				</Step>
			</Stepper>
			{/* <div style={{ marginTop: '20px' }}>
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
			</div> */}
		</Dialog>
	)
}

export default AddChatroom
