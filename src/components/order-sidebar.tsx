import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import { getSingleOrder } from "@/lib/endpoints"
import { handleApiResponse } from "@/lib/helpers"
import { OrderSchema } from "@/schema"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "./ui/skeleton"
import { format } from "date-fns"

export function OrderSidebar({ orderId, open, onClose }: {
	orderId: number | null
	open: boolean
	onClose: () => void
}) {
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

					<div className="space-y-1">
						<p className="font-semibold">Status</p>
						{isLoading && <Skeleton className="h-6 w-full mt-2" />}
						<p>{data?.status}</p>
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
						<p className="font-semibold">Historia statusów</p>
						{data?.orderHistory?.slice().reverse().map((entry, index) => (
							<div key={index} className="border-l-2 pl-3">
								<p className="font-medium">{entry.to}</p>

								<p className="text-sm text-muted-foreground">
									{format(new Date(entry.createdAt), "dd.MM.yyyy HH:mm")}
								</p>

								{entry.from && 
									<p className="text-xs text-muted-foreground">z {entry.from}</p>
								}
							</div>
						))}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}