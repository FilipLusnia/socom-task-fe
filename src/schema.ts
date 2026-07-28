import { z } from "zod"

export type OrderStatusType = z.infer<typeof OrderStatusSchema>
export const OrderStatusSchema = z.enum([
	'NOWE', 'OPŁACONE', 'SPAKOWANE', 'WYSŁANE', 'DOSTARCZONE', 'ZWROT', 'ANULOWANE'
])

export const CustomerSchema = z.object({
	name: z.string(),
	email: z.email(),
})

export const OrderItemSchema = z.object({
	id: z.number(),
	name: z.string(),
	quantity: z.number(),
	price: z.number(),
})

export const OrderHistorySchema = z.object({
	from: OrderStatusSchema.nullable(),
	to: OrderStatusSchema,
	createdAt: z.iso.datetime(),
})

export type OrderType = z.infer<typeof OrderSchema>
export const OrderSchema = z.object({
	id: z.number(),
	number: z.string(),
	customer: CustomerSchema,
	status: OrderStatusSchema,
	items: z.array(OrderItemSchema).optional(),
	orderHistory: z.array(OrderHistorySchema).optional(),
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