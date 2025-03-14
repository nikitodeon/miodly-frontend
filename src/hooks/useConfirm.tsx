import { useMediaQuery } from '@mantine/hooks'
import { useState } from 'react'
import { JSX } from 'react'

import { Button } from '@/components/ui/common/Button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/common/Dialog'

export const useConfirm = (
	title: string,
	message: string
): [/*any, any */ () => JSX.Element, () => Promise<unknown>] => {
	const [promise, setPromise] = useState<{
		resolve: (value: boolean) => void
	} | null>(null)

	const confirm = () =>
		new Promise(resolve => {
			setPromise({ resolve })
		})

	const handleClose = () => setPromise(null)

	const handleCancel = () => {
		promise?.resolve(false)
		handleClose()
	}

	const handleConfirm = () => {
		promise?.resolve(true)
		handleClose()
	}
	const isMobile = useMediaQuery('(max-width: 768px)')
	const ConfirmDialog = () => {
		return (
			<Dialog open={promise !== null} onOpenChange={handleCancel}>
				<DialogContent
					className={` ${isMobile ? 'w-[350px]' : 'h-[220px]'} border-[3px] border-[#ecac21]`}
				>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{message}</DialogDescription>
					</DialogHeader>
					<DialogFooter className='gap-x-3 gap-y-3 pt-2'>
						<Button variant='outline' onClick={handleCancel}>
							Отменить
						</Button>
						<Button onClick={handleConfirm}>Подтвердить</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}

	return [ConfirmDialog, confirm]
}
