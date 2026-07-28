import { OrderStatusType } from "@/schema";
import type { ParsedUrlQuery } from "querystring"


// ORDERS
const ordersUrl = '/orders';

export const getOrders = (query: ParsedUrlQuery) => {
	const params = new URLSearchParams()

	Object.entries(query).forEach(([key, value]) => {
		if (Array.isArray(value)) {
			value.forEach(item => params.append(key, item))
		} else if (value) {
			params.set(key, String(value))
		}
	})
	
	return fetch(`
		${process.env.NEXT_PUBLIC_API_URL + ordersUrl}?${params}
	`, { 
		method: 'GET',
		headers: { 'content-type': 'application/json' } 
	})
}

export const getSingleOrder = ({ id }: { id: number }) => {
	return fetch(`${process.env.NEXT_PUBLIC_API_URL + ordersUrl}/${id}`, { 
		method: 'GET',
		headers: { 'content-type': 'application/json' } 
	})
}

export const changeOrderStatus = ({ id, status }: { id: number, status: OrderStatusType }) => {
	return fetch(`${process.env.NEXT_PUBLIC_API_URL + ordersUrl}/${id}/status`, { 
		method: 'PATCH',
		headers: { 'content-type': 'application/json' } ,
		body: JSON.stringify({ status })
	})
}

export const getOrderStats = () => {
	return fetch(`${process.env.NEXT_PUBLIC_API_URL + ordersUrl}/stats`, { 
		method: 'GET',
		headers: { 'content-type': 'application/json' } 
	})
}

export const postOrdersBulkStatus = (statusData: { orders: number[] }) => {
	return fetch(`${process.env.NEXT_PUBLIC_API_URL + ordersUrl}/bulk-status`, {
		headers: { 'content-type': 'application/json' },
		method: 'POST',
		body: JSON.stringify(statusData)
	})
}