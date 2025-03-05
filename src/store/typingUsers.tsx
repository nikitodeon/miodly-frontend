'use client'

import React, { ReactNode, createContext, useContext, useState } from 'react'

// Определяем интерфейсы
// interface User {
// 	id: string
// 	username: string
// 	avatar: string
// }

interface TypingUsersContextType {
	typingUsers: { [key: string]: any }
	addUser: (user: any) => void
	removeUser: (userId: string) => void
}

// Создаем контекст для пользователей с типом TypingUsersContextType или undefined
const TypingUsersContext = createContext<TypingUsersContextType | undefined>(
	undefined
)

// Хук для использования контекста
export const useTypingUsers = () => {
	const context = useContext(TypingUsersContext)
	if (!context) {
		throw new Error(
			'useTypingUsers must be used within a TypingUsersProvider'
		)
	}
	return context
}

// Компонент-обертка для предоставления состояния всем дочерним компонентам
interface TypingUsersProviderProps {
	children: ReactNode
}

export const TypingUsersProvider = ({ children }: TypingUsersProviderProps) => {
	const [typingUsers, setTypingUsers] = useState<any[]>([]) // Используем массив для пользователей

	// Добавление пользователя в список
	const addUser = (user: any) => {
		setTypingUsers(prev => {
			// Проверяем, нет ли уже этого пользователя в списке
			if (!prev.find(u => u.id === user.id)) {
				return [...prev, user]
			}
			return prev
		})
	}

	// Удаление пользователя из списка
	const removeUser = (userId: string) => {
		setTypingUsers(prev => prev.filter(user => user.id !== userId))
	}

	return (
		<TypingUsersContext.Provider
			value={{ typingUsers, addUser, removeUser }}
		>
			{children}
		</TypingUsersContext.Provider>
	)
}
