import { AdminSidebarLayout } from "@/components/AdminSidebarLayout";
import { Search } from "lucide-react";

export default function UsersLoading() {
    return (
        <AdminSidebarLayout>
            <div className="space-y-6 max-w-7xl mx-auto w-full animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="h-9 w-64 bg-muted/50 rounded-md mb-2" />
                        <div className="h-5 w-80 bg-muted/50 rounded-md" />
                    </div>
                </div>

                {/* Toolbar Skeleton */}
                <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                        <div className="w-full h-9 bg-muted/50 rounded-lg" />
                    </div>
                </div>

                {/* Table Skeleton */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4 font-medium"><div className="h-4 w-20 bg-muted/80 rounded" /></th>
                                    <th className="px-6 py-4 font-medium"><div className="h-4 w-16 bg-muted/80 rounded" /></th>
                                    <th className="px-6 py-4 font-medium"><div className="h-4 w-24 bg-muted/80 rounded" /></th>
                                    <th className="px-6 py-4 font-medium"><div className="h-4 w-16 bg-muted/80 rounded" /></th>
                                    <th className="px-6 py-4 font-medium"><div className="h-4 w-12 bg-muted/80 rounded float-right" /></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-muted/50" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-32 bg-muted/50 rounded" />
                                                    <div className="h-3 w-40 bg-muted/50 rounded" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-5 w-16 bg-muted/50 rounded-md" />
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-8 bg-muted/50 rounded" />
                                                <div className="h-3 w-12 bg-muted/50 rounded" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-6 w-16 bg-muted/50 rounded-md" />
                                        </td>
                                        <td className="px-6 py-4 flex justify-end gap-2">
                                            <div className="h-8 w-8 bg-muted/50 rounded" />
                                            <div className="h-8 w-8 bg-muted/50 rounded" />
                                            <div className="h-8 w-8 bg-muted/50 rounded" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminSidebarLayout>
    );
}
