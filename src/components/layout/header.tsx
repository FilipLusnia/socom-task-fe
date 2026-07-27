import ThemeSwitch from "../theme-switch";

export default function Header() {

	return (
		<header className="fixed top-0 z-50 w-full bg-background/90 flex justify-center backdrop-blur-xs">
			<div className={`border-b border-foreground/5 w-full px-4 max-w-7xl`}>
				<div className="h-(--header-height) flex items-center justify-between">
					<div className="flex items-center">
						<div className='mr-12'>
							SoCom Task
						</div>
					</div>

					<div>
						<ThemeSwitch/>
					</div>
				</div>
			</div>
		</header>
	)
}