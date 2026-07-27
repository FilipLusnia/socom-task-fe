import { z } from "zod"
import { DEFAULT_PAGE_SIZE } from "./lib/constants"

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

export type OrdersQueryType = z.infer<typeof OrdersQuerySchema>
export const OrdersQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).default(DEFAULT_PAGE_SIZE),
	search: z.string().default(''),
	status: z.array(OrderStatusSchema).default([]),
	dateFrom: z.iso.date().optional(),
	dateTo: z.iso.date().optional(),
})

export type GetOrdersType = z.infer<typeof GetOrdersSchema>
export const GetOrdersSchema = z.object({
	orders: z.array(OrderSchema),
	pagination: PaginationSchema
})