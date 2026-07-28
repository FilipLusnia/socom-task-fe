import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

export default function DebouncedInput({ 
	debouncedFunction, 
	delay = 1000, 
	loading, 
	placeholder,
	value,
	setValue
}: {
	debouncedFunction: (value: string | undefined) => void
	delay?: number
	loading: boolean
	placeholder?: string
	value: string | undefined
	setValue: Dispatch<SetStateAction<string | undefined>>
}) {
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		const handler = setTimeout(() => debouncedFunction(value), delay);
		return () => clearTimeout(handler);
	}, [value]);

	return (
		<div className="flex items-center gap-2">
			<Input 
				placeholder={placeholder} 
				value={value} 
				onChange={e => setValue(e.target.value)} 
				className={loading ? 'animate-pulse' : ''}
			/>
			{!!value?.length &&
				<Button onClick={() => setValue('')}><X/></Button>
			}
		</div>
	);
}