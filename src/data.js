export const demoUsers = [
  { id: 1, name: "María Administradora", username: "admin", password: "demo", role: "Administrador", locationId: null, active: true },
  { id: 2, name: "Juan Pérez", username: "vendedor1", password: "demo", role: "Vendedor", locationId: 1, active: true },
  { id: 3, name: "Laura Gómez", username: "vendedor2", password: "demo", role: "Vendedor", locationId: 2, active: true },
  { id: 4, name: "Carlos Díaz", username: "encargado1", password: "demo", role: "Encargado", locationId: 3, active: true }
];

export const locations = [
  { id: 1, name: "Local 1", address: "Sucursal Centro", active: true },
  { id: 2, name: "Local 2", address: "Sucursal Norte", active: true },
  { id: 3, name: "Local 3", address: "Sucursal Sur", active: true }
];

export const categories = ["Bebidas", "Almacén", "Limpieza", "Perfumería", "Snacks"];

export const initialProducts = [
  { id: 1, barcode: "7790001000011", name: "Coca Cola 2.25L", category: "Bebidas", cost: 1700, price: 2800, minStock: 8, active: true, stock: { 1: 15, 2: 7, 3: 22 } },
  { id: 2, barcode: "7790001000028", name: "Agua Mineral 1.5L", category: "Bebidas", cost: 650, price: 1200, minStock: 10, active: true, stock: { 1: 28, 2: 16, 3: 34 } },
  { id: 3, barcode: "7790001000035", name: "Galletitas Chocolate", category: "Snacks", cost: 900, price: 1600, minStock: 12, active: true, stock: { 1: 6, 2: 14, 3: 3 } },
  { id: 4, barcode: "7790001000042", name: "Yerba Mate 1kg", category: "Almacén", cost: 2600, price: 4100, minStock: 6, active: true, stock: { 1: 11, 2: 4, 3: 9 } },
  { id: 5, barcode: "7790001000059", name: "Detergente 750ml", category: "Limpieza", cost: 1200, price: 2100, minStock: 6, active: true, stock: { 1: 5, 2: 8, 3: 12 } },
  { id: 6, barcode: "7790001000066", name: "Shampoo 400ml", category: "Perfumería", cost: 2400, price: 3900, minStock: 5, active: true, stock: { 1: 9, 2: 2, 3: 7 } },
  { id: 7, barcode: "7790001000073", name: "Papas Fritas 150g", category: "Snacks", cost: 1100, price: 1900, minStock: 10, active: true, stock: { 1: 21, 2: 12, 3: 16 } },
  { id: 8, barcode: "7790001000080", name: "Arroz 1kg", category: "Almacén", cost: 1000, price: 1750, minStock: 8, active: true, stock: { 1: 2, 2: 9, 3: 15 } }
];

export const initialSales = [
  { id: 1001, number: "000001", date: "2026-08-14 13:42", locationId: 1, seller: "Juan Pérez", total: 24800, payment: "Efectivo", items: 8 },
  { id: 1002, number: "000002", date: "2026-08-14 12:25", locationId: 2, seller: "Laura Gómez", total: 18600, payment: "Transferencia", items: 5 },
  { id: 1003, number: "000003", date: "2026-08-14 11:17", locationId: 3, seller: "Carlos Díaz", total: 32400, payment: "Débito", items: 11 },
  { id: 1004, number: "000004", date: "2026-08-13 19:04", locationId: 1, seller: "Juan Pérez", total: 41200, payment: "Mercado Pago", items: 13 },
  { id: 1005, number: "000005", date: "2026-08-13 18:22", locationId: 2, seller: "Laura Gómez", total: 15900, payment: "Efectivo", items: 6 }
];

export const initialMovements = [
  { id: 1, date: "14/08/2026 13:42", type: "Venta", product: "Coca Cola 2.25L", location: "Local 1", quantity: -2, user: "Juan Pérez" },
  { id: 2, date: "14/08/2026 13:10", type: "Compra", product: "Agua Mineral 1.5L", location: "Local 3", quantity: 20, user: "María Administradora" },
  { id: 3, date: "14/08/2026 12:58", type: "Transferencia", product: "Yerba Mate 1kg", location: "Local 2 → Local 1", quantity: 8, user: "María Administradora" },
  { id: 4, date: "14/08/2026 11:30", type: "Ajuste", product: "Detergente 750ml", location: "Local 1", quantity: -1, user: "María Administradora" }
];

export const formatMoney = value =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);

export const getLocationName = id => locations.find(l => l.id === id)?.name ?? "Todos";
