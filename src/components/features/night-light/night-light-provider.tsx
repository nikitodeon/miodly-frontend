'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type NightLightContextType = {
	enabled: boolean
	strength: number // 0-100 scale
	toggle: () => void
	setStrength: (value: number) => void
}

const NightLightContext = createContext<NightLightContextType | undefined>(
	undefined
)

const NIGHT_LIGHT_KEY = 'nightLightSettings'

export function NightLightProvider({
	children
}: {
	children: React.ReactNode
}) {
	// Загружаем настройки из localStorage или устанавливаем значения по умолчанию
	const [enabled, setEnabled] = useState<boolean>(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem(NIGHT_LIGHT_KEY)
			return saved ? JSON.parse(saved).enabled : true
		}
		return true
	})

	const [strength, setStrength] = useState<number>(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem(NIGHT_LIGHT_KEY)
			return saved ? JSON.parse(saved).strength : 55
		}
		return 55
	})

	// Сохраняем настройки в localStorage при изменении
	useEffect(() => {
		localStorage.setItem(
			NIGHT_LIGHT_KEY,
			JSON.stringify({ enabled, strength })
		)
	}, [enabled, strength])

	const toggle = () => setEnabled(prev => !prev)

	useEffect(() => {
		const styleId = 'night-light-style'
		let styleElement = document.getElementById(
			styleId
		) as HTMLStyleElement | null

		if (!styleElement) {
			styleElement = document.createElement('style')
			styleElement.id = styleId
			document.head.appendChild(styleElement)
		}

		if (enabled) {
			const opacity = (strength / 100) * 0.93
			const color = `rgba(255, 159, 46, ${opacity})`

			styleElement.textContent = `
        html::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${color};
          mix-blend-mode: multiply;
          pointer-events: none;
          z-index: 2147483647;
        }
      `
		} else {
			styleElement.textContent = ''
		}

		return () => {
			if (styleElement) {
				styleElement.textContent = ''
			}
		}
	}, [enabled, strength])

	return (
		<NightLightContext.Provider
			value={{ enabled, strength, toggle, setStrength }}
		>
			{children}
		</NightLightContext.Provider>
	)
}

export function useNightLight() {
	const context = useContext(NightLightContext)
	if (context === undefined) {
		throw new Error(
			'useNightLight must be used within a NightLightProvider'
		)
	}
	return context
}
