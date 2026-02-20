import { Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarWrapper } from "@/components/layout/AppSidebarWrapper";

// footer implementation is pending, will be added in future iterations when needed. For now, we focus on the main layout with navbar and sidebar.

export default function CommonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            
            <SidebarProvider>
                <div className="flex flex-1">
                    <Suspense fallback={<div className="w-64 shrink-0" />}>
                        <AppSidebarWrapper />
                    </Suspense>
                    <main className="flex-1 min-w-0 p-4">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </div>
    );
}