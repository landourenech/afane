import {
  User,
  Farmer,
  Product,
  Order,
  Equipment,
  AgriculturalAdvice,
  Farm,
  GroupPurchase,
  CollaborativeSale,
  Notification,
  Revenue,
} from "./definition";

/* ========================================================= */
/* USERS                                                       */
/* ========================================================= */

const users: User[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Jean-Baptiste Mba",
    email: "jean.mba@afane.ga",
    phone: "+241 06 12 34 56",
    role: "farmer",
    status: "active",
    image_url: "/users/jean.jpg",
    created_at: "2026-01-10",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Marie Nguema",
    email: "marie.nguema@afane.ga",
    phone: "+241 06 23 45 67",
    role: "farmer",
    status: "active",
    image_url: "/users/marie.jpg",
    created_at: "2026-01-15",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Paul Ondo",
    email: "paul.ondo@afane.ga",
    phone: "+241 07 34 56 78",
    role: "buyer",
    status: "active",
    image_url: "/users/paul.jpg",
    created_at: "2026-02-02",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Sophie Essono",
    email: "sophie.essono@afane.ga",
    phone: "+241 06 45 67 89",
    role: "buyer",
    status: "active",
    image_url: "/users/sophie.jpg",
    created_at: "2026-02-10",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "David Ndong",
    email: "david.ndong@afane.ga",
    phone: "+241 07 56 78 90",
    role: "manager",
    status: "active",
    image_url: "/users/david.jpg",
    created_at: "2026-02-15",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "Administrateur AFANE",
    email: "admin@afane.ga",
    phone: "+241 01 23 45 67",
    role: "admin",
    status: "active",
    image_url: "/users/admin.jpg",
    created_at: "2026-01-01",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    name: "Patrick Obame",
    email: "patrick.obame@afane.ga",
    phone: "+241 06 67 89 01",
    role: "seller",
    status: "active",
    image_url: "/users/patrick.jpg",
    created_at: "2026-03-01",
  },
];
/* ========================================================= */
/* FARMERS                                                     */
/* ========================================================= */
const farmers: Farmer[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Jean-Baptiste Mba",
    email: "jean.mba@afane.ga",
    phone: "+241 06 12 34 56",
    location: "Libreville",
    farm_name: "Ferme Mba",
    created_at: "2026-01-10",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Marie Nguema",
    email: "marie.nguema@afane.ga",
    phone: "+241 06 23 45 67",
    location: "Ntoum",
    farm_name: "Les Jardins de Marie",
    created_at: "2026-01-15",
  },
];

/* ========================================================= */
/* FARMS                                                       */
/* ========================================================= */
const farms: Farm[] = [
  {
    id: "650e8400-e29b-41d4-a716-446655440001",
    farmer_id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Ferme Mba",
    location: "Libreville",
    latitude: 0.4162,
    longitude: 9.4673,
    surface_area: 5.5,
    created_at: "2026-01-10",
  },
  {
    id: "650e8400-e29b-41d4-a716-446655440002",
    farmer_id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Les Jardins de Marie",
    location: "Ntoum",
    latitude: 0.3833,
    longitude: 9.7667,
    surface_area: 8.2,
    created_at: "2026-01-15",
  },
];
/* ========================================================= */
/* PRODUCTS                                                    */
/* ========================================================= */

