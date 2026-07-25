import { useEffect, useState } from "react";
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export default function ThemeSwitch() {
	const [ hasMounted, setHasMounted ] = useState(false)
	const { theme, setTheme } = useTheme()

	useEffect(() => setHasMounted(true), [])

	return hasMounted ?
		<button 
			onClick={() => setTheme( theme === 'light' ? 'dark' : 'light')} 
			className="inline-flex items-center justify-center transition hover:bg-foreground/10 rounded-full p-2"
			aria-label="theme"
		>
			{theme === 'dark' ?  <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
		</button>
	:
		<></>
}