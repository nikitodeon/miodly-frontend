'use-client'

// import { Spinner } from '@nextui-org/react'
import React from 'react'

import { cn } from '@/lib/utils'

interface Props {
	className?: string
}

export const Loader: React.FC<Props> = ({ className }) => {
	return (
		<div
			className={cn(
				'flex min-h-[200px] w-[500px] items-center justify-center bg-slate-50 text-black',
				className
			)}
		>
			loading
			{/* <Spinner color='warning' className='mx-auto text-black' /> */}
		</div>
	)
}
