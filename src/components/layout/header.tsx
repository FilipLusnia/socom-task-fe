import { useIsMobile } from "@/lib/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerFooter, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"

export default function Header() {
	const isMobile = useIsMobile()

	return (
		<header className="fixed top-0 z-50 w-full bg-background/90 flex justify-center backdrop-blur-xs">
			<div className={`border-b border-foreground/5 w-full px-4 max-w-7xl`}>
				<div className="h-(--header-height) flex items-center justify-between">
					<div className="flex items-center">
						<div className='mr-12'>
							SoCom Task
						</div>
					</div>

					<div className="flex items-center justify-between gap-6 md:justify-end">
						{/* <ThemeSwitch /> */}

						{isMobile &&
							<Drawer>
								<DrawerTrigger className="flex" aria-label='menu'>
									<div className="inline-flex md:hidden transition hover:opacity-75">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7!"><path strokeLinecap="round" d="M3.75 9h16.5m-16.5 6.75h16.5"></path></svg>
									</div>
								</DrawerTrigger>
								<DrawerContent>
									<DrawerTitle className="flex justify-center mt-8 px-4">
										SoCom Task
									</DrawerTitle>
									<DrawerFooter>

									</DrawerFooter>
								</DrawerContent>
							</Drawer>
						}
					</div>
				</div>
			</div>
		</header>
	)
}