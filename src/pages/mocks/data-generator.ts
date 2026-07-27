import { OrderType } from '@/schema'
import { faker } from '@faker-js/faker'
import { format } from 'date-fns'

faker.seed(123)

export const orders: OrderType[] = Array.from({ length: 5000 }, (_, i) => {
	const date = faker.date.recent({ days: 90 }).toISOString()
	const year = format(date, 'y')
	const month = format(date, 'MM')

	return {
		id: i + 1,
		number: `Z-${year}-${month}-00${i + 1}`,
		customer: {
			name: faker.person.fullName(),
			email: `klient${i + 1}@example.com`,
		},
		status: faker.helpers.weightedArrayElement([
			{ weight: 25, value: "NOWE" },
			{ weight: 25, value: "OPŁACONE" },
			{ weight: 15, value: "SPAKOWANE" },
			{ weight: 15, value: "WYSŁANE" },
			{ weight: 10, value: "DOSTARCZONE" },
			{ weight: 5, value: "ZWROT" },
			{ weight: 5, value: "ANULOWANE" },
		]),
		total: faker.number.float({ min: 20, max: 100, fractionDigits: 2 }),
		createdAt: date,
	}
})