import Head from 'next/head';
import { CustomAppProps } from '@/types'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Layout from '@/components/layout';
import localFont from 'next/font/local';
import { ThemeProvider } from "next-themes"

import '@/styles/globals.css';
import { useEffect, useState } from 'react';

const RalewayFont = localFont({
	src: [
		{
			path: '../fonts/Raleway-Regular.woff2',
			weight: '400'
		},
		{
			path: '../fonts/Raleway-Medium.woff2',
			weight: '500'
		},
		{
			path: '../fonts/Raleway-SemiBold.woff2',
			weight: '600'
		},
		{
			path: '../fonts/Raleway-Bold.woff2',
			weight: '700'
		}
	]
})

function App({ Component }: CustomAppProps) {
	const [ queryClient ] = useState(() => new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				refetchOnWindowFocus: false,
			}
		}
	}))
	const [ mswReady, setMswReady ] = useState(false)

	// na potrzeby zadania
	useEffect(() => {
		import('@/pages/mocks/browser').then(({ worker }) => {
			worker.start({
				onUnhandledRequest: 'bypass',
			}).then(() => setMswReady(true))
		})
	}, [])

	if (!mswReady) return null

	return(
		<>
			<Head>
				<title>SoCom Task FE</title>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
			<ThemeProvider
				attribute="class"
				defaultTheme='light'
			>
				<main className={RalewayFont.className}>
					<QueryClientProvider client={queryClient}>
						<Layout>
							<Component/>
						</Layout>
					</QueryClientProvider>
				</main>
			</ThemeProvider>
		</>
	)
}
export default App;
