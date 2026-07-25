import { z } from "zod"

export const OrderStatusSchema = z.enum([
	'NOWE', 'OPŁACONE', 'SPAKOWANE', 'WYSŁANE', 'DOSTARCZONE', 'ZWROT', 'ANULOWANE'
])

export const PaginationSchema = z.object({
	page: z.number(),
	limit: z.number(),
	total: z.number(),
	totalPages: z.number()
})




export const MockSchema = z.object({
	mock: z.string().nullish(),
})
