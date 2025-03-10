import React from 'react'

// Иконка отправки сообщения
export const SendIcon: React.FC<{ size?: number; color?: string }> = ({
	size = 16,
	color = '#000'
}) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 16 16'
		fill='none'
		height={size}
		width={size}
	>
		<path
			fill={color}
			fillRule='evenodd'
			d='M1.563 1.497a0.667 0.667 0 0 1 0.735-0.093l12 6a0.667 0.667 0 0 1 0 1.193l-12 6a0.667 0.667 0 0 1 -0.931-0.807L3.075 8.667H6.667a0.667 0.667 0 1 0 0 -1.333H3.075L1.367 2.211a0.667 0.667 0 0 1 0.196-0.714z'
			clipRule='evenodd'
			strokeWidth={0.667}
		/>
	</svg>
)
export const AttachIcon: React.FC<{ size?: number; color?: string }> = ({
	size = 34, // Увеличен в 1.5 раза
	color = '#000'
}) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 16 16'
		height={size}
		width={size}
		style={{ transform: 'rotate(90deg)' }} // Прямой поворот через inline-стиль
	>
		<desc>Attachment 2 Fill Streamline Icon: https://streamlinehq.com</desc>
		<g fill='none' fillRule='nonzero'>
			<path
				d='M3.993333333333333 6.821333333333333a2 2 0 0 1 2.828 -2.828l5.186 5.1853333333333325a2 2 0 1 1 -2.828666666666667 2.828l-2.239333333333333 -2.2386666666666666a0.5 0.5 0 0 1 0.7066666666666667 -0.7073333333333333l2.0039999999999996 2.003333333333333a1 1 0 1 0 1.414 -1.414l-2.003333333333333 -2.003333333333333a2.5 2.5 0 1 0 -3.535333333333333 3.535333333333333l2.2386666666666666 2.239333333333333a4 4 0 0 0 5.657333333333334 -5.657333333333334l-5.1853333333333325 -5.1853333333333325a4 4 0 0 0 -5.889333333333333 5.404L2.3433333333333333 8l0.2353333333333333 0.236a1 1 0 0 0 1.4146666666666665 -1.4146666666666665Z'
				fill={color}
				strokeWidth='0.6667'
			></path>
		</g>
	</svg>
)
