import { OrderStatusSchema } from "@/schema";
import { z } from "zod";


// ORDERS
const ordersUrl = '/orders';

export const getOrders = ({ page, limit = 20, status, search }: { 
	page: number
	limit?: number
	status?: z.infer<typeof OrderStatusSchema>
	search?: string
}) => {
	return fetch(`
		${process.env.NEXT_PUBLIC_API_URL + ordersUrl}?
		page=${page}
		&limit=${limit}
		${status ? ('&status=' + encodeURIComponent(status)) : ''}
		${search ? ('&search=' + encodeURIComponent(search)) : ''}
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

export const changeOrderStatus = ({ id, status }: { id: number, status: z.infer<typeof OrderStatusSchema> }) => {
	return fetch(`${process.env.NEXT_PUBLIC_API_URL + ordersUrl}/${id}`, { 
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

// export const postOrdersBulkStatus = (statusData: z.infer<ReturnType<typeof mockSchema>>) => {
// 	return fetch(`${process.env.NEXT_PUBLIC_API_URL + ordersUrl}/bulk-status`, {
// 		headers: { 'content-type': 'application/json' },
// 		method: 'POST',
// 		body: JSON.stringify(statusData)
// 	})
// }