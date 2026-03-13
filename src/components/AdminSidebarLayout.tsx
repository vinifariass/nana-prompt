"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Images, Upload, Settings, LogOut, LayoutDashboard, Users, CreditCard } from "lucide-react";
import { useSession } from "next-auth/react";

import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/animate-ui/components/radix/sidebar";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

const NAV_ITEMS = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Galeria", href: "/admin/gallery", icon: Images },
    { title: "Upload", href: "/upload", icon: Upload },
    { title: "Usuários", href: "/admin/users", icon: Users },
    { title: "Faturamento", href: "/admin/billing", icon: CreditCard },
    { title: "Configurações", href: "/admin/settings", icon: Settings },
];

function getBreadcrumbTitle(pathname: string) {
    const match = NAV_ITEMS.find((item) => item.href === pathname);
    return match?.title ?? "Admin";
}

export const AdminSidebarLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const { data: session } = useSession();

    const user = {
        name: session?.user?.name || "Usuário",
        email: session?.user?.email || "",
        avatar: session?.user?.image || "",
    };

    return (
        <SidebarProvider>
            <Sidebar variant="inset" collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/admin">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                        <Camera className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">FotoPro AI</span>
                                        <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {NAV_ITEMS.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={pathname === item.href}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className="size-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>Site Público</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip="Voltar ao site">
                                        <Link href="/">
                                            <LogOut className="size-4" />
                                            <span>Voltar ao site</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" tooltip={user.name}>
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="rounded-lg">
                                        {user.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user.name}</span>
                                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="Sair">
                                <Link href="/login">
                                    <LogOut className="size-4" />
                                    <span>Sair</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/admin">Admin Panel</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{getBreadcrumbTitle(pathname)}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 lg:p-8 bg-background">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};
