import { AppSidebar } from "@/components/layout/app-sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

// footer implementation is pending, will be added in future iterations when needed. For now, we focus on the main layout with navbar and sidebar.

export default function CommonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <SidebarProvider>
                <div className="flex flex-1">
                    <AppSidebar />
                    <main className="flex-1 p-4">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </div>
    );
}