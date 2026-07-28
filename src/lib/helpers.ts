import { toast } from "sonner"
import { z } from "zod"
import { OrderStatusType } from "@/schema"

export const handleApiResponse = async ({ resp }: { resp: Response }) => {
	const response = await resp.json()

	if (!resp.ok) {
		throw new Error(response.message ?? 'Unknown error', {
			cause: resp.status,
		})
	}

	return response
}

export const handleZodError = (err?: z.ZodError) => {
	if (err) {
		const msg = `Zod Error "${err.issues[0].code}" at path "${err.issues[0].path}": ${err.issues[0].message}`
		toast.error('Błąd', {
			description: msg,
		})
	}
}

export const ORDER_TRANSITIONS: Record<OrderStatusType, OrderStatusType[]> = {
	NOWE: ["OPŁACONE", "ANULOWANE"],
	OPŁACONE: ["SPAKOWANE", "ANULOWANE"],
	SPAKOWANE: ["WYSŁANE"],
	WYSŁANE: ["DOSTARCZONE"],
	DOSTARCZONE: ["ZWROT"],
	ZWROT: [],
	ANULOWANE: [],
}

export function canChangeStatus(from: OrderStatusType, to: OrderStatusType) {
	return ORDER_TRANSITIONS[from].includes(to)
}