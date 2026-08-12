import postgres from "postgres";

import {
  Product,
  Equipment,
} from "./definition";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

// ============================================================
// PRODUCTS
// ============================================================

export async function fetchProducts(): Promise<Product[]> {
  try {
    const products = await sql<Product[]>`
      SELECT
        products.id,
        products.name,
        products.description,
        products.price,
        products.quantity,
        products.unit,
        products.category,
        products.image_url,
        products.is_active,
        products.created_at,
        products.farmer_id,
        farmers.name AS farmer_name

      FROM products

      JOIN farmers
        ON products.farmer_id = farmers.id

      WHERE products.is_active = true

      ORDER BY products.created_at DESC
    `;

    return products;
  } catch (error) {
    console.error("Database Error:", error);

    throw new Error(
      "Impossible de récupérer les produits."
    );
  }
}

// ============================================================
// EQUIPMENTS
// ============================================================

export async function fetchEquipments(): Promise<Equipment[]> {
  try {
    const equipments = await sql<Equipment[]>`
      SELECT
        id,
        name,
        description,
        price,
        category,
        stock,
        image_url,
        is_active,
        created_at

      FROM equipments

      WHERE is_active = true

      ORDER BY created_at DESC
    `;

    return equipments;
  } catch (error) {
    console.error("Database Error:", error);

    throw new Error(
      "Impossible de récupérer les équipements."
    );
  }
}

// ============================================================
// SHOP
// ============================================================

export async function fetchShopData(): Promise<{
  products: Product[];
  equipments: Equipment[];
}> {
  try {
    const [products, equipments] = await Promise.all([
      fetchProducts(),
      fetchEquipments(),
    ]);

    return {
      products,
      equipments,
    };
  } catch (error) {
    console.error("Database Error:", error);

    throw new Error(
      "Impossible de récupérer les produits et les équipements."
    );
  }
}