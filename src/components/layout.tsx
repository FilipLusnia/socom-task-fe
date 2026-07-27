import { Toaster } from './ui/sonner';
import Header from './layout/header';
import Footer from './layout/footer';
import { AppSidebar } from "./layout/sidebar";
import {
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar";

export default function Layout({ children }: React.PropsWithChildren<{ children: { props?: any } }>) {
	return (
		<> 
			<Header/>
			<SidebarProvider open={false}>
				<AppSidebar />
				<SidebarInset>
					<div className='flex flex-col items-center pt-[calc(var(--header-height))] min-h-[calc(100vh-theme(spacing.4))]'>
						{children}
					</div>
				</SidebarInset>
			</SidebarProvider>
			<Footer/>
			<div className='fixed z-51'>
				<Toaster position="bottom-center" richColors closeButton/>
			</div>
		</>
    )
}