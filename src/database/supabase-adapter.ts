import { DatabaseAdapter, PreparedStatement, RunResult, ColumnDefinition } from './database-adapter';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

/**
 * Supabase adapter that implements the DatabaseAdapter interface
 */
export class SupabaseAdapter implements DatabaseAdapter {
  private client: SupabaseClient;
  private _inTransaction = false;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  prepare(sql: string): PreparedStatement {
    return new SupabasePreparedStatement(this.client, sql);
  }

  exec(sql: string): void {
    // For DDL operations, we'll handle them differently in Supabase
    // Most schema operations should be done via Supabase dashboard or migrations
    logger.warn('exec() called on Supabase adapter - DDL operations should be handled via Supabase migrations');
  }

  close(): void {
    // Supabase client doesn't need explicit closing
    logger.info('Supabase adapter closed');
  }

  pragma(key: string, value?: any): any {
    // Supabase doesn't support SQLite pragmas
    logger.debug(`pragma(${key}, ${value}) called on Supabase adapter - not supported`);
    return null;
  }

  get inTransaction(): boolean {
    return this._inTransaction;
  }

  transaction<T>(fn: () => T): T {
    // Supabase handles transactions differently
    // For now, we'll execute without explicit transaction control
    this._inTransaction = true;
    try {
      const result = fn();
      this._inTransaction = false;
      return result;
    } catch (error) {
      this._inTransaction = false;
      throw error;
    }
  }

  checkFTS5Support(): boolean {
    // Supabase supports full-text search via PostgreSQL
    return true;
  }
}

/**
 * Supabase prepared statement implementation
 */
class SupabasePreparedStatement implements PreparedStatement {
  private client: SupabaseClient;
  private sql: string;
  private tableName: string;
  private operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'UNKNOWN';

  constructor(client: SupabaseClient, sql: string) {
    this.client = client;
    this.sql = sql;
    this.tableName = this.extractTableName(sql);
    this.operation = this.extractOperation(sql);
  }

  private extractTableName(sql: string): string {
    // Extract table name from SQL - simplified for common patterns
    const match = sql.match(/(?:FROM|INTO|UPDATE)\s+(\w+)/i);
    const tableName = match ? match[1] : 'nodes';
    
    // Map SQLite table names to Supabase table names
    if (tableName === 'nodes') {
      return 'n8n_nodes';
    }
    
    return tableName;
  }

  private extractOperation(sql: string): 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'UNKNOWN' {
    const trimmed = sql.trim().toUpperCase();
    if (trimmed.startsWith('SELECT')) return 'SELECT';
    if (trimmed.startsWith('INSERT')) return 'INSERT';
    if (trimmed.startsWith('UPDATE')) return 'UPDATE';
    if (trimmed.startsWith('DELETE')) return 'DELETE';
    return 'UNKNOWN';
  }

  async run(...params: any[]): Promise<RunResult> {
    try {
      switch (this.operation) {
        case 'INSERT':
          return this.handleInsert(params);
        case 'UPDATE':
          return this.handleUpdate(params);
        case 'DELETE':
          return this.handleDelete(params);
        default:
          throw new Error(`Unsupported operation: ${this.operation}`);
      }
    } catch (error) {
      logger.error('Supabase run error:', error);
      throw error;
    }
  }

  run(...params: any[]): RunResult {
    // Synchronous version - we'll need to handle this differently
    throw new Error('Synchronous run() not supported with Supabase. Use async operations.');
  }

  async get(...params: any[]): Promise<any> {
    try {
      if (this.operation === 'SELECT') {
        const result = await this.handleSelect(params, true);
        return result.length > 0 ? result[0] : undefined;
      }
      throw new Error(`get() not supported for operation: ${this.operation}`);
    } catch (error) {
      logger.error('Supabase get error:', error);
      throw error;
    }
  }

  get(...params: any[]): any {
    // Synchronous version - we'll need to handle this differently
    throw new Error('Synchronous get() not supported with Supabase. Use async operations.');
  }

  async all(...params: any[]): Promise<any[]> {
    try {
      if (this.operation === 'SELECT') {
        return this.handleSelect(params, false);
      }
      throw new Error(`all() not supported for operation: ${this.operation}`);
    } catch (error) {
      logger.error('Supabase all error:', error);
      throw error;
    }
  }

