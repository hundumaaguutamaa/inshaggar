const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || process.env.DATABASE_URL
        }
    }
});

async function main() {
    console.log('Cleaning up existing data...');
    await prisma.step.deleteMany();
    await prisma.requiredDocument.deleteMany();
    await prisma.commonMistake.deleteMany();
    await prisma.officeLocation.deleteMany();
    await prisma.sourceLink.deleteMany();
    await prisma.procedure.deleteMany();

    console.log('Seeding Ethiopian procedures...');

    // 1. Passport Application (New)
    const passport = await prisma.procedure.create({
        data: {
            title: 'Passport Application (New)',
            category: 'Identity & Travel',
            city: 'Addis Ababa',
            overview: 'The standard process for obtaining a new Ethiopian passport. Since 2023, most of the initial process is conducted online via the official immigration portal.',
            eligibility: 'Ethiopian citizens who do not currently hold a valid passport. For minors, parental consent and presence are required.',
            estimatedCost: '600 ETB (32 pages) / 2186 ETB (64 pages)',
            estimatedDuration: '2-4 Weeks',
            status: 'PUBLISHED',
            steps: {
                create: [
                    { title: 'Online Registration', description: 'Visit ethiopianpassportservices.gov.et and fill out the detailed application form.', order: 1 },
                    { title: 'Payment', description: 'Pay the fee through CBE Birr, Telebirr, or M-Pesa using the reference number provided.', order: 2 },
                    { title: 'Book Appointment', description: 'Choose a date and physical branch (e.g., Main Office near Churchill Road) for biometrics.', order: 3 },
                    { title: 'Physical Visit', description: 'Go to the office on your appointment day with printed forms and original Kebele ID.', order: 4 },
                ]
            },
            requiredDocuments: {
                create: [
                    { name: 'Kebele ID', type: 'Original + Copy', count: 1, notes: 'Must be valid and renewed' },
                    { name: 'Birth Certificate', type: 'Original + Copy', count: 1, notes: null },
                    { name: 'Digital Receipt', type: 'Printout', count: 1, notes: 'From the online payment' },
                ]
            },
            commonMistakes: {
                create: [
                    { description: 'Going to the office without an appointment.' },
                    { description: 'Using an expired Kebele ID for the biometrics phase.' },
                ]
            },
            officeLocations: {
                create: [
                    { name: 'Main Immigration Office', subCity: 'Kirkos', woreda: '08', mapLink: 'https://maps.google.com', workingHours: '8:00 AM - 5:00 PM' }
                ]
            },
            sourceLinks: {
                create: [
                    { title: 'Official Passport Portal', url: 'https://ethiopianpassportservices.gov.et' }
                ]
            }
        }
    });

    // 2. Lost Kebele ID Replacement (Enhanced per PRD)
    const kebeleId = await prisma.procedure.create({
        data: {
            title: 'Lost Kebele ID Replacement',
            category: 'Civil Status',
            city: 'Addis Ababa',
            overview: 'Replace your lost or stolen Kebele ID card. This process typically takes 3-14 days and must be done at your registered Woreda office. You will need a police report and passport photos.',
            eligibility: 'Ethiopian citizens registered in Addis Ababa kebeles who have lost their original ID card. Minors need parental presence.',
            estimatedCost: '50 - 150 ETB',
            estimatedDuration: '3 - 14 Days',
            status: 'PUBLISHED',
            steps: {
                create: [
                    { title: 'Report the Loss', description: 'Visit the nearest police station to report your lost ID. Bring any ID copy if available and personal details. You will receive a police loss letter.', order: 1 },
                    { title: 'Prepare Documents', description: 'Gather: Police loss letter, 2 passport photos, old ID copy (if any), and letter from kebele (if applicable).', order: 2 },
                    { title: 'Visit Kebele Office', description: 'Go to your registered Woreda office during office hours (8:00 AM - 5:00 PM). Best time is early morning. Expect to queue and have a brief interview.', order: 3 },
                    { title: 'Payment', description: 'Pay the replacement fee (50-150 ETB) at the designated payment window or via mobile money.', order: 4 },
                    { title: 'Follow-up & Collection', description: 'Return after 3-14 days to collect your new ID. Bring your receipt and any temporary document issued.', order: 5 },
                ]
            },
            requiredDocuments: {
                create: [
                    { name: 'Police Loss Letter', type: 'Original', count: 1, notes: 'Must be stamped and sealed by police station' },
                    { name: 'Passport Photos', type: 'Physical', count: 2, notes: 'White background, recent photos' },
                    { name: 'Old ID Copy', type: 'Copy', count: 1, notes: 'If available - helps with verification' },
                    { name: 'Personal Details', type: 'Information', count: 1, notes: 'Full name, house number, family details' },
                ]
            },
            commonMistakes: {
                create: [
                    { description: 'Going without police loss letter - this is mandatory' },
                    { description: 'Not bringing passport photos or bringing wrong background color' },
                    { description: 'Assuming rules are same for all kebeles - each may have variations' },
                    { description: 'Arriving late in the day when offices are busy or closing' },
                    { description: 'Going to wrong Woreda - must be where you are registered' },
                ]
            },
            officeLocations: {
                create: [
                    { name: 'Kirkos Sub-City Administration', subCity: 'Kirkos', woreda: 'Various', workingHours: '8:00 AM - 5:00 PM' },
                    { name: 'Bole Sub-City Administration', subCity: 'Bole', woreda: 'Various', workingHours: '8:00 AM - 5:00 PM' },
                ]
            },
            sourceLinks: {
                create: [
                    { title: 'Addis Ababa City Administration', url: 'https://addisababa.gov.et' }
                ]
            }
        }
    });

    // 3. Trade License Renewal
    const bizLicense = await prisma.procedure.create({
        data: {
            title: 'Trade License Renewal',
            category: 'Business',
            city: 'Addis Ababa',
            overview: 'Annual renewal of business trade licenses through the Ministry of Trade or Regional Bureaus.',
            eligibility: 'Sole proprietors or companies with an existing Ethiopian trade license.',
            estimatedCost: '500+ ETB (Varies by capital)',
            estimatedDuration: '1 Day',
            status: 'PUBLISHED',
            steps: {
                create: [
                    { title: 'Tax Clearance', description: 'Visit the Revenue Authority (Inland Revenue) to get a tax clearance certificate for the physical year.', order: 1 },
                    { title: 'Application', description: 'Submit the renewal form at the Trade Bureau desk.', order: 2 },
                    { title: 'Fee Payment', description: 'Pay the renewal fee at the designated bank or via Telebirr.', order: 3 },
                ]
            },
            requiredDocuments: {
                create: [
                    { name: 'Original Trade License', type: 'Original', count: 1, notes: null },
                    { name: 'Tax Clearance Certificate', type: 'Original', count: 1, notes: 'Most critical document' },
                    { name: 'Rent Contract', type: 'Copy', count: 1, notes: 'Must be authenticated by the house registry' },
                ]
            }
        }
    });

    console.log(`Successfully seeded ${[passport, kebeleId, bizLicense].length} procedures.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
