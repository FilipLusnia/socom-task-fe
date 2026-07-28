import { OrderType } from '@/schema'
import { faker } from '@faker-js/faker'
import { format } from 'date-fns'

faker.seed(123)

export const orders: OrderType[] = Array.from({ length: 5000 }, (_, i) => {
	const date = faker.date.recent({ days: 90 }).toISOString()

	const status = faker.helpers.weightedArrayElement([
		{ weight: 25, value: "NOWE" },
		{ weight: 25, value: "OPŁACONE" },
		{ weight: 15, value: "SPAKOWANE" },
		{ weight: 15, value: "WYSŁANE" },
		{ weight: 10, value: "DOSTARCZONE" },
		{ weight: 5, value: "ZWROT" },
		{ weight: 5, value: "ANULOWANE" },
	])

	const year = format(date, 'y')
	const month = format(date, 'MM')

	const items = Array.from(
		{ length: faker.number.int({ min: 1, max: 5 }) },
		(_, index) => ({
			id: index + 1,
			name: faker.commerce.productName(),
			quantity: faker.number.int({ min: 1, max: 3 }),
			price: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }),
		})
	)

	const total = Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2))

	return {
		id: i + 1,
		number: `Z-${year}-${month}-00${i + 1}`,
		items,
		total,
		customer: {
			name: faker.person.fullName(),
			email: `klient${i + 1}@example.com`,
		},
		status,
		orderHistory: [
			...(status !== "NOWE" ? 
				[{
					id: 2,
					from: "NOWE" as const,
					to: status,
					createdAt: faker.date.recent({ days: 10 }).toISOString(),
					user: faker.person.fullName(),
					reason: null
				}] 
			: 
				[]),
		],
		createdAt: date,
	}
})