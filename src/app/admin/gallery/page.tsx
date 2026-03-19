import { AdminSidebarLayout } from "@/components/AdminSidebarLayout";
import { db } from "@/server/db";
import { GalleryClient } from "./GalleryClient";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const generations = await db.generation.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, plan: true, email: true },
      },
    },
  });

  // Serialize dates to strings for client component
  const serialized = generations.map((g) => ({
    id: g.id,
    imageUrl: g.imageUrl,
    originalUrl: g.originalUrl,
    prompt: g.prompt,
    status: g.status,
    quality: g.quality,
    createdAt: g.createdAt.toISOString(),
    user: g.user,
  }));

  return (
    <AdminSidebarLayout>
      <GalleryClient generations={serialized} />
    </AdminSidebarLayout>
  );
}
