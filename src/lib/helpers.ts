import { toast } from "sonner"
import { z } from "zod"

export const handleApiResponse = async ({ resp }: { resp: Response }) => {
	const response = await resp.json()

	if (!resp.ok) {
		throw new Error(response.message ?? 'Unknown error', {
			cause: resp.status,
		})
	}

	return response
}

export const handleZodError = (err?: z.ZodError) => {
	if (err) {
		const msg = `Zod Error "${err.issues[0].code}" at path "${err.issues[0].path}": ${err.issues[0].message}`
		toast.error('Błąd', {
			description: msg,
		})
	}
}