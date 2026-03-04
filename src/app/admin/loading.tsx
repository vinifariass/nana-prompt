import { AdminSidebarLayout } from "@/components/AdminSidebarLayout";
import { Loader2 } from "lucide-react";

export default function AdminLoading() {
    return (
        <AdminSidebarLayout>
            <div className="w-full min-h-[calc(100vh-4rem)] p-4 md:p-8 bg-[#0a0a0f] text-white flex flex-col">

                {/* Actions Row Skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-40 bg-white/5 animate-pulse rounded-md" />
                        <div className="h-9 w-48 bg-white/5 animate-pulse rounded-md hidden sm:block" />
                    </div>
                    <div className="h-9 w-36 bg-white/5 animate-pulse rounded-md" />
                </div>

                {/* Loading Indicator Centered */}
                <div className="flex-1 flex flex-col items-center justify-center opacity-50">
                    <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-[var(--brand)] animate-spin mb-4" />
                    <p className="text-sm text-white/60 animate-pulse font-medium">Carregando painel...</p>
                </div>
            </div>
        </AdminSidebarLayout>
    );
}
