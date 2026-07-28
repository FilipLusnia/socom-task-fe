import { useRouter } from "next/router"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "../date-picker"
import { OrderStatusType } from "@/schema"

const statuses: OrderStatusType[] = [
	'NOWE',
	'OPŁACONE',
	'SPAKOWANE',
	'WYSŁANE',
	'DOSTARCZONE',
	'ZWROT',
	'ANULOWANE',
]

export default function OrdersFilters() {
	const router = useRouter()

	const updateFilter = (key: string, value: string | undefined) => {
		router.push({
			pathname: router.pathname,
			query: {
				...router.query,
				page: 1,
				[key]: value || undefined,
			},
		}, undefined, { shallow: true })
	}

	return (
		<div className="flex gap-8">
			<div>
				<small className="inline-block mb-1">Status</small>
				<Select
					value={String(router.query.status || 'Wszystkie')}
					onValueChange={value => updateFilter('status', value === 'Wszystkie' ? undefined : String(value))}
				>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Status" />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="Wszystkie">Wszystkie</SelectItem>
						{statuses.map(status =>
							<SelectItem key={status} value={status}>
								{status}
							</SelectItem>
						)}
					</SelectContent>
				</Select>
			</div>

			<DateRangePicker
				getDate={({ dateFrom, dateTo }) => {
					router.push({
						pathname: router.pathname,
						query: {
							...router.query,
							page: 1,
							dateFrom: dateFrom,
							dateTo: dateTo,
						},
					}, undefined, { shallow: true })
				}}
			/>
		</div>
	)
}