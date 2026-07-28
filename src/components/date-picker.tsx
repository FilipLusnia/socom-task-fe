import { format } from "date-fns"
import { CalendarIcon, Redo2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const parseDate = (value: unknown) => {
	if (typeof value !== "string") return undefined

	const date = new Date(value)

	return Number.isNaN(date.getTime()) ? undefined : date
}

export function DateRangePicker({ getDate }: { getDate: (date: { dateFrom?: string, dateTo?: string }) => void }) {
	const router = useRouter()

	const [dateFrom, setDateFrom] = useState<Date>()
	const [dateTo, setDateTo] = useState<Date>()

	useEffect(() => {
		setDateFrom(parseDate(router.query.dateFrom))
		setDateTo(parseDate(router.query.dateTo))
	}, [router.query.dateFrom, router.query.dateTo])

	const updateFrom = (date?: Date) => {
		setDateFrom(date)
		getDate({
			dateFrom: date ? format(date, "yyyy-MM-dd") : undefined,
			dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
		})
	}

	const updateTo = (date?: Date) => {
		setDateTo(date)
		getDate({
			dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
			dateTo: date ? format(date, "yyyy-MM-dd") : undefined,
		})
	}

	return (
		<div className="flex items-center gap-2">
			<Popover>
				<PopoverTrigger className="flex h-9 w-36 items-center gap-2 rounded-md border px-3 text-sm">
					<CalendarIcon size={16} />
					{dateFrom ? format(dateFrom, "dd.MM.yyyy") : "Od daty"}
				</PopoverTrigger>

				<PopoverContent className="w-auto p-0">
					<Calendar mode="single" selected={dateFrom} onSelect={updateFrom} />
				</PopoverContent>
			</Popover>

			<span>-</span>

			<Popover>
				<PopoverTrigger className="flex h-9 w-36 items-center gap-2 rounded-md border px-3 text-sm">
					<CalendarIcon size={16} />
					{dateTo ? format(dateTo, "dd.MM.yyyy") : "Do daty"}
				</PopoverTrigger>

				<PopoverContent className="w-auto p-0">
					<Calendar mode="single" selected={dateTo} onSelect={updateTo} />
				</PopoverContent>
			</Popover>

			<Button
				size="icon"
				variant="secondary"
				onClick={() => {
					getDate({
						dateFrom: undefined,
						dateTo: undefined,
					})
				}}
			>
				<Redo2 />
			</Button>
		</div>
	)
}