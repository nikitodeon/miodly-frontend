'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

import { Button } from '@/components/ui/common/Button'

import { useAuth } from '@/hooks/useAuth'

import { ProfileMenu } from './ProfileMenu'

export function HeaderMenu() {
	const t = useTranslations('layout.header.headerMenu')
	const { isAuthenticated } = useAuth()

	return (
		<div className='ml-auto flex items-center gap-x-4'>
			{isAuthenticated && <ProfileMenu />}
		</div>
	)
}
