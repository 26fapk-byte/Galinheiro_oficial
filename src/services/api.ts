
import { Product, User, Requisition, StockMovement } from '../types';
import { supabase } from './supabase';

/**
 * ApiService - Camada de abstração para dados.
 * Migrado de localStorage para Supabase.
 */
export const ApiService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }

    // Converter snake_case do banco para camelCase do TypeScript
    return (data || []).map(p => ({
      id: p.id,
      sku: p.sku,
      internalCode: p.internal_code,
      name: p.name,
      description: p.description,
      category: p.category,
      stock: Number(p.stock),
      unit: p.unit,
      conversionFactor: p.conversion_factor ? Number(p.conversion_factor) : undefined,
      status: p.status,
      imageUrl: p.image_url,
      updatedAt: p.updated_at
    }));
  },

  async saveProducts(products: Product[]): Promise<void> {
    // Converter camelCase para snake_case
    const dbProducts = products.map(p => ({
      id: p.id,
      sku: p.sku,
      internal_code: p.internalCode,
      name: p.name,
      description: p.description,
      category: p.category,
      stock: p.stock,
      unit: p.unit,
      conversion_factor: p.conversionFactor,
      status: p.status,
      image_url: p.imageUrl,
      updated_at: p.updatedAt
    }));

    const { error } = await supabase
      .from('products')
      .upsert(dbProducts);

    if (error) {
      console.error('Erro ao salvar produtos:', error);
      throw error;
    }
  },

  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }

    return data || [];
  },

  async saveUsers(users: User[]): Promise<void> {
    const { error } = await supabase
      .from('users')
      .upsert(users);

    if (error) {
      console.error('Erro ao salvar usuários:', error);
      throw error;
    }
  },

  async getRequisitions(): Promise<Requisition[]> {
    const { data, error } = await supabase
      .from('requisitions')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Erro ao buscar requisições:', error);
      return [];
    }

    // Converter snake_case para camelCase
    return (data || []).map(r => ({
      id: r.id,
      userId: r.user_id,
      userName: r.user_name,
      items: r.items,
      timestamp: r.timestamp
    }));
  },

  async saveRequisition(req: Requisition): Promise<void> {
    // Converter camelCase para snake_case
    const dbReq = {
      id: req.id,
      user_id: req.userId,
      user_name: req.userName,
      items: req.items,
      timestamp: req.timestamp
    };

    const { error } = await supabase
      .from('requisitions')
      .insert([dbReq]);

    if (error) {
      console.error('Erro ao salvar requisição:', error);
      throw error;
    }
  },

  async getMovements(): Promise<StockMovement[]> {
    const { data, error } = await supabase
      .from('stock_movements')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Erro ao buscar movimentações:', error);
      return [];
    }

    // Converter snake_case para camelCase
    return (data || []).map(m => ({
      id: m.id,
      productId: m.product_id,
      productName: m.product_name,
      type: m.type,
      quantity: Number(m.quantity),
      userId: m.user_id,
      userName: m.user_name,
      timestamp: m.timestamp
    }));
  },

  async saveMovements(movements: StockMovement[]): Promise<void> {
    // Converter camelCase para snake_case
    const dbMovements = movements.map(m => ({
      id: m.id,
      product_id: m.productId,
      product_name: m.productName,
      type: m.type,
      quantity: m.quantity,
      user_id: m.userId,
      user_name: m.userName,
      timestamp: m.timestamp
    }));

    const { error } = await supabase
      .from('stock_movements')
      .insert(dbMovements);

    if (error) {
      console.error('Erro ao salvar movimentações:', error);
      throw error;
    }
  }
};
