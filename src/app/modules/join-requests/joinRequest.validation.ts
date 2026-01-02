import { z } from 'zod'

export const createJoinRequestSchema = z.object({})

export const updateJoinRequestStatusSchema = z.object({
    status: z.enum(['accepted', 'rejected']),
})
