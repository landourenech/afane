import postgres from "postgres";

import {
  User,
  Product,
  Order,
  DashboardStats,
  RecentOrder,
  Farmer,
  Equipment,
} from "./definition";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

/* ========================================================= */
/* UTILITIES                                                  */
/* ========================================================= */

const ITEMS_PER_PAGE = 10;

/* ========================================================= */
/* DASHBOARD                                                  */
/* ========================================================= */

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      users,
      farmers,
      products,
      orders,
      revenue,
      pendingOrders,
    ] = await Promise.all([
      sql`SELECT COUNT(*) FROM users`,

      sql`
        SELECT COUNT(*)
        FROM users
        WHERE role = 'farmer'
      `,

      sql`
        SELECT COUNT(*)
        FROM products
        WHERE is_active = true
      `,

      sql`SELECT COUNT(*) FROM orders`,

      sql`
        SELECT COALESCE(SUM(total_amount), 0) AS total
        FROM orders
        WHERE status = 'completed'
      `,

      sql`
        SELECT COUNT(*)
        FROM orders
        WHERE status = 'pending'
      `,
    ]);

    return {
      users: Number(users[0].count ?? 0),
      farmers: Number(farmers[0].count ?? 0),
      products: Number(products[0].count ?? 0),
      orders: Number(orders[0].count ?? 0),
      revenue: Number(revenue[0].total ?? 0),
      pendingOrders: Number(pendingOrders[0].count ?? 0),
    };
  } catch (error) {
    console.error("Database Error:", error);

    throw new Error(
      "Impossible de récupérer les statistiques du dashboard."
    );
  }
}

/* ========================================================= */
/* USERS                                                       */
/* ========================================================= */

export async function fetchUsers() {
  try {
    const users = await sql<User[]>`
      SELECT
        id,
        name,
        email,
        phone,
        role,
        status,
        image_url,
        created_at
      FROM users
      ORDER BY created_at DESC
    `;

    return users;
  } catch (error) {
    console.error("Database Error:", error);

    throw new Error(
      "Impossible de récupérer les utilisateurs."
    );
  }
}

export async function fetchFilteredUsers(
  query: string,
  currentPage: number
) {
  const offset =
    (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const users = await sql<User[]>`
      SELECT
        id,
        name,
        email,
        phone,
        role,
        status,
        image_url,
        created_at
      FROM users
      WHERE
        name ILIKE ${`%${query}%`}
        OR email ILIKE ${`%${query}%`}
        OR phone ILIKE ${`%${query}%`}
        OR role ILIKE ${`%${query}%`}
      ORDER BY created_at DESC
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset}
    `;

    return users;
  } catch (error) {
    console.error("Database Error:", error);

    throw new Error(
      "Impossible de récupérer les utilisateurs."
    );
  }
}

export async function fetchUsersPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM users
      WHERE
        name ILIKE ${`%${query}%`}
        OR email ILIKE ${`%${query}%`}
        OR phone ILIKE ${`%${query}%`}
        OR role ILIKE ${`%${query}%`}
    `;

    return Math.ceil(
      Number(data[0].count) / ITEMS_PER_PAGE
    );
  } catch (error) {
    console.error("Database Error:", error);

    throw new Error(
      "Impossible de récupérer le nombre de pages."
    );
  }
}

/* ========================================================= */
/* FARMERS / PRODUCTEURS                                      */
/* ========================================================= */

export async function fetchFarmers() {
  try {
    const farmers = await sql<Farmer[]>`
      SELECT
        id,
        name,
        email,
        phone,
        location,
        farm_name,
        created_at
      FROM users
      WHERE role = 'farmer'
      ORDER BY name ASC
    `;

    return farmers;
  } catch (error) {
    console.error("Database Error:", error);

    throw new Error(
      "Impossible de récupérer les producteurs."
    );
  }
}

/* ========================================================= */
/* PRODUCTS                                                    */
/* ========================================================= */

export async function fetchProducts() {
  try {
    const products = await sql<Product[]>`
      SELECT
        products.id,
        products.farmer_id,
        products.name,
        products.description,
        products.price,
        products.quantity,
        products.unit,
        products.category,
        products.image_url,
        products.is_active,
        products.created_at,

        farmers.name AS farmer_name

      FROM products

      JOIN farmers
        ON products.farmer_id = farmers.id

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

