import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ServerError() {
	return (
		<section>
			<div className="text-center">
				<h1 className="text-accent text-7xl">500</h1>
				<h1 className="mt-8">Błąd</h1>
				<p className="mt-4">Wystąpił błąd po stronie serwera</p>
				<Link href='/'>
					<Button className="mt-12">Powrót</Button>
				</Link>
			</div>
		</section>
	)
}