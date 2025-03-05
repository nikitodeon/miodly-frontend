'use client'

import dynamic from 'next/dynamic'
import type { PropsWithChildren } from 'react'

// import { LayoutContainer } from '@/components/layout/LayoutContainer'
import { Header } from '@/components/layout/header/Header'

// import { Sidebar } from '@/components/layout/sidebar/Sidebar'
const Router = dynamic(
	() => import('react-router-dom').then(mod => mod.BrowserRouter),
	{ ssr: false }
)
export default function SiteLayout({ children }: PropsWithChildren<unknown>) {
	return (
		<div className='flex h-full flex-col'>
			<div className='flex-1'>
				<div className='fixed inset-y-0 z-50 h-[75px] w-full'>
					<Header />
				</div>
				{/* <Sidebar />
				<LayoutContainer>*/}
				<Router>{children}</Router>
				{/*</LayoutContainer> */}
			</div>
		</div>
	)
}
