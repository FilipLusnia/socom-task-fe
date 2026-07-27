import { useQuery } from "@tanstack/react-query"
import { getOrders } from "@/lib/endpoints"
import { handleApiResponse } from "@/lib/helpers"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { GetOrdersSchema, OrdersQuerySchema } from "@/schema"
import OrdersTable from "@/components/orders/orders-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
	const router = useRouter()
	const query = OrdersQuerySchema.parse(router.query)
	const [ pageInput, setPageInput ] = useState(String(query.page))

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ['orders', query],
		queryFn: () => 
			getOrders(query)
			.then(resp => handleApiResponse({ resp }))
			.then(data => GetOrdersSchema.parse(data)),
	})

	const hasFilters = query && (
		query.search.length > 0 ||
		query.status.length > 0 ||
		!!query.dateFrom ||
		!!query.dateTo
	)

	const changePage = (page: number) => {
		setPageInput(String(page))
		router.push(
			{
				pathname: router.pathname,
				query: { ...router.query, page }
			},
			undefined,
			{ shallow: true }
		)
	}

	useEffect(() => {
		if (!data) return

		if ((query.page > data.pagination.totalPages) && data.pagination.totalPages) {
			router.replace({
				query: {
					...router.query,
					page: data.pagination.totalPages,
				},
			}, undefined, { shallow: true })
			setPageInput(String(data.pagination.totalPages))
		}
	}, [data, query.page])

	useEffect(() => {
		if (error) {
			toast.error('Błąd', {
				description: 'Nie udało się pobrać listy zamówień.',
				action: { label: 'Ponów', onClick: () => refetch()}
			})
		}
	}, [error, refetch])

	return (
		<section>
			<h1 className="text-2xl font-semibold">Zamówienia</h1>

			{error ? 
				<div className="rounded-lg border p-8 flex flex-col items-center gap-4 mt-8">
					<h2 className="font-medium">Nie udało się pobrać listy zamówień.</h2>
					<Button onClick={() => refetch()}>Ponów</Button>
				</div>
			:
				(!data?.orders.length && !isLoading) ?
					<div className="rounded-lg border p-8 text-center mt-8">
						{hasFilters ? 
							<>
								<h2 className="font-medium">Brak wyników dla tych filtrów</h2>
								<p className="mt-2 text-sm text-muted-foreground">Spróbuj zmienić kryteria wyszukiwania lub wyczyścić filtry.</p>
							</>
						:
							<>
								<h2 className="font-medium">Brak zamówień</h2>
								<p className="mt-2 text-sm text-muted-foreground">Nie znaleziono jeszcze żadnych zamówień.</p>
							</>
						}
					</div>
				:
					<>
						<OrdersTable orders={data?.orders} isLoading={isLoading}/>
						{data &&
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious 
											onClick={() => {
												if (query && (query.page > 1)) {
													changePage(query.page - 1)
												}
											}}
											className={query.page < 2 ? 'pointer-events-none opacity-25' : ''}
										></PaginationPrevious>
									</PaginationItem>

									<PaginationItem>
										<Input
											className='w-16 text-center'
											type="number"
											value={pageInput}
											onChange={e => setPageInput(e.target.value)}
											onKeyDown={e => {
												if (e.key !== "Enter") return
												
												const page = Number(pageInput)
												if (Number.isInteger(page) && (page >= 1) && (page <= data.pagination.totalPages)) {
													changePage(page)
												}
											}}
										/>
									</PaginationItem>

									<PaginationItem>
										<span className='px-2 text-sm text-muted-foreground'>
											/ {data.pagination.totalPages}
										</span>
									</PaginationItem>

									<PaginationItem>
										<PaginationNext 
											onClick={() => {
												if (query && (query.page < data.pagination.totalPages)) {
													changePage(query.page + 1)
												}
											}}
											className={query.page >= data.pagination.totalPages ? 'pointer-events-none opacity-25' : ''}
										></PaginationNext>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						}
					</>
			}
		</section>
	)
}