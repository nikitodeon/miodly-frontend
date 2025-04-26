'use client'

import { useMediaQuery } from '@mantine/hooks'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/common/Button'

import { useLogoutUserMutation } from '@/graphql/generated/output'

import { useAuth } from '@/hooks/useAuth'

import { useGeneralStore } from '@/store/generalStore'

import { NightLightSidebarToggle } from '../night-light/night-light-sidebar-toggle'

import { cn } from '@/lib/utils'

const links = [
	{
		name: 'Панель управления',
		href: '/dashboard/settings'
	}
]

export function SidebarNavigation() {
	const toggleCreateRoomModal = useGeneralStore(
		state => state.toggleCreateRoomModal
	)
	const t = useTranslations('layout.header.headerMenu.profileMenu')
	const router = useRouter()

	const { exit } = useAuth()
	const pathname = usePathname()
	const [logout] = useLogoutUserMutation({
		onCompleted() {
			exit()
			toast.success(t('successMessage'))
			router.push('/account/login')
		},
		onError() {
			toast.error(t('errorMessage'))
		}
	})
	const isMobile = useMediaQuery('(max-width: 768px)')
	return (
		<div className='flex flex-col items-center gap-3'>
			<div className='bg- h-10 w-[70%] rounded-full bg-primary hover:bg-[#e5ac28]'></div>
			<div className='bg- h-10 w-[80%] rounded-full bg-primary hover:bg-[#e5ac28]'></div>
			<Button
				className='w-[90%] font-semibold hover:bg-[#e5ac28]'
				onClick={toggleCreateRoomModal}
			>
				Создать комнату
			</Button>
			{links.map(link => (
				<Link
					key={link.href}
					href={link.href}
					className={cn('font-semibold') + ' w-[90%]'}
				>
					<Button className='w-full font-semibold hover:bg-[#e5ac28]'>
						{link.name}
					</Button>
				</Link>
			))}

			{isMobile && <NightLightSidebarToggle />}
			<Button
				className='w-[90%] font-semibold hover:bg-[#e5ac28]'
				onClick={() => logout()}
			>
				Выйти
			</Button>
			<div className='bg- h-10 w-[80%] rounded-full bg-primary hover:bg-[#e5ac28]'></div>

			<div className='bg- h-10 w-[70%] rounded-full bg-primary hover:bg-[#e5ac28]'></div>
		</div>
	)
}
