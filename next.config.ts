import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/libs/i18n/request.ts')

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'bb9e1eaf-bd2b-47e4-bdb9-eccd2a5b2245.selstorage.ru'
			}
		]
	}
}

export default withNextIntl(nextConfig)
