'use client'

import {
	Eye,
	EyeOff,
	Filter,
	Moon,
	Sun,
	SunMedium,
	SunMoon
} from 'lucide-react'

import { Button } from '@/components/ui/common/Button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/common/DropdownMenu'
import { Slider } from '@/components/ui/common/Slider'

import { useNightLight } from './night-light-provider'

export function NightLightToggle() {
	const { enabled, strength, toggle, setStrength } = useNightLight()

	return (
		<div className='relative'>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='outline'
						size='icon'
						className={`relative h-9 w-9 hover:bg-white/10`}
					>
						<SunMedium
							className={`h-[1.2rem] w-[1.2rem] transition-all ${enabled ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
						/>
						<SunMoon
							className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${enabled ? 'scale-150 text-amber-600 opacity-100' : 'scale-0 opacity-0'}`}
						/>

						<span className='sr-only'>Toggle night light</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align='end'
					className='w-56 border-[#ecac21] bg-black'
				>
					<div className='p-2'>
						<h4 className='mb-1 flex justify-between text-sm font-medium'>
							<span>Ночной свет</span>
							<span className='text-amber-600'>
								{enabled ? `${strength}%` : 'Off'}
							</span>
						</h4>
						<Slider
							value={[strength]}
							min={0}
							max={100}
							step={1}
							onValueChange={values => setStrength(values[0])}
							className='my-2 w-full'
							disabled={!enabled}
						/>
						<div className='flex justify-between text-xs text-muted-foreground'>
							<span>Холоднее</span>
							<span>Теплее</span>
						</div>
					</div>
					<DropdownMenuItem
						onClick={toggle}
						className='cursor-pointer'
					>
						{enabled ? 'Выключить' : 'Включить'}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* {enabled && (
				<div className='absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-white bg-amber-500' />
			)} */}
		</div>
	)
}
