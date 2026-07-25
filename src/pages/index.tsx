import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { handleApiResponse, handleZodError } from "@/lib/helpers";
import z from "zod";
import { useState } from "react";
import { MockSchema } from "@/schema";
import { getOrders } from "@/lib/endpoints";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	
	// const mockResp: z.infer<ReturnType<typeof MockSchema>> =
	// 	await getOrders({ page: 1, limit: 30 })
	// 	.then(resp => handleApiResponse({ resp }))

	// if (mockResp.mock) {
	// 	const parsedData = MockSchema().safeParse(mockResp)
	// 	handleZodError(parsedData.error)
	// }

	return { 
		props: { 
			// mockResp
		} 
	}
}

export default function Home({  }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	// const [ mockData, setMockData ] = useState<
	// 	z.infer<ReturnType<typeof MockSchema>> | null
	// >(mockResp)

	return (
		<></>
	)
}
