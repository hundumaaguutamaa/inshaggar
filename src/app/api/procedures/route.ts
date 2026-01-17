import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const json = await req.json();

        // Ensure we create a clean procedure with all relations
        const procedure = await prisma.procedure.create({
            data: {
                title: json.title,
                category: json.category,
                overview: json.overview,
                eligibility: json.eligibility,
                city: json.city || 'Addis Ababa',
                estimatedCost: json.estimatedCost || 'TBD',
                estimatedDuration: json.estimatedDuration || 'TBD',
                status: json.status || 'DRAFT',
                steps: {
                    create: json.steps?.map((s: any, idx: number) => ({
                        title: s.title,
                        description: s.description,
                        order: idx + 1
                    })) || []
                },
                requiredDocuments: {
                    create: json.requiredDocuments?.map((d: any) => ({
                        name: d.name,
                        type: d.type,
                        count: parseInt(d.count) || 1,
                        notes: d.notes
                    })) || []
                },
                officeLocations: {
                    create: json.officeLocations?.map((l: any) => ({
                        name: l.name,
                        subCity: l.subCity,
                        woreda: l.woreda,
                        workingHours: l.workingHours || "8:30 AM - 5:30 PM",
                    })) || []
                },
                commonMistakes: {
                    create: json.commonMistakes?.map((m: any) => ({
                        description: m.description
                    })) || []
                }
            }
        });

        return NextResponse.json(procedure);
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: 'Failed to create procedure' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const procedures = await prisma.procedure.findMany({
            orderBy: { lastUpdated: 'desc' }
        });
        return NextResponse.json(procedures);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch procedures' }, { status: 500 });
    }
}
