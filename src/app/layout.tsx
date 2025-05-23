import { MantineProvider } from '@mantine/core'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import NextTopLoader from 'nextjs-toploader'

import { NightLightProvider } from '@/components/features/night-light/night-light-provider'
import { TooltipProvider } from '@/components/ui/common/Tooltip'

import {
	SITE_DESCRIPTION,
	SITE_KEYWORDS,
	SITE_NAME
} from '@/libs/constants/seo.constants'
import { APP_URL } from '@/libs/constants/url.constants'

import { ApolloClientProvider } from '@/providers/ApolloClientProvider'
import { ToastProvider } from '@/providers/ToastProvider'

import '@/styles/globals.css'
import '@/styles/themes.css'

export const metadata: Metadata = {
	title: {
		absolute: SITE_NAME,
		template: `%s - ${SITE_NAME}`
	},
	description: SITE_DESCRIPTION,
	metadataBase: new URL(APP_URL),
	applicationName: SITE_NAME,
	authors: [
		{
			name: 'Nikita',
			url: new URL('https://github.com/nikitodeon')
		}
	],
	keywords: SITE_KEYWORDS,
	generator: 'Next.js',
	creator: 'Nikita',
	publisher: 'nikitodeon',
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon.ico',
		apple: '/favicon.ico',
		other: {
			rel: '/',
			url: '/favicon.ico',
			sizes: '256x256',
			type: 'image/png'
		}
	},
	openGraph: {
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		type: 'website',
		emails: ['nikitodeon@gmail.com'],
		locale: 'ru_RU',
		images: [
			{
				url: '/favicon.ico',
				width: 512,
				height: 512,
				alt: SITE_NAME
			}
		],
		url: new URL(APP_URL)
	},
	twitter: {
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		images: [
			{
				url: '/favicon.ico',
				width: 512,
				height: 512,
				alt: SITE_NAME
			}
		]
	}
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const locale = await getLocale()
	const messages = await getMessages()

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={GeistSans.variable}>
				<ApolloClientProvider>
					<NextIntlClientProvider messages={messages}>
						<NextTopLoader color='#ffc93c' />

						<MantineProvider>
							<TooltipProvider>
								<ToastProvider />
								<NightLightProvider>
									{children}
								</NightLightProvider>
							</TooltipProvider>
						</MantineProvider>
					</NextIntlClientProvider>
				</ApolloClientProvider>
			</body>
		</html>
	)
}
