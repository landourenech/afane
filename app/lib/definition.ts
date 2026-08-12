// ============================================================
// TYPES AFANE
// ============================================================

/* ========================================================= */
/* USER                                                        */
/* ========================================================= */

export type UserRole =
  | "admin"
  | "manager"
  | "farmer"
  | "buyer"
  | "seller";

export type UserStatus =
  | "active"
  | "inactive"
  | "pending";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  image_url: string | null;
  created_at: string;
};


/* ========================================================= */
/* FARMER / PRODUCTEUR                                        */
/* ========================================================= */

export type Farmer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  farm_name: string | null;
  created_at: string;
};


/* ========================================================= */
/* PRODUCT                                                     */
/* ========================================================= */

export type Product = {
  id: string;
  name: string;
  description: string | null;

  price: number;
  quantity: number;
  unit: string;

  category: string;

  image_url: string | null;

  is_active: boolean;

  created_at: string;

  farmer_id: string;
  farmer_name?: string;
};


/* ========================================================= */
/* ORDER                                                       */
/* ========================================================= */

export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed";

export type Order = {
  id: string;

  customer_id: string;

  total_amount: number;

  status: OrderStatus;

  payment_status: PaymentStatus;

  created_at: string;

  customer_name?: string;
  customer_email?: string;
};


/* ========================================================= */
/* ORDER ITEM                                                  */
/* ========================================================= */

export type OrderItem = {
  id: string;

  order_id: string;

  product_id: string;

  quantity: number;

  unit_price: number;

  total_price: number;

  product_name?: string;
};


/* ========================================================= */
/* EQUIPMENT                                                   */
/* ========================================================= */

export type Equipment = {
  id: string;

  name: string;

  description: string | null;

  price: number;

  category: string;

  stock: number;

  image_url: string | null;

  is_active: boolean;

  created_at: string;
};


/* ========================================================= */
/* AGRICULTURAL ADVICE                                         */
/* ========================================================= */

export type AgriculturalAdvice = {
  id: string;

  title: string;

  content: string;

  category: string;

  image_url: string | null;

  author_id: string;

  created_at: string;

  author_name?: string;
};


/* ========================================================= */
/* FARM                                                         */
/* ========================================================= */

export type Farm = {
  id: string;

  farmer_id: string;

  name: string;

  location: string | null;

  latitude: number | null;

  longitude: number | null;

  surface_area: number | null;

  created_at: string;
};


/* ========================================================= */
/* GROUP PURCHASE                                              */
/* ========================================================= */

export type GroupPurchaseStatus =
  | "open"
  | "in_progress"
  | "completed"
  | "cancelled";

export type GroupPurchase = {
  id: string;

  title: string;

  description: string | null;

  target_quantity: number;

  current_quantity: number;

  price: number;

  status: GroupPurchaseStatus;

  deadline: string;

  created_at: string;
};


/* ========================================================= */
/* COLLABORATIVE SALE                                          */
/* ========================================================= */

export type CollaborativeSaleStatus =
  | "open"
  | "in_progress"
  | "completed"
  | "cancelled";

export type CollaborativeSale = {
  id: string;

  title: string;

  description: string | null;

  product_id: string;

  target_quantity: number;

  current_quantity: number;

  price: number;

  status: CollaborativeSaleStatus;

  deadline: string;

  created_at: string;

  product_name?: string;
};


/* ========================================================= */
/* NOTIFICATION                                                */
/* ========================================================= */

export type NotificationType =
  | "order"
  | "payment"
  | "product"
  | "system"
  | "message";

export type Notification = {
  id: string;

  user_id: string;

  title: string;

  message: string;

  type: NotificationType;

  is_read: boolean;

  created_at: string;
};


/* ========================================================= */
/* DASHBOARD                                                   */
/* ========================================================= */

export type DashboardStats = {
  users: number;

  farmers: number;

  products: number;

  orders: number;

  revenue: number;

  pendingOrders: number;
};


/* ========================================================= */
/* RECENT ORDERS                                               */
/* ========================================================= */

export type RecentOrder = {
  id: string;

  total_amount: number;

  status: OrderStatus;

  created_at: string;

  customer_name: string;

  customer_image: string | null;
};


/* ========================================================= */
/* DASHBOARD REVENUE                                           */
/* ========================================================= */

export type Revenue = {
  month: string;

  revenue: number;
};


/* ========================================================= */
/* PAGINATION                                                  */
/* ========================================================= */

export type Pagination = {
  currentPage: number;

  totalPages: number;

  totalItems: number;

  itemsPerPage: number;
};


/* ========================================================= */
/* ShopItem                                                  */
/* ========================================================= */
export type ShopItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_active: boolean;

  type: "product" | "equipment";

  quantity?: number;
  unit?: string;
  stock?: number;

  farmer_id?: string;
  farmer_name?: string;

  created_at: string;
};