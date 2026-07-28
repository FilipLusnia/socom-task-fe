import { OrderStatusType } from "@/schema"

export const MOBILE_WIDTH = 768
export const TABLET_WIDTH = 1024

export const PAGE_SIZES = [ 10, 20, 50, 100 ]
export const DEFAULT_PAGE_SIZE = 20

export const statuses: OrderStatusType[] = [
	'NOWE',
	'OPŁACONE',
	'SPAKOWANE',
	'WYSŁANE',
	'DOSTARCZONE',
	'ZWROT',
	'ANULOWANE',
]