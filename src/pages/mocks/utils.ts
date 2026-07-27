import { delay, HttpResponse } from 'msw'

export async function simulateNetwork() {
	await delay(50 + Math.random() * 500)

	if (Math.random() < 0.05) {
		return HttpResponse.json(
			{ message: 'Internal Server Error' },
			{ status: 500 },
		)
	}

	return null
}