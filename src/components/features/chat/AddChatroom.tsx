'use client'

import { gql, useMutation, useQuery } from '@apollo/client'
import { Group, Stepper, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import HiveIcon from '@mui/icons-material/Hive'
import { MoveRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/common/Button'
import MultiSelect from '@/components/ui/elements/Multiselect'

import { Chatroom, SearchUsersQuery } from '@/graphql/generated/output'

import { useGeneralStore } from '@/store/generalStore'

// Используем кастомный селект

function AddChatroom() {
	const [active, setActive] = useState(1)
	const [highestStepVisited, setHighestStepVisited] = useState(active)
	const isCreateRoomModalOpen = useGeneralStore(
		state => state.isCreateRoomModalOpen
	)
	const toggleCreateRoomModal = useGeneralStore(
		state => state.toggleCreateRoomModal
	)
	const isMobile = useMediaQuery('(max-width: 768px)')

	const handleStepChange = (nextStep: number) => {
		const isOutOfBounds = nextStep > 2 || nextStep < 0
		if (isOutOfBounds) return
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

	const [createChatroom, { loading }] = useMutation(gql`
		mutation createChatroom($name: String!) {
			createChatroom(name: $name) {
				id
				name
			}
		}
	`)

	const form = useForm({
		initialValues: { name: '' },
		validate: {
			name: (value: string) =>
				value.trim().length >= 3
					? null
					: 'Name must be at least 3 characters'
		}
	})

	const [newlyCreatedChatroom, setNewlyCreatedChatroom] =
		useState<Chatroom | null>(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedUsers, setSelectedUsers] = useState<string[]>([])

	const { data, refetch } = useQuery<SearchUsersQuery>(searchUsers, {
		variables: { fullname: searchTerm }
	})

	const [addUsersToChatroomMutation] = useMutation(addUsersToChatroom, {
		update: (cache, { data }) => {
			if (!data?.addUsersToChatroom || !newlyCreatedChatroom?.id) return
			cache.modify({
				id: cache.identify(data.addUsersToChatroom),
				fields: {
					participantsCount(existingCount) {
						return existingCount + selectedUsers.length
					},
					ChatroomUsers(existingUsers = []) {
						return [
							...existingUsers,
							...selectedUsers.map(userId => ({
								__typename: 'ChatroomUser',
								user: {
									__typename: 'User',
									id: userId
								}
							}))
						]
					}
				}
			})
		}
	})

	const handleCreateChatroom = async () => {
		await createChatroom({
			variables: { name: form.values.name },
			update: (cache, { data }) => {
				const newChatroom = data?.createChatroom
				if (!newChatroom) return
				cache.modify({
					fields: {
						getChatroomsForUser(existingChatrooms = []) {
							return [...existingChatrooms, newChatroom]
						}
					}
				})
			},
			onCompleted: data => {
				setNewlyCreatedChatroom(data.createChatroom)
				handleStepChange(active + 1)
			},
			onError: error => {
				form.setErrors({
					name: error.graphQLErrors[0].extensions?.name as string
				})
			}
		})
	}

	const handleAddUsersToChatroom = async () => {
		if (!newlyCreatedChatroom?.id) return
		const validUserIds = selectedUsers.filter(
			userId => typeof userId === 'string' && userId.trim() !== ''
		)
		if (validUserIds.length === 0) return

		await addUsersToChatroomMutation({
			variables: {
				chatroomId: parseInt(newlyCreatedChatroom.id),
				userIds: validUserIds
			},
			onCompleted: () => {
				handleStepChange(1)
				toggleCreateRoomModal()
				setSelectedUsers([])
				setNewlyCreatedChatroom(null)
				form.reset()
			},
			onError: error => {
				form.setErrors({
					name: error.graphQLErrors[0].extensions?.name as string
				})
			}
		})
	}

	let debounceTimeout: NodeJS.Timeout
	const handleSearchChange = (term: string) => {
		setSearchTerm(term)
		clearTimeout(debounceTimeout)
		debounceTimeout = setTimeout(() => {
			refetch()
		}, 300)
	}

	const handleAddUser = (userId: string) => {
		if (!selectedUsers.includes(userId)) {
			setSelectedUsers(prev => [...prev, userId])
		}
	}

	const handleRemoveUser = (userId: string) => {
		setSelectedUsers(prev => prev.filter(id => id !== userId))
	}

	type SelectItem = { label: string; value: string }
	const selectItems: SelectItem[] =
		data?.searchUsers?.map(user => ({
			label: user.username,
			value: String(user.id)
		})) || []

	if (!isCreateRoomModalOpen) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4'>
			<div
				className={`relative overflow-visible rounded-xl border-2 border-[#ffc83d] bg-[#171517] ${
					isMobile ? 'w-full max-w-xs' : 'w-full max-w-md'
				}`}
			>
				<div className='h-16 rounded-t-xl border-b border-[#ffc83d] bg-black p-4'>
					<h2 className='text-center text-2xl font-bold text-[#ffc83d]'>
						Создать чат
					</h2>

					<button
						onClick={toggleCreateRoomModal}
						className='absolute right-2 top-2 text-white hover:text-[#ffc83d]'
					>
						<X className='h-6 w-6' />
					</button>
				</div>
				{/* bgtest-[#171517] */}
				<div className='rounded-xl bg-black p-4 text-white'>
					{/* Stepper Header */}
					<div className='mb-8 flex items-center justify-center gap-4'>
						{/* Первый улей (белый) */}
						<div className='flex h-[39px] w-[39px] items-center justify-center rounded-full bg-[#ffc83d]'>
							<div className='flex h-9 w-9 items-center justify-center rounded-full bg-[#ffc83d]'>
								<div className='relative mb-[3px] mr-[3px] h-5 w-5'>
									{/* Чёрная "тень" под низом (контур) */}
									<HiveIcon className='absolute left-[-1px] top-0 h-5 w-5 transform text-black' />
									{/* Белая иконка сверху */}
									<HiveIcon className='relative h-5 w-5 text-white' />
								</div>
							</div>
						</div>
						<div className='flex flex-col'>
							{/* Стрелочка между шагами */}
							<div className='flex scale-x-[-1] transform items-center justify-center'>
								<img
									src='/logos/justbee.png' // Укажите путь к изображению пчелки
									alt='Bee'
									className='mb-1 h-6 w-6' // Размер картинка равен стрелочке
								/>
							</div>

							{/* Стрелочка между шагами */}
							{/* <svg
								className='h-6 w-6 -rotate-180' // Поворачиваем стрелочку вправо
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								stroke='#ffc83d'
								strokeWidth='2'
								viewBox='0 0 24 24'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path d='M19 12H5' />
								<path d='M12 5l-7 7 7 7' />
							</svg> */}
							<MoveRight className='h-6 w-6' />
						</div>
						{/* Второй улей (чёрный) */}
						<div className='flex h-[39px] w-[39px] items-center justify-center rounded-full bg-[#ffc83d]'>
							<HiveIcon className='h-9 w-9 text-black' />
						</div>
					</div>

					{/* Шаги */}
					<Stepper
						active={active}
						onStepClick={setActive}
						className='stepper-root'
						completedIcon={null}
						styles={{
							stepCompletedIcon: {
								display: 'none' // Скрывает галочку
							},
							step: {
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								textAlign: 'center',
								width: '100%',
								marginBottom: '20px'
							},
							stepLabel: {
								display: 'none' // Убираем стандартные цифры над шагами
							}
						}}
					>
						{/* Шаг 1 - Нажать на "Создать чат" */}
						<Stepper.Step
							// label='Создать чат'
							// description='Нажмите для создания чата'
							icon={<HiveIcon className='h-9 w-9' />}
						>
							<div className='flex flex-col items-center gap-4 p-4'>
								{/* <Button
					  onClick={() => setActive(1)} // Переключаемся на следующий шаг, который будет создание чата
					  className='self-center'
					>
					  Создать чат
					</Button> */}
							</div>
						</Stepper.Step>

						{/* Шаг 2 - Ввод названия чата */}
						<Stepper.Step
							label='Введите имя чата'
							description='1. Введите название, создайте чат'
							icon={
								<div className='flex h-9 w-9 items-center justify-center rounded-full bg-[#ffc83d]'>
									<div className='relative mb-[3px] mr-[3px] h-5 w-5'>
										{/* Чёрная "тень" под низом (контур) */}
										<HiveIcon className='absolute left-[-1px] top-0 h-5 w-5 text-black' />
										{/* Белая иконка сверху */}
										<HiveIcon className='relative h-5 w-5 text-white' />
									</div>
								</div>
							}
						>
							<div className='ml-[21%] flex flex-col items-center justify-center gap-4'>
								<form
									onSubmit={form.onSubmit(() =>
										handleCreateChatroom()
									)}
									className='flex w-full flex-col items-center gap-4'
								>
									<TextInput
										placeholder='Введите имя чата'
										// label={
										// 	<div className='mb-1 ml-[25%] text-gray-400'>
										// 		Имя чата
										// 	</div>
										// }
										error={form.errors.name}
										{...form.getInputProps('name')}
										styles={{
											input: {
												backgroundColor: '#1A1B1E',
												color: '#ccc',
												borderColor: '#444',
												borderRadius: '6px',
												paddingLeft: '12px',
												paddingRight: '12px',
												paddingTop: '6px',
												paddingBottom: '6px'
											},
											label: {
												color: '#ccc',
												marginBottom: '8px'
											}
										}}
										className='w-full'
									/>
									{form.values.name && (
										<Button className='self-center'>
											Создать
										</Button>
									)}
								</form>
							</div>
						</Stepper.Step>

						{/* Шаг 3 - Добавление участников */}
						<Stepper.Step
							label='Добавьте участников'
							description='2. Добавьте участников в чат'
							icon={
								<HiveIcon className='mb-2 h-9 w-9 scale-150 transform rounded-full bg-[#ffc83d] p-1 text-black' />
							}
						>
							<div className='flex flex-col items-center gap-4 p-4'>
								<MultiSelect
									query={searchTerm}
									setQuery={setSearchTerm}
									selectItems={selectItems}
									selectedUsers={selectedUsers}
									handleAddUser={handleAddUser}
									handleRemoveUser={handleRemoveUser}
									handleSearchChange={handleSearchChange}
								/>
							</div>
						</Stepper.Step>

						<Stepper.Completed>
							<div className='flex flex-col items-center gap-4 p-4'>
								<p className='text-center text-sm text-gray-300'>
									Вы успешно создали чат. Добавьте участников
									и продолжайте разговор!
								</p>
							</div>
						</Stepper.Completed>
					</Stepper>

					<Group className='mt-4 flex justify-between'>
						{/* <Button onClick={() => handleStepChange(active - 1)}>
							Назад
						</Button> */}
						{selectedUsers.length > 0 && (
							<Button onClick={handleAddUsersToChatroom}>
								Добавить участников
							</Button>
						)}
					</Group>
				</div>
			</div>
		</div>
	)
}

export default AddChatroom
