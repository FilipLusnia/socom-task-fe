import Head from 'next/head';
import { CustomAppProps } from '@/types';
import Layout from '@/components/layout';
import localFont from 'next/font/local';
import { ThemeProvider } from "next-themes"

import '@/styles/globals.css';

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
	return(
		<>
			<Head>
				<title>SoCom Task FE</title>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
			<ThemeProvider
				attribute="class"
				defaultTheme='system'
			>
				<main className={RalewayFont.className}>
					<Layout>
						<Component/>
					</Layout>
				</main>
			</ThemeProvider>
		</>
	)
}
export default App;
