import { AdminSidebarLayout } from "@/components/AdminSidebarLayout";
import { Search, Filter } from "lucide-react";

export default function GalleryLoading() {
    return (
        <AdminSidebarLayout>
            <div className="space-y-6 max-w-7xl mx-auto w-full animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="h-9 w-64 bg-muted/50 rounded-md mb-2" />
                        <div className="h-5 w-80 bg-muted/50 rounded-md" />
                    </div>
                </div>

                {/* Filters & Search Skeleton */}
                <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                        <div className="w-full h-9 bg-muted/50 rounded-lg" />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-48">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                            <div className="w-full h-9 bg-muted/50 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Gallery Grid Skeleton - 8 Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-2xl overflow-hidden border bg-card shadow-sm flex flex-col">
                            <div className="relative aspect-[4/5] w-full bg-muted/50" />
                            <div className="p-4 flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-12 bg-muted/50 rounded" />
                                    <div className="h-4 w-10 bg-muted/50 rounded-full" />
                                </div>
                                <div className="h-3 w-16 bg-muted/50 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminSidebarLayout>
    );
}
