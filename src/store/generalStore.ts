import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GeneralState {
	isProfileSettingsModalOpen: boolean
	isLoginModalOpen: boolean
	isCreateRoomModalOpen: boolean
	toggleProfileSettingsModal: () => void
	toggleLoginModal: () => void
	toggleCreateRoomModal: () => void
}

export const useGeneralStore = create<GeneralState>()(
	persist(
		set => ({
			isProfileSettingsModalOpen: false,
			isLoginModalOpen: false,
			isCreateRoomModalOpen: false,

			toggleProfileSettingsModal: () =>
				set(state => ({
					isProfileSettingsModalOpen:
						!state.isProfileSettingsModalOpen
				})),
			// set(state => {
			// 	console.log(
			// 		'Меняем состояние:',
			// 		!state.isCreateRoomModalOpen
			// 	)
			// 	return {
			// 		isCreateRoomModalOpen: !state.isCreateRoomModalOpen
			// 	}
			// }),
			toggleLoginModal: () =>
				set(state => ({
					isLoginModalOpen: !state.isLoginModalOpen
				})),
			toggleCreateRoomModal: () =>
				set(state => ({
					isCreateRoomModalOpen: !state.isCreateRoomModalOpen
				}))
		}),
		{
			name: 'general-store'
		}
	)
)
