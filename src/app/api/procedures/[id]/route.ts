import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const procedure = await prisma.procedure.findUnique({
            where: { id },
            include: {
                steps: true,
                requiredDocuments: true,
                officeLocations: true,
                commonMistakes: true,
                sourceLinks: true,
            }
        });

        if (!procedure) {
            return NextResponse.json({ error: 'Procedure not found' }, { status: 404 });
        }

        return NextResponse.json(procedure);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch procedure' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const json = await req.json();

        // Standard dynamic update for simplicity in MVP
        const procedure = await prisma.procedure.update({
            where: { id },
            data: {
                title: json.title,
                category: json.category,
                overview: json.overview,
                eligibility: json.eligibility,
                estimatedCost: json.estimatedCost,
                estimatedDuration: json.estimatedDuration,
                status: json.status,
                city: json.city,
            }
        });

        // Atomic update approach for nested relations (Delete then Re-create)
        // This is safe for MVP to avoid complex diffing logic

        if (json.steps) {
            await prisma.step.deleteMany({ where: { procedureId: id } });
            await prisma.step.createMany({
                data: json.steps.map((s: any, idx: number) => ({
                    procedureId: id,
                    title: s.title,
                    description: s.description,
                    order: idx + 1
                }))
            });
        }

        if (json.requiredDocuments) {
            await prisma.requiredDocument.deleteMany({ where: { procedureId: id } });
            await prisma.requiredDocument.createMany({
                data: json.requiredDocuments.map((d: any) => ({
                    procedureId: id,
                    name: d.name,
                    type: d.type,
                    count: parseInt(d.count) || 1,
                    notes: d.notes
                }))
            });
        }

        if (json.officeLocations) {
            await prisma.officeLocation.deleteMany({ where: { procedureId: id } });
            await prisma.officeLocation.createMany({
                data: json.officeLocations.map((l: any) => ({
                    procedureId: id,
                    name: l.name,
                    subCity: l.subCity,
                    woreda: l.woreda,
                    workingHours: l.workingHours || "8:30 AM - 5:30 PM",
                }))
            });
        }

        if (json.commonMistakes) {
            await prisma.commonMistake.deleteMany({ where: { procedureId: id } });
            await prisma.commonMistake.createMany({
                data: json.commonMistakes.map((m: any) => ({
                    procedureId: id,
                    description: m.description
                }))
            });
        }

        return NextResponse.json(procedure);
    } catch (error) {
        console.error("PATCH Error:", error);
        return NextResponse.json({ error: 'Failed to update procedure' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Relation cleanup
        await prisma.step.deleteMany({ where: { procedureId: id } });
        await prisma.requiredDocument.deleteMany({ where: { procedureId: id } });
        await prisma.commonMistake.deleteMany({ where: { procedureId: id } });
        await prisma.officeLocation.deleteMany({ where: { procedureId: id } });
        await prisma.sourceLink.deleteMany({ where: { procedureId: id } });

        await prisma.procedure.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: 'Failed to delete procedure' }, { status: 500 });
    }
}