const products: Product[] = [
  {
    id: "750e8400-e29b-41d4-a716-446655440001",
    name: "Tomates fraîches",
    description: "Tomates cultivées localement.",
    price: 1500,
    quantity: 250,
    unit: "kg",
    category: "Légumes",
    image_url: "/products/tomates.jpg",
    is_active: true,
    created_at: "2026-03-01",
    farmer_id: "550e8400-e29b-41d4-a716-446655440001",
    farmer_name: "Jean-Baptiste Mba",
  },
  {
    id: "750e8400-e29b-41d4-a716-446655440002",
    name: "Manioc",
    description: "Manioc frais produit localement.",
    price: 800,
    quantity: 500,
    unit: "kg",
    category: "Tubercules",
    image_url: "/products/manioc.jpg",
    is_active: true,
    created_at: "2026-03-02",
    farmer_id: "550e8400-e29b-41d4-a716-446655440002",
    farmer_name: "Marie Nguema",
  },
  {
    id: "750e8400-e29b-41d4-a716-446655440003",
    name: "Bananes plantain",
    description: "Bananes plantain fraîches.",
    price: 1200,
    quantity: 300,
    unit: "kg",
    category: "Fruits",
    image_url: "/products/plantain.jpg",
    is_active: true,
    created_at: "2026-03-03",
    farmer_id: "550e8400-e29b-41d4-a716-446655440001",
    farmer_name: "Jean-Baptiste Mba",
  },
  {
    id: "750e8400-e29b-41d4-a716-446655440004",
    name: "Maïs",
    description: "Maïs produit au Gabon.",
    price: 1000,
    quantity: 450,
    unit: "kg",
    category: "Céréales",
    image_url: "/products/mais.jpg",
    is_active: true,
    created_at: "2026-03-04",
    farmer_id: "550e8400-e29b-41d4-a716-446655440002",
    farmer_name: "Marie Nguema",
  },
  {
    id: "750e8400-e29b-41d4-a716-446655440005",
    name: "Piment",
    description: "Piment frais.",
    price: 2500,
    quantity: 120,
    unit: "kg",
    category: "Légumes",
    image_url: "/products/piment.jpg",
    is_active: true,
    created_at: "2026-03-05",
    farmer_id: "550e8400-e29b-41d4-a716-446655440001",
    farmer_name: "Jean-Baptiste Mba",
  },
];
/* ========================================================= */
/* ORDERS                                                      */
/* ========================================================= */

const orders: Order[] = [
  {
    id: "850e8400-e29b-41d4-a716-446655440001",
    customer_id: "550e8400-e29b-41d4-a716-446655440003",
    total_amount: 45000,
    status: "completed",
    payment_status: "paid",
    created_at: "2026-08-01",
    customer_name: "Paul Ondo",
    customer_email: "paul.ondo@afane.ga",
  },
  {
    id: "850e8400-e29b-41d4-a716-446655440002",
    customer_id: "550e8400-e29b-41d4-a716-446655440004",
    total_amount: 27500,
    status: "processing",
    payment_status: "paid",
    created_at: "2026-08-02",
    customer_name: "Sophie Essono",
    customer_email: "sophie.essono@afane.ga",
  },
  {
    id: "850e8400-e29b-41d4-a716-446655440003",
    customer_id: "550e8400-e29b-41d4-a716-446655440003",
    total_amount: 18000,
    status: "pending",
    payment_status: "pending",
    created_at: "2026-08-03",
    customer_name: "Paul Ondo",
    customer_email: "paul.ondo@afane.ga",
  },
  {
    id: "850e8400-e29b-41d4-a716-446655440004",
    customer_id: "550e8400-e29b-41d4-a716-446655440004",
    total_amount: 62000,
    status: "completed",
    payment_status: "paid",
    created_at: "2026-08-04",
    customer_name: "Sophie Essono",
    customer_email: "sophie.essono@afane.ga",
  },
];

/* ========================================================= */
/* EQUIPMENTS                                                   */
/* ========================================================= */

const equipments: Equipment[] = [
  {
    id: "eq-001",
    name: "Motoculteur",
    description: "Motoculteur agricole pour préparation des sols.",
    price: 850000,
    category: "Machines agricoles",
    stock: 4,
    image_url: "/equipments/motoculteur.jpg",
    is_active: true,
    created_at: "2026-03-01",
  },

  {
    id: "eq-002",
    name: "Pulvérisateur",
    description: "Pulvérisateur agricole professionnel.",
    price: 75000,
    category: "Outils",
    stock: 15,
    image_url: "/equipments/pulverisateur.jpg",
    is_active: true,
    created_at: "2026-03-05",
  },

  {
    id: "eq-003",
    name: "Système d'irrigation",
    description: "Kit d'irrigation pour exploitation agricole.",
    price: 250000,
    category: "Irrigation",
    stock: 8,
    image_url: "/equipments/irrigation.jpg",
    is_active: true,
    created_at: "2026-03-10",
  },
];

