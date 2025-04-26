import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface SelectItem {
	value: string
	label: string
}

interface SelectProps {
	query: string
	setQuery: (value: string) => void
	selectItems: SelectItem[]
	selectedUsers: string[]
	handleAddUser: (userId: string) => void
	handleRemoveUser: (userId: string) => void
	handleSearchChange: (query: string) => void
}

export default function MultiSelect({
	query,
	setQuery,
	selectItems,
	selectedUsers,
	handleAddUser,
	handleRemoveUser,
	handleSearchChange
}: SelectProps) {
	const [menuOpen, setMenuOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	const filteredOptions = selectItems.filter(
		item =>
			item.label.toLowerCase().includes(query.toLowerCase()) &&
			!selectedUsers.includes(item.value)
	)

	const isDisabled =
		!query.trim() ||
		selectedUsers.some(
			userId =>
				selectItems
					.find(item => item.value === userId)
					?.label.toLowerCase() === query.toLowerCase()
		)

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && query.trim() && !isDisabled) {
			const userToAdd = selectItems.find(
				item => item.label.toLowerCase() === query.toLowerCase()
			)
			if (userToAdd) {
				handleAddUser(userToAdd.value)
			}
		}
	}

	useEffect(() => {
		if (menuOpen) {
			inputRef.current?.focus()
		}
	}, [menuOpen])

	return (
		<div className='relative'>
			{selectedUsers.length > 0 && (
				<div className='mb-2 flex w-full flex-wrap gap-1 rounded-t-lg bg-[#1A1B1E] p-2 text-xs'>
					{selectedUsers.map(userId => {
						const user = selectItems.find(
							item => item.value === userId
						)
						return (
							<div
								key={userId}
								className='flex w-fit items-center gap-1 rounded-full border border-[#444] bg-[#2A2B2E] px-2 py-1 text-[#ccc]'
							>
								{user?.label || userId}
								<button
									onClick={() => handleRemoveUser(userId)}
									className='text-[#777] hover:text-[#ccc]'
								>
									×
								</button>
							</div>
						)
					})}
				</div>
			)}

			<div className='relative w-full'>
				{/* Иконка — поверх input */}
				<Search
					className='absolute left-3 top-1/2 -translate-y-1/2 text-[#777]'
					size={16}
				/>

				<input
					ref={inputRef}
					type='text'
					value={query}
					onChange={e => {
						setQuery(e.target.value)
						handleSearchChange(e.target.value)
					}}
					placeholder='Найдите участников'
					className='w-full rounded-lg bg-[#1A1B1E] py-2 pl-9 pr-2 text-[#ccc] outline-none'
					onFocus={() => setMenuOpen(true)}
					onBlur={() => setTimeout(() => setMenuOpen(false), 200)}
					onKeyDown={handleKeyDown}
				/>
			</div>

			{menuOpen && filteredOptions.length > 0 && (
				<div className='absolute z-10 mt-1 w-full rounded-lg border border-[#444] bg-[#1A1B1E] shadow-lg'>
					<ul className='max-h-60 overflow-y-auto'>
						{filteredOptions.map(item => (
							<li
								key={item.value}
								className='cursor-pointer p-2 text-[#ccc] hover:bg-[#333]'
								onMouseDown={e => e.preventDefault()}
								onClick={() => handleAddUser(item.value)}
							>
								{item.label}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}
