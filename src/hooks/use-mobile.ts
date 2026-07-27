import { MOBILE_WIDTH } from "@/lib/constants"
import { useEffect, useState } from "react"

export function useIsMobile() {
	const [ isMobile, setIsMobile ] = useState<boolean | undefined>(undefined)

	useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_WIDTH - 1}px)`)
		const onChange = () => setIsMobile(window.innerWidth < MOBILE_WIDTH)

		mql.addEventListener("change", onChange)
		setIsMobile(window.innerWidth < MOBILE_WIDTH)
		return () => mql.removeEventListener("change", onChange)
	}, [])

	return !!isMobile
}
