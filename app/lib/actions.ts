"use server";

import postgres from "postgres";
import { revalidatePath } from "next/cache";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

/* =========================================================
   UTILISATEURS
   ========================================================= */

export async function updateUser(
  id: string,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  if (!id || !name || !email || !role) {
    throw new Error("Informations utilisateur incomplètes.");
  }

  try {
    await sql`
      UPDATE users
      SET
        name = ${name},
        email = ${email},
        role = ${role}
      WHERE id = ${id}
    `;

    revalidatePath("/dashboard/users");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Impossible de modifier l'utilisateur.");
  }
}


export async function deleteUser(id: string) {
  if (!id) {
    throw new Error("Utilisateur introuvable.");
  }

  try {
    await sql`
      DELETE FROM users
      WHERE id = ${id}
    `;

    revalidatePath("/dashboard/users");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Impossible de supprimer l'utilisateur.");
  }
}


/* =========================================================
   PRODUITS AGRICOLES
   ========================================================= */

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const category = formData.get("category") as string;
  const quantity = formData.get("quantity") as string;
  const sellerId = formData.get("sellerId") as string;

  if (!name || !price || !category || !quantity || !sellerId) {
    throw new Error("Informations produit incomplètes.");
  }

  try {
    await sql`
      INSERT INTO products (
        name,
        description,
        price,
        category,
        quantity,
        seller_id
      )
      VALUES (
        ${name},
        ${description},
        ${Number(price)},
        ${category},
        ${Number(quantity)},
        ${sellerId}
      )
    `;

    revalidatePath("/dashboard/products");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Impossible de créer le produit.");
  }
}


export async function updateProduct(
  id: string,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const category = formData.get("category") as string;
  const quantity = formData.get("quantity") as string;

  if (!id || !name || !price || !category || !quantity) {
    throw new Error("Informations produit incomplètes.");
  }

  try {
    await sql`
      UPDATE products
      SET
        name = ${name},
        description = ${description},
        price = ${Number(price)},
        category = ${category},
        quantity = ${Number(quantity)}
      WHERE id = ${id}
    `;

    revalidatePath("/dashboard/products");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Impossible de modifier le produit.");
  }
}


export async function deleteProduct(id: string) {
  if (!id) {
    throw new Error("Produit introuvable.");
  }

  try {
    await sql`
      DELETE FROM products
      WHERE id = ${id}
    `;

    revalidatePath("/dashboard/products");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Impossible de supprimer le produit.");
  }
}


/* =========================================================
   COMMANDES
   ========================================================= */

export async function createOrder(formData: FormData) {
  const buyerId = formData.get("buyerId") as string;
  const productId = formData.get("productId") as string;
  const quantity = formData.get("quantity") as string;

  if (!buyerId || !productId || !quantity) {
    throw new Error("Informations commande incomplètes.");
  }

  try {
    await sql`
      INSERT INTO orders (
        buyer_id,
        product_id,
        quantity,
        status,
        created_at
      )
      VALUES (
        ${buyerId},
        ${productId},
        ${Number(quantity)},
        'pending',
        NOW()
      )
    `;

    revalidatePath("/dashboard/orders");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Impossible de créer la commande.");
  }
}


export async function updateOrderStatus(
  id: string,
  status: string
) {
  if (!id || !status) {
    throw new Error("Commande invalide.");
  }

  try {
    await sql`
      UPDATE orders
      SET status = ${status}
      WHERE id = ${id}
    `;

    revalidatePath("/dashboard/orders");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Impossible de modifier la commande.");
  }
}


export async function deleteOrder(id: string) {
  if (!id) {
    throw new Error("Commande introuvable.");
  }

  try {
    await sql`
      DELETE FROM orders
      WHERE id = ${id}
    `;

    revalidatePath("/dashboard/orders");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Impossible de supprimer la commande.");
  }
}


/* =========================================================
   SEMENCES
   ========================================================= */

export async function createSeed(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const quantity = formData.get("quantity") as string;
  const sellerId = formData.get("sellerId") as string;

  if (!name || !price || !quantity || !sellerId) {
    throw new Error("Informations semence incomplètes.");
  }

  try {
    await sql`
      INSERT INTO seeds (
        name,
        description,
        price,
        quantity,
        seller_id
      )
      VALUES (
        ${name},
        ${description},
        ${Number(price)},
        ${Number(quantity)},
        ${sellerId}
      )
    `;

    revalidatePath("/dashboard/seeds");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Impossible de créer la semence.");
  }
}


export async function deleteSeed(id: string) {
  if (!id) {
    throw new Error("Semence introuvable.");
  }

  try {
    await sql`
      DELETE FROM seeds
      WHERE id = ${id}
    `;

    revalidatePath("/dashboard/seeds");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Impossible de supprimer la semence.");
  }
}


/* =========================================================
   ÉQUIPEMENTS AGRICOLES
   ========================================================= */

export async function createEquipment(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const quantity = formData.get("quantity") as string;
  const sellerId = formData.get("sellerId") as string;

  if (!name || !price || !quantity || !sellerId) {
    throw new Error("Informations équipement incomplètes.");
  }

  try {
    await sql`
      INSERT INTO equipment (
        name,
        description,
        price,
        quantity,
        seller_id
      )
      VALUES (
        ${name},
        ${description},
        ${Number(price)},
        ${Number(quantity)},
        ${sellerId}
      )
    `;

    revalidatePath("/dashboard/equipment");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Impossible de créer l'équipement.");
  }
}


export async function deleteEquipment(id: string) {
  if (!id) {
    throw new Error("Équipement introuvable.");
  }

  try {
    await sql`
      DELETE FROM equipment
      WHERE id = ${id}
    `;

    revalidatePath("/dashboard/equipment");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Impossible de supprimer l'équipement.");
  }
}


/* =========================================================
   CONSEILS AGRICOLES
   ========================================================= */

export async function createAdvice(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const authorId = formData.get("authorId") as string;

  if (!title || !content || !authorId) {
    throw new Error("Informations du conseil incomplètes.");
  }

  try {
    await sql`
      INSERT INTO agricultural_advice (
        title,
        content,
        author_id,
        created_at
      )
      VALUES (
        ${title},
        ${content},
        ${authorId},
        NOW()
      )
    `;

    revalidatePath("/dashboard/advice");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Impossible de créer le conseil.");
  }
}


export async function deleteAdvice(id: string) {
  if (!id) {
    throw new Error("Conseil introuvable.");
  }

  try {
    await sql`
      DELETE FROM agricultural_advice
      WHERE id = ${id}
    `;

    revalidatePath("/dashboard/advice");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Impossible de supprimer le conseil.");
  }
}

