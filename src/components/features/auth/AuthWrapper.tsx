import { useMediaQuery } from '@mantine/hooks'
import Image from 'next/image'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

import { Button } from '@/components/ui/common/Button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader
} from '@/components/ui/common/Card'

interface AuthWrapperProps {
	heading: string
	backButtonLabel?: string
	backButtonHref?: string
}

export function AuthWrapper({
	children,
	heading,
	backButtonLabel,
	backButtonHref
}: PropsWithChildren<AuthWrapperProps>) {
	const isMobile = useMediaQuery('(max-width: 768px)')

	return (
		<div className='flex h-full items-center justify-center'>
			<Card className={` ${isMobile ? 'w-[350px]' : 'w-[450px]'} `}>
				<CardHeader className='flex-row items-center justify-center gap-x-4'>
					<Image
						src='/logos/biglogoblgl.png'
						alt='Logo'
						width={isMobile ? 150 : 180}
						height={180}
					/>
				</CardHeader>
				<div className='border-1 mx-auto mb-3 w-[90%] border border-yellow-300 p-2 text-center text-sm text-white'>
					Юзеры для теста: 1) логин: Oleg, пароль: password, 2) логин:
					Alex, пароль: password,{' '}
				</div>
				<CardContent>{children}</CardContent>
				<CardFooter className='-mt-2'>
					{backButtonLabel && backButtonHref && (
						<Link href={backButtonHref} className='w-full'>
							<Button variant='ghost' className='w-full'>
								{backButtonLabel}
							</Button>
						</Link>
					)}
				</CardFooter>
			</Card>
		</div>
	)
}
