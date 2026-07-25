import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { Redo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useRef, useState } from "react"

export function MonthYearPicker({ getDate }: { getDate: (date: Date) => void }) {
	const now = new Date()
	const months = Array.from({ length: 12 }, (_, i) => format(new Date(2020, i, 1), 'LLLL', { locale: pl }))
	const years = Array.from({ length: 20 }, (_, i) => now.getFullYear() - 10 + i)
	const isFirstRender = useRef(true);

	const [ month, setMonth ] = useState(now.getMonth())
	const [ year, setYear ] = useState(now.getFullYear())

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		
		getDate(new Date(year, month, 1))
	}, [month, year])

	return (
		<div className="flex items-center gap-2">
			<Select
				value={month.toString()}
				onValueChange={v => setMonth(Number(v))}
			>
				<SelectTrigger className="w-32">
					<SelectValue />
				</SelectTrigger>
				<SelectContent className='max-h-50'>
					{months.map((m, i) => (
						<SelectItem key={i} value={i.toString()}>{m}</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={year.toString()}
				onValueChange={v => setYear(Number(v))}
			>
				<SelectTrigger className="w-20">
					<SelectValue />
				</SelectTrigger>
				<SelectContent className='max-h-50'>
					{years.map((y) => (
						<SelectItem key={y} value={y.toString()}>{y}</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Button 
				size='icon' 
				variant='secondary'
				onClick={() => {
					setMonth(now.getMonth())
					setYear(now.getFullYear())
				}}
			>
				<Redo2/>
			</Button>
		</div>
	)
}