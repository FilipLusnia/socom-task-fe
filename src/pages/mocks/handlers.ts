import { http, HttpResponse } from 'msw'
import { orders } from './data-generator'
import { simulateNetwork } from './utils'
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from '@/lib/constants'
import { OrderStatusType } from '@/schema'
import { endOfDay, isAfter, isBefore, parseISO, startOfDay } from "date-fns"

export const handlers = [
	http.get('/api/orders', async ({ request }) => {
		const error = await simulateNetwork()

		if (error) return error

		const url = new URL(request.url)

		const page = Number(url.searchParams.get('page') || 1)
		if (!Number.isInteger(page) || (page < 1)) {
			return HttpResponse.json(
				{ message: 'Bład walidacji parametru page' },
				{ status: 400 }
			)
		} 

		const limit = Number(url.searchParams.get('limit') || DEFAULT_PAGE_SIZE)
		if (!PAGE_SIZES.includes(limit)) {
			return HttpResponse.json(
				{ message: 'Błędna wartość parametru limit' },
				{ status: 400 }
			)
		}

		let filteredOrders = [ ...orders ]

		const search = url.searchParams.get("search")?.trim().toLowerCase()
		if (search) {
			filteredOrders = filteredOrders.filter(order =>
				order.number.toLowerCase().includes(search) ||
				order.customer.email.toLowerCase().includes(search)
			)
		}

		const statuses = url.searchParams.getAll("status")

		if (statuses.length) {
			filteredOrders = filteredOrders.filter(order =>
				statuses.includes(order.status)
			)
		}

		const dateFrom = url.searchParams.get("dateFrom")
		const dateTo = url.searchParams.get("dateTo")

		if (dateFrom) {
			const from = startOfDay(parseISO(dateFrom))

			filteredOrders = filteredOrders.filter(order =>
				!isBefore(parseISO(order.createdAt), from)
			)
		}

		if (dateTo) {
			const to = endOfDay(parseISO(dateTo))

			filteredOrders = filteredOrders.filter(order =>
				!isAfter(parseISO(order.createdAt), to)
			)
		}

		const start = (page - 1) * limit
		const end = start + limit

		return HttpResponse.json({
			orders: filteredOrders.slice(start, end),
			pagination: {
				page,
				limit,
				total: orders.length,
				totalPages: Math.ceil(orders.length / limit),
			},
		})
	}),

	http.get('/api/orders/:id', async ({ params }) => {
		const order = orders.find(o => o.id === Number(params.id))

		if (!order) {
			return HttpResponse.json(
				{ message: "Zamówienie nie istnieje" },
				{ status: 404 }
			)
		}

		return HttpResponse.json({
			...order,
			items: [],
			statusHistory: [],
		})
	}),

	http.patch('/api/orders/:id/status', async ({ params, request }) => {
		const error = await simulateNetwork()

		if (error) return error

		const body = await request.json() as { status: OrderStatusType }
		const order = orders.find(o => o.id === Number(params.id))

		if (!order) {
			return HttpResponse.json(
				{ message: "Zamówienie nie istnieje" },
				{ status: 404 }
			)
		}

		order.status = body.status

		return HttpResponse.json(order)
	}),

	http.post('/api/orders/bulk-status', async () => {
		const error = await simulateNetwork()

		if (error) return error

		return HttpResponse.json({
			success: [1, 2, 3],
			failed: [
				{
					id: 4,
					reason: 'blad',
				},
			],
		})
	}),

	http.get('/api/orders/stats', async () => {
		const error = await simulateNetwork()

		if (error) return error

		return HttpResponse.json({
			statuses: {
				NOWE: 12,
				OPŁACONE: 34,
				SPAKOWANE: 28,
				WYSŁANE: 41,
				DOSTARCZONE: 362,
				ZWROT: 14,
				ANULOWANE: 9,
			},
			revenue30Days: 152430.12,
		})
	}),
]