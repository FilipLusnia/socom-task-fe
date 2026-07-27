import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

export default function DebouncedInput({ 
	debouncedFunction, 
	delay = 500, 
	loading, 
	placeholder,
	value,
	setValue
}: {
	debouncedFunction: (value: string) => void
	delay?: number
	loading: boolean
	placeholder?: string
	value: string
	setValue: Dispatch<SetStateAction<string>>
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
			{!!value.length &&
				<Button onClick={() => setValue('')}><X/></Button>
			}
		</div>
	);
}