export async function fetchFilteredProducts(
  query: string,
  currentPage: number
) {
  const offset =
    (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const products = await sql<Product[]>`
      SELECT
        products.id,
        products.farmer_id,
        products.name,
        products.description,
        products.price,
        products.quantity,
        products.unit,
        products.category,
        products.image_url,
        products.is_active,
        products.created_at,

        farmers.name AS farmer_name

      FROM products

      JOIN farmers
        ON products.farmer_id = farmers.id

      WHERE
        products.name ILIKE ${`%${query}%`}
        OR products.category ILIKE ${`%${query}%`}
        OR farmers.name ILIKE ${`%${query}%`}

      ORDER BY products.created_at DESC

      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset}
    `;

    return products;
  } catch (error) {
    console.error("Database Error:", error);

    throw new Error(
      "Impossible de récupérer les produits."
    );
  }
}

export async function fetchProductsPages(
  query: string
) {
  try {
    const data = await sql`
      SELECT COUNT(*)

      FROM products

      JOIN farmers
        ON products.farmer_id = farmers.id

      WHERE
        products.name ILIKE ${`%${query}%`}
        OR products.category ILIKE ${`%${query}%`}
        OR farmers.name ILIKE ${`%${query}%`}
    `;

    return Math.ceil(
      Number(data[0].count) / ITEMS_PER_PAGE
    );
  } catch (error) {
    console.error("Database Error:", error);

    throw new Error(
      "Impossible de compter les produits."
    );
  }
}

/* ========================================================= */
/* ORDERS                                                      */
/* ========================================================= */

export async function fetchOrders() {
  try {
    const orders = await sql<Order[]>`
      SELECT
        orders.id,
        orders.total_amount,
        orders.status,
        orders.payment_status,
        orders.created_at,

        users.name AS customer_name,
        users.email AS customer_email

      FROM orders

      JOIN users
        ON orders.customer_id = users.id

      ORDER BY orders.created_at DESC
    `;

    return orders;
  } catch (error) {
    console.error("Database Error:", error);

    throw new Error(
      "Impossible de récupérer les commandes."
    );
  }
}

export async function fetchFilteredOrders(
  query: string,
  currentPage: number
) {
  const offset =
    (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const orders = await sql<Order[]>`
      SELECT
        orders.id,
        orders.total_amount,
        orders.status,
        orders.payment_status,
        orders.created_at,

        users.name AS customer_name,
        users.email AS customer_email

      FROM orders

      JOIN users
        ON orders.customer_id = users.id

      WHERE
        users.name ILIKE ${`%${query}%`}
        OR users.email ILIKE ${`%${query}%`}
        OR orders.status ILIKE ${`%${query}%`}
        OR orders.payment_status ILIKE ${`%${query}%`}

      ORDER BY orders.created_at DESC

      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset}
    `;

    return orders;
  } catch (error) {
    console.error("Database Error:", error);

    throw new Error(
      "Impossible de récupérer les commandes."
    );
  }
}

/* ========================================================= */
/* RECENT ORDERS                                               */
/* ========================================================= */

export async function fetchRecentOrders() {
  try {
    const orders = await sql<RecentOrder[]>`
      SELECT
        orders.id,
        orders.total_amount,
        orders.status,
        orders.created_at,
        users.name AS customer_name,
        users.image_url AS customer_image

      FROM orders

      JOIN users
        ON orders.customer_id = users.id

      ORDER BY orders.created_at DESC

      LIMIT 5
    `;

    return orders;
  } catch (error) {
    console.error("Database Error:", error);

    throw new Error(
      "Impossible de récupérer les commandes récentes."
    );
  }
}

/* ========================================================= */
/* EQUIPMENTS                                                   */
/* ========================================================= */

export async function fetchEquipments() {
  try {
    const equipments = await sql<Equipment[]>`
      SELECT
        id,
        name,
        description,
        price,
        category,
        image_url,
        stock,
        is_active,
        created_at

      FROM equipments

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