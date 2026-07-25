import { useEffect, useState } from "react"
import { MOBILE_WIDTH } from "@/lib/constants"

export function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const onChange = () => setIsMobile(window.innerWidth < MOBILE_WIDTH)
		onChange()

		window.addEventListener("resize", onChange)
		return () => window.removeEventListener("resize", onChange)
	}, [])

	return isMobile
}