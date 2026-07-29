import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import { getSingleOrder, changeOrderStatus } from "@/lib/endpoints"
import { handleApiResponse } from "@/lib/helpers"
import { GetOrdersType, OrderSchema, OrderStatusType, OrderType } from "@/schema"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Skeleton } from "../ui/skeleton"
import { format } from "date-fns"
import { toast } from "sonner"
import { ORDER_TRANSITIONS } from "@/lib/helpers"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export function OrderSidebar({ orderId, open, onClose }: {
	orderId: number | null
	open: boolean
	onClose: () => void
}) {
	const queryClient = useQueryClient()
	const { data, isLoading } = useQuery({
		queryKey: ["order", orderId],
		queryFn: () => {
			if (orderId === null)  throw new Error("Missing order id")

			return getSingleOrder({ id: orderId })
				.then(resp => handleApiResponse({ resp }))
				.then(data => OrderSchema.parse(data))
		},
		enabled: orderId !== null,
	})
	const availableStatuses = data ? ORDER_TRANSITIONS[data.status] : []

	const statusMutation = useMutation({
		mutationFn: (status: OrderStatusType) =>
			changeOrderStatus({ id: orderId!, status })
				.then(resp => handleApiResponse({ resp }))
				.then(data => OrderSchema.parse(data)),

		onMutate: async newStatus => {
			await queryClient.cancelQueries({ queryKey: ["order", orderId] })
			await queryClient.cancelQueries({ queryKey: ["orders"] })

			const previousOrder = queryClient.getQueryData<OrderType>(["order", orderId])
			const previousOrders = queryClient.getQueriesData({ queryKey: ["orders"] })

			queryClient.setQueryData<OrderType>(["order", orderId], old => {
				if (!old) return old
				return { ...old, status: newStatus }
			})

			queryClient.setQueriesData({ queryKey: ["orders"] }, (old: GetOrdersType) => {
				if (!old) return old

				return { ...old, orders: old.orders.map(order =>
					order.id === orderId ? { ...order, status: newStatus } : order
				)}
			})

			return { previousOrder, previousOrders }
		},

		onSuccess: updatedOrder => {
			queryClient.setQueryData(["order", orderId], updatedOrder)

			queryClient.setQueriesData({ queryKey: ["orders"] }, (old: GetOrdersType) => {
				if (!old) return old

				return { ...old,
					orders: old.orders.map(order =>
						order.id === updatedOrder.id ? { ...order, status: updatedOrder.status } : order
				)}
			})

			toast.success("Status zamówienia został zmieniony")
		},

		onError: (error, _, context) => {
			if (context?.previousOrder) {
				queryClient.setQueryData(["order", orderId], context.previousOrder)
			}

			context?.previousOrders.forEach(([key, data]) => {
				queryClient.setQueryData(key, data)
			})

			toast.error("Nie udało się zmienić statusu", {
				description: error.message,
			})
		},
	})

	return (
		<Sheet open={open} onOpenChange={value => !value && onClose()}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>
						{isLoading && <Skeleton className="h-6 w-1/2" />}
						{data?.number}
					</SheetTitle>
				</SheetHeader>

				<div className="space-y-4 mt-4">
					<div className="space-y-1">
						<p className="font-semibold">Klient</p>
						{isLoading && <Skeleton className="h-6 w-full mt-2" />}
						<p>{data?.customer.name}</p>
						<p>{data?.customer.email}</p>
					</div>

					<div className="border rounded-2xl p-4 bg-muted">
						<div className="space-y-1">
							<p className="font-semibold">Status</p>
							{isLoading && <Skeleton className="h-6 w-full mt-2" />}
							<p className="text-muted-foreground">{data?.status}</p>
						</div>

						{!!availableStatuses.length && 
							<div className="mt-4">
								<p className="font-semibold mb-2">Zmień status</p>

								<Select
									disabled={statusMutation.isPending}
									onValueChange={(value: OrderStatusType | null) =>
										value && statusMutation.mutate(value)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Wybierz status" />
									</SelectTrigger>

									<SelectContent side="top">
										{availableStatuses.map(status => 
											<SelectItem key={status} value={status}>{status}</SelectItem>
										)}
									</SelectContent>
								</Select>
							</div>
						}
					</div>

					<div className="space-y-1">
						<p className="font-semibold">Kwota</p>
						{isLoading && <Skeleton className="h-6 w-full mt-2" />}
						<p>{data && `${data.total} zł`}</p>
					</div>

					<div className="space-y-1">
						<p className="font-semibold">Pozycje</p>
						{data?.items?.map(item => (
							<div key={item.id} className="flex justify-between gap-2 text-sm space-y-1">
								<div>
									<p>{item.name}</p>
									<p className="text-muted-foreground">{item.quantity} x {item.price.toFixed(2)} zł</p>
								</div>

								<p>{(item.quantity * item.price).toFixed(2)} zł</p>
							</div>
						))}
					</div>

					<div className="space-y-1">
						<p className="font-semibold">Historia zmian</p>
						{data?.orderHistory?.slice().reverse().map((entry, index) => (
							<div key={index} className="border-l-2 pl-3">
								<p className="font-medium">{entry.to}</p>

								<p className="text-sm text-muted-foreground">
									{format(new Date(entry.createdAt), "dd.MM.yyyy HH:mm")}
								</p>

								{entry.from && 
									<p className="text-xs text-muted-foreground">z {entry.from}</p>
								}

								{entry.user && 
									<p className="text-xs text-muted-foreground">{entry.user}</p>
								}

								{entry.reason && 
									<p className="text-xs text-muted-foreground">Powód: {entry.reason}</p>
								}
							</div>
						))}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}