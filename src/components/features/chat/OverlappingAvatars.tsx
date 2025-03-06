// import { User } from "@/graphql/generated/output"
import { Avatar, Tooltip } from '@mantine/core'
import React from 'react'

import { getMediaSource } from '@/utils/get-media-source'

function OverlappingAvatars({ users }: { users: any }) {
	const remainingUsers = users.length > 3 ? users.slice(3) : []

	const remainingNames = remainingUsers
		.map((user: any) => user.fullname)
		.join(', ')

	return (
		<Tooltip.Group openDelay={300} closeDelay={100}>
			<Avatar.Group spacing='sm'>
				<>
					{users.slice(0, 3).map((user: any) => {
						return (
							<Tooltip key={user.id} label={user.fullname}>
								<Avatar
									src={getMediaSource(user.avatar)}
									radius='xl'
									alt={user.fullname}
									size='lg'
									styles={{
										root: {
											border: 'none',
											boxShadow: 'none',
											backgroundColor: 'transparent'
										}
									}}
								/>
							</Tooltip>
						)
					})}

					{users.length > 3 && (
						<Tooltip label={remainingNames}>
							<Avatar
								size='lg'
								radius='xl'
								children={`+${users.length - 3}`}
							/>
						</Tooltip>
					)}
				</>
			</Avatar.Group>
		</Tooltip.Group>
	)
}

export default OverlappingAvatars
