import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cousinesService } from "@/services/cuisines.service";

// footer implementation is pending, will be added in future iterations when needed. For now, we focus on the main layout with navbar and sidebar.

export default async function CommonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cuisinesResult = await cousinesService.getAllCousines();
    const cuisines = cuisinesResult?.data ?? [];

    return (
        <div className="flex min-h-screen flex-col">
            
            <SidebarProvider>
                <div className="flex flex-1">
                    <AppSidebar cuisines={cuisines} />
                    <main className="flex-1 min-w-0 p-4">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </div>
    );
}