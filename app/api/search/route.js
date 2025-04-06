import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.trim() || '';

    console.log('Searching for:', query);

    let medicines;

    if (!query) {
      // No search query: return a default list
      medicines = await prisma.medicine.findMany({ take: 20 });
    } else {
      // Prisma doesn't support mode: 'insensitive' for your version
      // So we do a case-insensitive match manually using raw query
      medicines = await prisma.medicine.findMany({
        where: {
          Medicine_name: {
            contains: query, // Case-sensitive match
          },
        },
      });

      // Filter case-insensitively in JS
      medicines = medicines.filter(med =>
        med.Medicine_name.toLowerCase().includes(query.toLowerCase())
      );
    }

    const results = medicines.map((med) => ({
      id: med.Medicine_ID,
      name: med.Medicine_name,
      price: `$${med.Price.toFixed(2)}`,
    }));

    return NextResponse.json({ results });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search medicines: ' + error.message },
      { status: 500 }
    );
  }
}
