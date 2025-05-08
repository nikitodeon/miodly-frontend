import { HeaderMenu } from './HeaderMenu'

export function Header() {
	return (
		<header className='flex h-full items-center gap-x-4 border-b border-border bg-card p-4'>
			<HeaderMenu />
		</header>
	)
}
