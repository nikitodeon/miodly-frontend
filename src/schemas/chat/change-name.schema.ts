import { z } from 'zod'

export const changeNameSchema = z.object({
	name: z
		.string()
		.max(30, 'Name cannot be longer than 10 characters')
		.min(1, 'Name is required')
})

export type TypeChangeNameSchema = z.infer<typeof changeNameSchema>
