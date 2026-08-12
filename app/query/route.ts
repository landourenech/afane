import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

async function listProducts() {
  const data = await sql`
    SELECT
      products.id,
      products.name,
      products.price,
      products.quantity,
      products.unit,
      products.category,
      products.is_active,
      farmers.name AS farmer_name
    FROM products
    JOIN farmers
      ON products.farmer_id = farmers.id
    ORDER BY products.created_at DESC;
  `;

  return data;
}

export async function GET() {
  try {
    const products = await listProducts();

    return Response.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Database error:", error);

    return Response.json(
      {
        success: false,
        error: "Impossible de récupérer les produits.",
      },
      {
        status: 500,
      },
    );
  }
}
