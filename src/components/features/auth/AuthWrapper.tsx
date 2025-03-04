import Image from 'next/image'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

import { LogoImage } from '@/components/images/LogoImage'
import { Button } from '@/components/ui/common/Button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
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
	return (
		<div className='flex h-full items-center justify-center'>
			<Card className='w-[450px]'>
				<CardHeader className='flex-row items-center justify-center gap-x-4'>
					<Image
						src='/logos/biglogoblgl.png'
						alt='Logo'
						width={180}
						height={180}
					/>

					{/* <LogoImage /> */}
					{/* <CardTitle>{heading}</CardTitle> */}
				</CardHeader>
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
