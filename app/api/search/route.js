import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.trim() === "") {
    return Response.json({ results: [] });
  }

  try {
    const medicines = await prisma.medicine.findMany({
      where: {
        Medicine_name: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        stocks: {
          select: { quantity: true },
        },
      },
    });

    const results = medicines.map((med) => ({
      id: med.Medicine_ID,
      name: med.Medicine_name,
      price: `₹${med.Price.toFixed(2)}`,
      stock: med.stocks.reduce((acc, s) => acc + s.quantity, 0),
    }));

    return Response.json({ results });
  } catch (error) {
    console.error("Search API error:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
