import bcrypt from "bcrypt";
import postgres from "postgres";

import {
  users,
  farmers,
  farms,
  products,
  orders,
  equipments,
  agriculturalAdvice,
  groupPurchases,
  collaborativeSales,
  notifications,
  revenue,
} from "../lib/placeholder-data";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

/* ========================================================= */
/* USERS                                                       */
/* ========================================================= */

async function seedUsers() {
  await sql`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(30),
      password TEXT,
      role VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      image_url TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(
      "123456",
      10,
    );

    await sql`
      INSERT INTO users (
        id,
        name,
        email,
        phone,
        password,
        role,
        status,
        image_url,
        created_at
      )
      VALUES (
        ${user.id},
        ${user.name},
        ${user.email},
        ${user.phone},
        ${hashedPassword},
        ${user.role},
        ${user.status},
        ${user.image_url},
        ${user.created_at}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

/* ========================================================= */
/* FARMERS                                                     */
/* ========================================================= */

async function seedFarmers() {
  await sql`
    CREATE TABLE IF NOT EXISTS farmers (
      id TEXT PRIMARY KEY REFERENCES users(id),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(30),
      location VARCHAR(255),
      farm_name VARCHAR(255),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  for (const farmer of farmers) {
    await sql`
      INSERT INTO farmers (
        id,
        name,
        email,
        phone,
        location,
        farm_name,
        created_at
      )
      VALUES (
        ${farmer.id},
        ${farmer.name},
        ${farmer.email},
        ${farmer.phone},
        ${farmer.location},
        ${farmer.farm_name},
        ${farmer.created_at}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

/* ========================================================= */
/* FARMS                                                       */
/* ========================================================= */

async function seedFarms() {
  await sql`
    CREATE TABLE IF NOT EXISTS farms (
      id TEXT PRIMARY KEY,
      farmer_id TEXT NOT NULL REFERENCES farmers(id),
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      latitude DECIMAL(10, 7),
      longitude DECIMAL(10, 7),
      surface_area DECIMAL(10, 2),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  for (const farm of farms) {
    await sql`
      INSERT INTO farms (
        id,
        farmer_id,
        name,
        location,
        latitude,
        longitude,
        surface_area,
        created_at
      )
      VALUES (
        ${farm.id},
        ${farm.farmer_id},
        ${farm.name},
        ${farm.location},
        ${farm.latitude},
        ${farm.longitude},
        ${farm.surface_area},
        ${farm.created_at}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

/* ========================================================= */
/* PRODUCTS                                                    */
/* ========================================================= */

async function seedProducts() {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      farmer_id TEXT NOT NULL REFERENCES farmers(id),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price INT NOT NULL,
      quantity INT NOT NULL,
      unit VARCHAR(50) NOT NULL,
      category VARCHAR(100) NOT NULL,
      image_url TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  for (const product of products) {
    await sql`
      INSERT INTO products (
        id,
        farmer_id,
        name,
        description,
        price,
        quantity,
        unit,
        category,
        image_url,
        is_active,
        created_at
      )
      VALUES (
        ${product.id},
        ${product.farmer_id},
        ${product.name},
        ${product.description},
        ${product.price},
        ${product.quantity},
        ${product.unit},
        ${product.category},
        ${product.image_url},
        ${product.is_active},
        ${product.created_at}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

/* ========================================================= */
/* ORDERS                                                      */
/* ========================================================= */

async function seedOrders() {
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES users(id),
      total_amount INT NOT NULL,
      status VARCHAR(50) NOT NULL,
      payment_status VARCHAR(50) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  for (const order of orders) {
    await sql`
      INSERT INTO orders (
        id,
        customer_id,
        total_amount,
        status,
        payment_status,
        created_at
      )
      VALUES (
        ${order.id},
        ${order.customer_id},
        ${order.total_amount},
        ${order.status},
        ${order.payment_status},
        ${order.created_at}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

/* ========================================================= */
/* EQUIPMENTS                                                   */
/* ========================================================= */

async function seedEquipments() {
  await sql`
    CREATE TABLE IF NOT EXISTS equipments (
      id TEXT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price INT NOT NULL,
      category VARCHAR(100) NOT NULL,
      stock INT NOT NULL DEFAULT 0,
      image_url TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  for (const equipment of equipments) {
    await sql`
      INSERT INTO equipments (
        id,
        name,
        description,
        price,
        category,
        stock,
        image_url,
        is_active,
        created_at
      )
      VALUES (
        ${equipment.id},
        ${equipment.name},
        ${equipment.description},
        ${equipment.price},
        ${equipment.category},
        ${equipment.stock},
        ${equipment.image_url},
        ${equipment.is_active},
        ${equipment.created_at}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

/* ========================================================= */
/* AGRICULTURAL ADVICE                                         */
/* ========================================================= */

async function seedAgriculturalAdvice() {
  await sql`
    CREATE TABLE IF NOT EXISTS agricultural_advice (
      id TEXT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(100),
      image_url TEXT,
      author_id TEXT REFERENCES users(id),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  for (const advice of agriculturalAdvice) {
    await sql`
      INSERT INTO agricultural_advice (
        id,
        title,
        content,
        category,
        image_url,
        author_id,
        created_at
      )
      VALUES (
        ${advice.id},
        ${advice.title},
        ${advice.content},
        ${advice.category},
        ${advice.image_url},
        ${advice.author_id},
        ${advice.created_at}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

/* ========================================================= */
/* GROUP PURCHASES                                             */
/* ========================================================= */

async function seedGroupPurchases() {
  await sql`
    CREATE TABLE IF NOT EXISTS group_purchases (
      id TEXT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      target_quantity INT NOT NULL,
      current_quantity INT NOT NULL DEFAULT 0,
      price INT NOT NULL,
      status VARCHAR(50) NOT NULL,
      deadline DATE NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  for (const purchase of groupPurchases) {
    await sql`
      INSERT INTO group_purchases (
        id,
        title,
        description,
        target_quantity,
        current_quantity,
        price,
        status,
        deadline,
        created_at
      )
      VALUES (
        ${purchase.id},
        ${purchase.title},
        ${purchase.description},
        ${purchase.target_quantity},
        ${purchase.current_quantity},
        ${purchase.price},
        ${purchase.status},
        ${purchase.deadline},
        ${purchase.created_at}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

/* ========================================================= */
/* COLLABORATIVE SALES                                         */
/* ========================================================= */

async function seedCollaborativeSales() {
  await sql`
    CREATE TABLE IF NOT EXISTS collaborative_sales (
      id TEXT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      product_id TEXT NOT NULL REFERENCES products(id),
      target_quantity INT NOT NULL,
      current_quantity INT NOT NULL DEFAULT 0,
      price INT NOT NULL,
      status VARCHAR(50) NOT NULL,
      deadline DATE NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  for (const sale of collaborativeSales) {
    await sql`
      INSERT INTO collaborative_sales (
        id,
        title,
        description,
        product_id,
        target_quantity,
        current_quantity,
        price,
        status,
        deadline,
        created_at
      )
      VALUES (
        ${sale.id},
        ${sale.title},
        ${sale.description},
        ${sale.product_id},
        ${sale.target_quantity},
        ${sale.current_quantity},
        ${sale.price},
        ${sale.status},
        ${sale.deadline},
        ${sale.created_at}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

/* ========================================================= */
/* NOTIFICATIONS                                               */
/* ========================================================= */

async function seedNotifications() {
  await sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  for (const notification of notifications) {
    await sql`
      INSERT INTO notifications (
        id,
        user_id,
        title,
        message,
        type,
        is_read,
        created_at
      )
      VALUES (
        ${notification.id},
        ${notification.user_id},
        ${notification.title},
        ${notification.message},
        ${notification.type},
        ${notification.is_read},
        ${notification.created_at}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

/* ========================================================= */
/* REVENUE                                                     */
/* ========================================================= */

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(20) PRIMARY KEY,
      revenue INT NOT NULL
    );
  `;

  for (const item of revenue) {
    await sql`
      INSERT INTO revenue (
        month,
        revenue
      )
      VALUES (
        ${item.month},
        ${item.revenue}
      )
      ON CONFLICT (month)
      DO UPDATE SET revenue = EXCLUDED.revenue;
    `;
  }
}

/* ========================================================= */
/* SEED                                                         */
/* ========================================================= */

async function resetDatabase() {
  await sql`
    DROP TABLE IF EXISTS collaborative_sales, notifications, agricultural_advice, orders,
      products, farms, farmers, equipments, group_purchases, revenue, users;
  `;
}

export async function GET() {
  try {
    await resetDatabase();
    await seedUsers();
    await seedFarmers();
    await seedFarms();
    await seedProducts();
    await seedOrders();
    await seedEquipments();
    await seedAgriculturalAdvice();
    await seedGroupPurchases();
    await seedCollaborativeSales();
    await seedNotifications();
    await seedRevenue();

    return Response.json({
      success: true,
      message: "AFANE database seeded successfully",
    });
  } catch (error) {
    console.error("Database seed error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to seed database",
      },
      { status: 500 },
    );
  }
}