import { z } from "zod"

export type OrderStatusType = z.infer<typeof OrderStatusSchema>
export const OrderStatusSchema = z.enum([
	'NOWE', 'OPŁACONE', 'SPAKOWANE', 'WYSŁANE', 'DOSTARCZONE', 'ZWROT', 'ANULOWANE'
])

export const CustomerSchema = z.object({
	name: z.string(),
	email: z.email(),
})

export type OrderType = z.infer<typeof OrderSchema>
export const OrderSchema = z.object({
	id: z.number(),
	number: z.string(),
	customer: CustomerSchema,
	status: OrderStatusSchema,
	total: z.number(),
	createdAt: z.iso.datetime(),
})

export const PaginationSchema = z.object({
	page: z.number(),
	limit: z.number(),
	total: z.number(),
	totalPages: z.number()
})

export type GetOrdersType = z.infer<typeof GetOrdersSchema>
export const GetOrdersSchema = z.object({
	orders: z.array(OrderSchema),
	pagination: PaginationSchema
})