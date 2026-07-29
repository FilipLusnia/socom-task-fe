import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getOrders, postOrdersBulkStatus } from "@/lib/endpoints"
import { handleApiResponse } from "@/lib/helpers"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { BulkStatusResponseSchema, GetOrdersSchema, OrderStatusType } from "@/schema"
import OrdersTable from "@/components/orders/orders-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import DebouncedInput from "@/components/debounced-input"
import PaginationLimit from "@/components/orders/orders-pagination-limit"
import OrdersFilters from "@/components/orders/orders-filters"
import { OrderSidebar } from "@/components/orders/order-sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { statuses } from "@/lib/constants"

export default function Dashboard() {
	const router = useRouter()
	const queryClient = useQueryClient()
	const query = router.query

	const [ pageInput, setPageInput ] = useState(String(query.page))
	const [search, setSearch] = useState(
		typeof query.search === 'string' ? query.search : ''
	)

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ['orders', query],
		queryFn: () => 
			getOrders(query)
			.then(resp => handleApiResponse({ resp }))
			.then(data => GetOrdersSchema.parse(data)),
	})
	const [ selectedOrder, setSelectedOrder ] = useState<number | null>(null)
	const [ selectedOrders, setSelectedOrders ] = useState<number[]>([])

	const hasFilters = Boolean(
		query.search ||
		(Array.isArray(query.status) ? query.status.length : query.status) ||
		query.dateFrom ||
		query.dateTo
	)

	const changePage = (page: number) => {
		router.push(
			{
				pathname: router.pathname,
				query: { ...router.query, page }
			},
			undefined,
			{ shallow: true }
		)

		window.scrollTo(0, 0)
	}

	const searchFunc = (value?: string) => {
		if (router.query.search === value) return

		const q = {
			...router.query,
			page: 1,
			search: value?.length ? value : undefined
		}

		router.push(
			{ pathname: router.pathname, query: q },
			undefined,
			{ shallow: true }
		)
	}

	const sortFunc = (sortBy: 'createdAt' | 'total') => {
		const currentSortOrder = router.query.sortOrder

		router.push(
			{
				pathname: router.pathname,
				query: {
					...router.query,
					page: 1,
					sortBy,
					sortOrder: currentSortOrder === 'desc' ? 'asc' : 'desc',
				},
			},
			undefined,
			{ shallow: true }
		)
	}

	const checkOrder = (id: number) => {
		setSelectedOrders(prev =>
			prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
		)
	}

	const bulkStatusMutation = useMutation({
		mutationFn: ({ ids, status }: { ids: number[], status: OrderStatusType }) =>
			postOrdersBulkStatus({ ids, status })
				.then(resp => handleApiResponse({ resp }))
				.then(data => BulkStatusResponseSchema.parse(data))
		,

		onSuccess: result => {
			queryClient.invalidateQueries({ queryKey: ["orders"] })
			setSelectedOrders([])

			if (result.failed.length) {
				toast.warning(
					`Zmieniono ${result.success.length} z ${result.success.length + result.failed.length} zamówień`,
					{ description: result.failed[0].reason }
				)

				return
			}

			toast.success(
				`Zmieniono ${result.success.length} zamówień`
			)
		}
	})

	useEffect(() => {
		if (!data) return

		if ((Number(query.page) > data.pagination.totalPages) && data.pagination.totalPages) {
			router.replace({
				query: { ...router.query, page: data.pagination.totalPages },
			}, 
			undefined, 
			{ shallow: true })

			setPageInput(String(data.pagination.totalPages))
		} else {
			setPageInput(String(query.page))
		}
	}, [data, query.page])

	useEffect(() => {
		setSearch(typeof query.search === 'string' ? query.search : '')
	}, [query.search])

	useEffect(() => {
		if (error?.cause === 500) {
			toast.error('Błąd', {
				description: error?.message,
				action: { label: 'Ponów', onClick: () => refetch()}
			})
		} else if (error){
			toast.error('Błąd', {
				description: error?.message
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
				<>
					<div className="mt-4">
						<DebouncedInput
							value={search}
							setValue={setSearch}
							loading={isLoading}
							placeholder="Numer zamówienia lub e-mail"
							debouncedFunction={value => searchFunc(value)}
						/>
						<div className="mt-4 overflow-x-auto">
							<OrdersFilters/>
						</div>
						{!!selectedOrders.length &&
							<div className="flex items-center gap-4 mt-4 bg-blue-500/10 rounded-2xl px-4 py-2">
								<small>Zaznaczono: {selectedOrders.length}</small>

								<Select
									disabled={bulkStatusMutation.isPending}
									onValueChange={status =>
										bulkStatusMutation.mutate({
											ids: selectedOrders,
											status: status as OrderStatusType,
										})
									}
								>
									<SelectTrigger className="w-48">
										<SelectValue placeholder="Zmień status" />
									</SelectTrigger>

									<SelectContent>
										{statuses.map(status => (
											<SelectItem key={status} value={status}>{status}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						}
					</div>
					{(!data?.orders.length && !isLoading) ?
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
						<div className="flex flex-col items-center gap-4">
							<OrdersTable 
								orders={data?.orders} 
								isLoading={isLoading} 
								sortFunc={sortFunc}
								setSelectedOrder={setSelectedOrder}
								selectedOrders={selectedOrders}
								checkOrder={checkOrder}
								setSelectedOrders={setSelectedOrders}
							/>

							{(data && query.page) &&
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious 
												onClick={() => {
													if (query && (Number(query.page) > 1)) {
														changePage(Number(query.page) - 1)
													}
												}}
												className={Number(query.page) < 2 ? 'pointer-events-none opacity-25' : ''}
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
													if (query && (Number(query.page) < data.pagination.totalPages)) {
														changePage(Number(query.page) + 1)
													}
												}}
												className={Number(query.page) >= data.pagination.totalPages ? 'pointer-events-none opacity-25' : ''}
											></PaginationNext>
										</PaginationItem>
									</PaginationContent>
								</Pagination>

							}

							<div className="mt-4">
								<PaginationLimit/>
							</div>
						</div>
					}
				</>
			}

			<OrderSidebar
				orderId={selectedOrder}
				open={!!selectedOrder}
				onClose={() => setSelectedOrder(null)} 
			/>
		</section>
	)
}