'use client'

import dynamic from 'next/dynamic'
import type { PropsWithChildren } from 'react'

const Router = dynamic(
	() => import('react-router-dom').then(mod => mod.BrowserRouter),
	{ ssr: false }
)

export default function SiteLayout({ children }: PropsWithChildren<unknown>) {
	return (
		<div className='flex h-full flex-col'>
			<div className='flex-1'>
				<Router>{children}</Router>
			</div>
		</div>
	)
}
