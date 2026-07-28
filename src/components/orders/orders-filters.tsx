import { useRouter } from "next/router"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DateRangePicker } from "../date-picker"
import { OrderStatusType } from "@/schema"
import { Button } from "../ui/button"
import { Redo2 } from "lucide-react"
import { statuses } from "@/lib/constants"

export default function OrdersFilters() {
	const router = useRouter()

	const selectedStatuses = Array.isArray(router.query.status) ?
		router.query.status 
	: 
		router.query.status ? [router.query.status] : []

	const toggleStatus = (status: OrderStatusType, checked: boolean) => {
		const next = checked ? [...selectedStatuses, status] : selectedStatuses.filter(item => item !== status)

		router.push({
			pathname: router.pathname,
			query: { ...router.query, page: 1, status: next.length ? next : undefined },
		}, 
		undefined, 
		{ shallow: true })
	}

	const resetStatuses = () => {
		router.push({
			pathname: router.pathname,
			query: { ...router.query, page: 1, status: undefined },
		}, 
		undefined, 
		{ shallow: true })
	}

	return (
		<div className="flex gap-8">
			<div>
				<small className="inline-block mb-1">Status</small>

				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger className="flex h-8 w-40 items-center justify-between rounded-md border px-3 text-sm">
							{selectedStatuses.length ? `${selectedStatuses.length} wybrane` : "Wszystkie"}
						</DropdownMenuTrigger>

						<DropdownMenuContent className="w-40">
							{statuses.map(status => (
								<DropdownMenuCheckboxItem
									key={status}
									checked={selectedStatuses.includes(status)}
									onCheckedChange={checked => toggleStatus(status, checked)}
								>
									{status}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{!!selectedStatuses.length &&
						<Button variant="outline" size="icon" onClick={resetStatuses}>
							<Redo2 />
						</Button>
					}
				</div>
			</div>

			<DateRangePicker
				getDate={({ dateFrom, dateTo }) => {
					router.push({
						pathname: router.pathname,
						query: { ...router.query, page: 1, dateFrom, dateTo },
					}, 
					undefined, 
					{ shallow: true })
				}}
			/>
		</div>
	)
}