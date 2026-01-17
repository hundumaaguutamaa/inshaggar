import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Add feedback model to schema later, for now we'll log and simulate
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            procedureId,
            helpful,
            completed,
            city,
            extraDocuments,
            visits,
            unclear,
            timestamp
        } = body;

        // For now, we'll log the feedback (in production, save to database)
        console.log('Feedback received:', {
            procedureId,
            helpful,
            completed,
            city,
            extraDocuments,
            visits,
            unclear,
            timestamp
        });

        // TODO: Save to database when feedback model is added
        // const feedback = await prisma.feedback.create({
        //     data: {
        //         procedureId,
        //         helpful,
        //         completed,
        //         city,
        //         extraDocuments,
        //         visits,
        //         unclear,
        //         createdAt: new Date(timestamp)
        //     }
        // });

        return NextResponse.json({ 
            success: true, 
            message: 'Feedback received successfully' 
        });

    } catch (error) {
        console.error('Error saving feedback:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to save feedback' },
            { status: 500 }
        );
    }
}