
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum UserStatus {
  ACTIVE = 'ativo',
  PENDING = 'pendente',
  INACTIVE = 'inativo'
}

export enum ProductUnit {
  UN = 'un',
  KG = 'kg',
  CX = 'cx',
  PC = 'pç',
  MT = 'mt',
  LT = 'lt'
}

export enum ProductStatus {
  ACTIVE = 'ativo',
  INACTIVE = 'inativo'
}

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
}

export interface Product {
  id: string;
  sku: string;
  internalCode?: string;
  name: string;
  description: string;
  category: string;
  stock: number;
  unit: ProductUnit;
  conversionFactor?: number;
  status: ProductStatus;
  imageUrl?: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Requisition {
  id: string;
  userId: string;
  userName: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unit: ProductUnit;
  }[];
  timestamp: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  userId: string;
  userName: string;
  timestamp: string;
}