/* ========================================================= */
/* AGRICULTURAL ADVICE                                         */
/* ========================================================= */

const agriculturalAdvice: AgriculturalAdvice[] = [
  {
    id: "advice-001",
    title: "Bien préparer son sol",
    content:
      "La préparation du sol est une étape essentielle avant toute culture.",
    category: "Production",
    image_url: "/advice/soil.jpg",
    author_id: "550e8400-e29b-41d4-a716-446655440006",
    created_at: "2026-07-01",
    author_name: "Administrateur AFANE",
  },

  {
    id: "advice-002",
    title: "Optimiser l'irrigation",
    content:
      "Une bonne gestion de l'eau permet d'améliorer les rendements.",
    category: "Irrigation",
    image_url: "/advice/irrigation.jpg",
    author_id: "550e8400-e29b-41d4-a716-446655440006",
    created_at: "2026-07-10",
    author_name: "Administrateur AFANE",
  },
];

/* ========================================================= */
/* GROUP PURCHASE                                              */
/* ========================================================= */

const groupPurchases: GroupPurchase[] = [
  {
    id: "gp-001",
    title: "Achat groupé de semences de maïs",
    description:
      "Commande collective de semences de maïs.",
    target_quantity: 1000,
    current_quantity: 720,
    price: 15000,
    status: "in_progress",
    deadline: "2026-08-30",
    created_at: "2026-08-01",
  },

  {
    id: "gp-002",
    title: "Achat groupé d'engrais",
    description:
      "Achat collectif d'engrais agricoles.",
    target_quantity: 500,
    current_quantity: 210,
    price: 25000,
    status: "open",
    deadline: "2026-09-15",
    created_at: "2026-08-05",
  },
];

/* ========================================================= */
/* COLLABORATIVE SALES                                         */
/* ========================================================= */

const collaborativeSales: CollaborativeSale[] = [
  {
    id: "cs-001",
    title: "Vente collective de manioc",
    description:
      "Plusieurs producteurs regroupent leur production.",
    product_id: "750e8400-e29b-41d4-a716-446655440002",
    target_quantity: 1000,
    current_quantity: 650,
    price: 800,
    status: "in_progress",
    deadline: "2026-08-25",
    created_at: "2026-08-01",
    product_name: "Manioc",
  },

  {
    id: "cs-002",
    title: "Vente collective de plantain",
    description:
      "Regroupement de producteurs de bananes plantain.",
    product_id: "750e8400-e29b-41d4-a716-446655440003",
    target_quantity: 700,
    current_quantity: 300,
    price: 1200,
    status: "open",
    deadline: "2026-09-01",
    created_at: "2026-08-03",
    product_name: "Bananes plantain",
  },
];

/* ========================================================= */
/* NOTIFICATIONS                                               */
/* ========================================================= */

const notifications: Notification[] = [
  {
    id: "notif-001",
    user_id: "550e8400-e29b-41d4-a716-446655440006",
    title: "Nouvelle commande",
    message: "Une nouvelle commande vient d'être créée.",
    type: "order",
    is_read: false,
    created_at: "2026-08-10",
  },

  {
    id: "notif-002",
    user_id: "550e8400-e29b-41d4-a716-446655440001",
    title: "Commande confirmée",
    message: "Votre commande a été confirmée.",
    type: "order",
    is_read: true,
    created_at: "2026-08-09",
  },
];

/* ========================================================= */
/* REVENUE                                                     */
/* ========================================================= */

const revenue: Revenue[] = [
  { month: "Jan", revenue: 1250000 },
  { month: "Fév", revenue: 1580000 },
  { month: "Mar", revenue: 1850000 },
  { month: "Avr", revenue: 2100000 },
  { month: "Mai", revenue: 2450000 },
  { month: "Juin", revenue: 2780000 },
  { month: "Juil", revenue: 3150000 },
  { month: "Août", revenue: 3520000 },
];

/* ========================================================= */
/* EXPORT                                                      */
/* ========================================================= */

export {
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
};