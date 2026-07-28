import { useRouter } from "next/router"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from "@/lib/constants"

export default function PaginationLimit() {
	const router = useRouter()
	const value = Number(router.query.limit || DEFAULT_PAGE_SIZE)

	const changeLimit = (val: string | null) => {
		if (!val) return

		router.push({
			pathname: router.pathname,
			query: {
				...router.query,
				page: 1,
				limit: Number(val),
			},
		}, 
		undefined, 
		{ shallow: true })
	}

	return (
		<div className="flex flex-col items-center gap-2">
			<small>Ilość zamówień na stronę</small>
			<Select value={String(value)} onValueChange={changeLimit}>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>

				<SelectContent>
					{PAGE_SIZES.map(size =>
						<SelectItem key={size} value={String(size)}>{size}</SelectItem>
					)}
				</SelectContent>
			</Select>
		</div>
	)
}