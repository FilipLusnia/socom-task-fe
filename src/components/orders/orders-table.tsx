import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { OrderType } from '@/schema';
import { useRouter } from 'next/router';
import { format } from 'date-fns';

export default function OrdersTable({ orders, isLoading, sortFunc }: { 
	orders: OrderType[] | undefined 
	isLoading: boolean 
	sortFunc: (sortBy: 'createdAt' | 'total') => void
}) {
	const router = useRouter()

	return (
		<Table className="mt-8">
			<TableHeader>
				<TableRow>
					<TableHead>Numer zamówienia</TableHead>
					<TableHead className="cursor-pointer text-blue-500 hover:opacity-50" onClick={() => sortFunc("createdAt")}>
						<div className="flex gap-2">
							<span>Data utworzenia</span>
							<span>{router.query.sortBy === 'createdAt' && (router.query.sortOrder === 'desc' ? '↑' : '↓')}</span>
						</div>
					</TableHead>
					<TableHead className="cursor-pointer text-blue-500 hover:opacity-50" onClick={() => sortFunc("total")}>
						<div className="flex gap-2">
							<span>Kwota</span>
							<span>{router.query.sortBy === 'total' && (router.query.sortOrder === 'desc' ? '↑' : '↓')}</span>
						</div>
					</TableHead>
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
								<TableCell className="font-semibold">
									<Skeleton className="h-8 w-full" />
								</TableCell>
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
								{format(order.createdAt, 'yyyy-MM-dd')}
							</TableCell>
							<TableCell>
								{order.total}zł
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