  all(...params: any[]): any[] {
    // Synchronous version - we'll need to handle this differently
    throw new Error('Synchronous all() not supported with Supabase. Use async operations.');
  }

  iterate(...params: any[]): IterableIterator<any> {
    throw new Error('iterate() not implemented for Supabase adapter');
  }

  pluck(toggle?: boolean): this {
    // Not directly supported in Supabase
    return this;
  }

  expand(toggle?: boolean): this {
    // Not directly supported in Supabase
    return this;
  }

  raw(toggle?: boolean): this {
    // Not directly supported in Supabase
    return this;
  }

  columns(): ColumnDefinition[] {
    // Would need to query information_schema in PostgreSQL
    return [];
  }

  bind(...params: any[]): this {
    // Parameters are handled in the execution methods
    return this;
  }

  private async handleSelect(params: any[], single: boolean): Promise<any[]> {
    // Parse the SQL to build Supabase query
    // This is a simplified implementation - you may need to enhance it
    
    if (this.sql.includes('WHERE node_type = ?')) {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('node_type', params[0]);
      
      if (error) throw error;
      return data || [];
    }
    
    if (this.sql.includes('WHERE is_ai_tool = 1')) {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('is_ai_tool', true);
      
      if (error) throw error;
      return data || [];
    }
    
    // Handle COUNT queries
    if (this.sql.includes('COUNT(*)')) {
      const { count, error } = await this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return [{ count: count || 0 }];
    }
    
    // Handle search queries with LIKE
    if (this.sql.includes('LIKE')) {
      let query = this.client.from(this.tableName).select('*');
      
      // Simple search implementation - can be enhanced
      if (params.length > 0) {
        const searchTerm = params[0].replace(/%/g, '');
        query = query.or(`node_type.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
    
    // Default: select all with optional limit
    let query = this.client.from(this.tableName).select('*');
    
    // Add ordering
    query = query.order('display_name');
    
    // Add limit if specified in SQL
    const limitMatch = this.sql.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      query = query.limit(parseInt(limitMatch[1]));
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  private async handleInsert(params: any[]): Promise<RunResult> {
    // Parse INSERT statement and map to Supabase
    // This is simplified - you'll need to enhance based on your schema
    
    const nodeData = {
      node_type: params[0],
      package_name: params[1],
      display_name: params[2],
      description: params[3],
      category: params[4],
      development_style: params[5],
      is_ai_tool: params[6],
      is_trigger: params[7],
      is_webhook: params[8],
      is_versioned: params[9],
      version: params[10],
      documentation: params[11],
      properties_schema: params[12],
      operations: params[13],
      credentials_required: params[14],
      outputs: params[15],
      output_names: params[16]
    };

    const { data, error } = await this.client
      .from(this.tableName)
      .upsert(nodeData)
      .select();

    if (error) throw error;

    return {
      changes: 1,
      lastInsertRowid: 0 // Supabase doesn't provide this directly
    };
  }

  private async handleUpdate(params: any[]): Promise<RunResult> {
    // Implement UPDATE logic based on your needs
    throw new Error('UPDATE not implemented yet for Supabase adapter');
  }

  private async handleDelete(params: any[]): Promise<RunResult> {
    // Implement DELETE logic based on your needs
    throw new Error('DELETE not implemented yet for Supabase adapter');
  }
}

/**
 * Create Supabase adapter
 */
export async function createSupabaseAdapter(supabaseUrl: string, supabaseKey: string): Promise<DatabaseAdapter> {
  const adapter = new SupabaseAdapter(supabaseUrl, supabaseKey);
  
  // Test connection
  try {
    const client = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await client.from('n8n_nodes').select('count', { count: 'exact', head: true });
    
    if (error && !error.message.includes('relation "n8n_nodes" does not exist')) {
      throw error;
    }
    
    logger.info('Supabase adapter initialized successfully');
    return adapter;
  } catch (error) {
    logger.error('Failed to initialize Supabase adapter:', error);
    throw new Error(`Failed to connect to Supabase: ${error}`);
  }
}
