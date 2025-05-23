'use client'

import { LayoutDashboard, Loader2, LogOut, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/common/DropdownMenu'
import { ChannelAvatar } from '@/components/ui/elements/ChannelAvatar'

import { useLogoutUserMutation } from '@/graphql/generated/output'

import { useAuth } from '@/hooks/useAuth'
import { useCurrent } from '@/hooks/useCurrent'

export function ProfileMenu() {
	const t = useTranslations('layout.header.headerMenu.profileMenu')
	const router = useRouter()

	const { exit } = useAuth()
	const { user, isLoadingProfile } = useCurrent()

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

	return isLoadingProfile || !user ? (
		<Loader2 className='size-6 animate-spin text-muted-foreground' />
	) : (
		<>
			{/* <Notifications /> */}
			<DropdownMenu>
				<DropdownMenuTrigger>
					<ChannelAvatar channel={user} />
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align='end'
					className='w-[230px] border-[#ecac21] bg-black'
				>
					<div className='flex items-center gap-x-3 bg-black p-2'>
						<ChannelAvatar channel={user} />
						<h2 className='font-medium text-foreground'>
							{user.username}
						</h2>
					</div>
					<DropdownMenuSeparator className='bg-[#ecac21]' />
					{/* <Link href={`/${user.username}`}>
						<DropdownMenuItem>
							<User className='mr-2 size-2' />
							{t('channel')}
						</DropdownMenuItem>
					</Link> */}
					<Link href='/dashboard/settings'>
						<DropdownMenuItem>
							<LayoutDashboard className='mr-2 size-2' />
							{/* {t('dashboard')} */} Панель управления
						</DropdownMenuItem>
					</Link>
					<DropdownMenuItem onClick={() => logout()}>
						<LogOut className='mr-2 size-2' />
						{/* {t('logout')} */}Выйти
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
