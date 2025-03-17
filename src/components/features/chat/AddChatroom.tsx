'use client'

import { gql, useMutation, useQuery } from '@apollo/client'
import { Group, Modal, MultiSelect, Stepper, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import HiveIcon from '@mui/icons-material/Hive'
import { useState } from 'react'

import { Button } from '@/components/ui/common/Button'

import { Chatroom, SearchUsersQuery } from '@/graphql/generated/output'

import { useGeneralStore } from '@/store/generalStore'

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
	//
	const [createChatroom, { loading }] = useMutation(gql`
		mutation createChatroom($name: String!) {
			createChatroom(name: $name) {
				id
				name
			}
		}
	`)

	//

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

	//

	const [selectedUsers, setSelectedUsers] = useState<string[]>([])

	const [addUsersToChatroomMutation] = useMutation(addUsersToChatroom)

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
	const plsh = <span className='text-white'>Название чата</span>
	const plsh2 = <span className='text-white'>Выберите участников</span>
	const isMobile = useMediaQuery('(max-width: 768px)')
	return (
		<Modal
			// className='h-[100px] w-[100px] '
			className={` ${isMobile ? 'w-[100px]' : ''} `}
			opened={isCreateRoomModalOpen}
			onClose={toggleCreateRoomModal}
			styles={{
				root: {
					// backgroundColor: '#171517', // Set background color of the modal
					color: 'white', // Set text color in the modal
					// padding: '20px',
					borderRadius: '12px', // Закругленные углы
					border: '2px solid #ffc83d'
					//
					// width: isMobile ? '100px' : '', // Устанавливаем ширину в зависимости от устройства
					// height: isMobile ? '300px' : ''
					// Add padding to the modal
				},
				body: {
					backgroundColor: '#000000',
					borderColor: '#0000', // Set background color for the body
					color: 'white' // Set text color for the body
					// borderRadius: '12px'
				},
				header: {
					backgroundColor: '#000000',
					color: 'white'
					// borderBottom: '1px solid #ffc83d' // Set header text color if needed
				},
				content: { borderRadius: '12px', border: '2px solid #ffc83d' }
			}}
		>
			<Stepper
				active={active}
				onStepClick={setActive}
				breakpoint='sm'
				className='#171517'
			>
				<Stepper.Step
					label='Первый шаг'
					completedIcon={
						<div
							style={{
								backgroundColor: '#ffc83d', // Фон завершенной иконки (зеленый)
								borderRadius: '50%', // Округлый фон
								width: 70, // Размер фона
								height: 39, // Размер фона
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'white' // Цвет самой иконки
							}}
						>
							<HiveIcon className='t- h-9 w-9' />
						</div>
					}
					progressIcon={
						<div
							style={{
								backgroundColor: '#ffc83d', // Фон иконки, когда шаг в процессе
								borderRadius: '50%',
								width: 70, // Размер фона
								height: 39,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'white'
							}}
						>
							<HiveIcon className='t- h-9 w-9' />
						</div>
					}
					className='text-white'
					description='Создайте чат'
				>
					<div>Создайте чат</div>
				</Stepper.Step>
				<Stepper.Step
					className='text-white'
					label='Второй шаг'
					description='Добавьте участников'
					// icon={null}
					icon={
						<div
							style={{
								backgroundColor: '#ffc83d',
								borderRadius: '50%',
								width: 35,
								height: 35,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: '18px',
								fontWeight: 'bold',
								color: 'black'
							}}
						>
							<HiveIcon className='t- h-9 w-9' />
						</div>
					}
					completedIcon={
						<div
							style={{
								backgroundColor: '#ffc83d', // Фон завершенной иконки (зеленый)
								borderRadius: '50%', // Округлый фон
								width: 70, // Размер фона
								height: 39, // Размер фона
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'black' // Цвет самой иконки
							}}
						>
							<HiveIcon className='t- h-9 w-9' />
						</div>
					}
					progressIcon={
						<div
							style={{
								backgroundColor: '#ffc83d', // Фон иконки, когда шаг в процессе
								borderRadius: '50%',
								width: 70, // Размер фона
								height: 39,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'black'
							}}
						>
							<HiveIcon className='t- h-9 w-9' />
						</div>
					}
				>
					<form
						onSubmit={form.onSubmit(() => handleCreateChatroom())}
					>
						<TextInput
							placeholder='Введите имя чата'
							label={
								<span className='text-gray-400'>Имя чата</span>
							}
							error={form.errors.name}
							{...form.getInputProps('name')}
							styles={{
								input: {
									backgroundColor: '#1A1B1E', // Тёмный фон
									color: '#ccc', // Серый текст
									borderColor: '#444', // Тёмно-серый контур
									borderRadius: '6px', // Закруглённые углы
									paddingLeft: '12px', // Отступ слева
									paddingRight: '12px' // Отступ справа
								},
								label: {
									color: '#ccc', // Серый цвет для лейбла
									marginBottom: '8px' // Отступ снизу
								}
							}}
						/>
						{form.values.name && (
							<Button
								// mt={'md'}
								className='mt-4'
								type='submit'
							>
								Создать
							</Button>
						)}
					</form>
				</Stepper.Step>
				<Stepper.Completed>
					<MultiSelect
						onSearchChange={handleSearchChange}
						nothingFound='Ничего не найдено'
						searchable
						pb={'xl'}
						data={selectItems}
						label={plsh2}
						placeholder='Найдите учатников чата по имени'
						onChange={values => setSelectedUsers(values)}
						styles={{
							input: {
								backgroundColor: '#1A1B1E', // Черный фон для input
								color: '#ccc', // Серый текст
								borderColor: '#444', // Темно-серые границы
								borderRadius: '6px', // Закругленные углы
								paddingLeft: '12px', // Отступ слева для текста
								paddingRight: '12px' // Отступ справа для текста
							},
							dropdown: {
								backgroundColor: '#1A1B1E', // Черный фон для выпадающего списка
								borderRadius: '6px', // Закругленные углы
								borderColor: '#444' // Темно-серые границы
							},
							item: {
								backgroundColor: '#1A1B1E', // Черный фон для элементов
								color: '#ccc', // Серый цвет текста в элементах
								'&[data-selected]': {
									backgroundColor: '#444', // Темно-серый фон для выбранных элементов
									color: 'white' // Белый текст для выбранных элементов
								},
								'&[data-hovered]': {
									backgroundColor: '#333' // Тень на элементах при наведении
								}
							},
							label: {
								color: '#ccc', // Серый цвет для лейбла
								marginBottom: '8px' // Отступ снизу
							}
						}}
					/>
				</Stepper.Completed>
			</Stepper>

			<Group
				// mt='xl'
				className='mt-4'
			>
				<Button
					// variant='default'
					onClick={() => handleStepChange(active - 1)}
				>
					Назад
				</Button>

				{selectedUsers.length > 0 && (
					<Button onClick={() => handleAddUsersToChatroom()}>
						Добавить участников
					</Button>
				)}
			</Group>
		</Modal>
	)
}

export default AddChatroom
