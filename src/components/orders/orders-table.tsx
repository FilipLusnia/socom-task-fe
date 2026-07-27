import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { OrderType } from '@/schema';

export default function OrdersTable({ orders, isLoading }: { orders: OrderType[] | undefined, isLoading: boolean }) {
	return (
		<Table className="mt-8">
			<TableHeader>
				<TableRow>
					<TableHead>Numer zamówienia</TableHead>
					<TableHead>Zamawiający</TableHead>
					<TableHead>Status</TableHead>
					<TableHead className="text-right min-w-30">Akcje</TableHead>
				</TableRow>
			</TableHeader>
			{isLoading ?
				<TableBody>
					{Array.from({ length: 10 })
						.map((_, i) => 
							<TableRow key={i}>
								<TableCell className="font-semibold">
									<Skeleton className="h-8 w-full" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-8 w-full" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-8 w-full" />
								</TableCell>
								<TableCell className="text-right">
									<Skeleton className="h-8 w-full" />
								</TableCell>
							</TableRow>
						)
					}
				</TableBody>
			:
				<TableBody>
					{orders?.map(order => 
						<TableRow key={order.id}>
							<TableCell className="font-semibold">
								{order.number}
							</TableCell>
							<TableCell>
								{order.customer.email}
							</TableCell>
							<TableCell>
								{order.status}
							</TableCell>
							<TableCell className="text-right">
								<Button>S</Button>
								<Link href={`/order/${order.id}`}>
									<Button>Z</Button>
								</Link>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			}
		</Table>
    )
}