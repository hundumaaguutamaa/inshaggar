import { prisma } from "@/lib/db";
import HomeClient from "@/components/HomeClient";

export const dynamic = 'force-dynamic';

async function getPopularProcedures() {
  try {
    const procedures = await prisma.procedure.findMany({
      where: {
        status: 'PUBLISHED'
      },
      take: 6,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        category: true,
        overview: true,
        estimatedCost: true,
        estimatedDuration: true
      }
    });
    return procedures;
  } catch (error) {
    console.error("Failed to fetch popular procedures:", error);
    return [];
  }
}

export default async function Home() {
  const procedures = await getPopularProcedures();

  return <HomeClient initialProcedures={procedures} />;
}
