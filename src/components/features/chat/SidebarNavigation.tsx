'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/common/Button'

import { useLogoutUserMutation } from '@/graphql/generated/output'

import { useAuth } from '@/hooks/useAuth'

import { useGeneralStore } from '@/store/generalStore'

import { cn } from '@/lib/utils'

const links = [
	{
		name: 'Панель управления',
		href: '/dashboard/settings'
	}
	// {
	// 	name: 'Выйти',
	// 	href: '/dashboard/orders'
	// }
	// {
	// 	name: 'Продукты',
	// 	href: '/dashboard/products'
	// },
	// {
	// 	name: 'Баннер',
	// 	href: '/dashboard/banner'
	// },
	// {
	// 	name: 'Категории',
	// 	href: '/dashboard/categories'
	// }
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
	return (
		<>
			{' '}
			<Button
				className='font-semibold hover:bg-[#e5ac28]'
				onClick={toggleCreateRoomModal}
			>
				Создать комнату
			</Button>
			{links.map(link => (
				<Link
					key={link.href}
					href={link.href}
					className={cn(
						'font-semibold'
						// link.href === pathname
						// 	? 'text-[#000000] hover:text-[#3d3d3d]'
						// 	: 'text-[#000000] hover:text-[#3d3d3d]'
					)}
				>
					<Button className='w-full hover:bg-[#e5ac28]'>
						{link.name}
					</Button>
				</Link>
			))}
			<Button
				className='font-semibold hover:bg-[#e5ac28]'
				onClick={() => logout()}
			>
				Выйти
			</Button>
		</>
	)
}
