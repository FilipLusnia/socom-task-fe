import { AppProps } from "next/app"

declare global {
    interface Window {}
}

export type CustomAppProps = {
	Component: AppProps['Component']
}