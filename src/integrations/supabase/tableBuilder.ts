
import { 
  TableQueryBuilder, 
  QueryBuilder, 
  CountBuilder, 
  SelectBuilder, 
  DataResponse 
} from "./types.client";
import { supabase } from "./client";
import { SupabaseQueryBuilder, SupabaseCountBuilder, SupabaseSelectBuilder } from "./queryBuilders";
import { PostgrestError } from "@supabase/supabase-js";

// Supabase-based table query builder
export class SupabaseTableQueryBuilder<T = any> implements TableQueryBuilder<T> {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string = "*"): SelectBuilder<T> {
    return new SupabaseSelectBuilder<T>(this.table, columns);
  }

  async insert(data: any): DataResponse<T> {
    try {
      const { data: insertedData, error } = await supabase
        .from(this.table)
        .insert(data);
      
      // If insertion is successful, fetch the inserted record
      if (!error) {
        const query = supabase
          .from(this.table)
          .select('*')
          .order('created_at', { ascending: false });
        
        const { data: fetchedData, error: fetchError } = await query.limit(1).single();
        
        return { data: fetchedData as T, error: fetchError };
      }
      
      return { data: null, error };
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  }

  update(data: any) {
    return {
      eq: async (field: string, value: any) => {
        try {
          const { error } = await supabase
            .from(this.table)
            .update(data)
            .eq(field, value);
          
          return { error };
        } catch (error) {
          return { error: error as PostgrestError };
        }
      }
    };
  }

  delete() {
    return {
      eq: async (field: string, value: any) => {
        try {
          const { error } = await supabase
            .from(this.table)
            .delete()
            .eq(field, value);
          
          return { error };
        } catch (error) {
          return { error: error as PostgrestError };
        }
      }
    };
  }

  count(column: string = "*"): CountBuilder {
    return new SupabaseCountBuilder(this.table);
  }

  eq(field: string, value: any): QueryBuilder<T> {
    return new SupabaseQueryBuilder<T>(this.table, { [field]: value });
  }

  gte(field: string, value: any): QueryBuilder<T> {
    return new SupabaseQueryBuilder<T>(this.table);
  }

  gt(field: string, value: any): QueryBuilder<T> {
    return new SupabaseQueryBuilder<T>(this.table);
  }

  limit(value: number): QueryBuilder<T> {
    const queryBuilder = new SupabaseQueryBuilder<T>(this.table);
    return queryBuilder.limit(value);
  }

  async single(): DataResponse<T> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  }

  order(field: string, { ascending }: { ascending: boolean }): QueryBuilder<T> {
    return new SupabaseQueryBuilder<T>(this.table, {}, field, ascending);
  }

  async then<R>(
    onfulfilled?: ((value: { data: T[] | null; error: PostgrestError | null }) => R | PromiseLike<R>) | null
  ): Promise<R> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select();
      
      return onfulfilled!({ data: data as T[], error });
    } catch (error) {
      return onfulfilled!({ data: null, error: error as PostgrestError });
    }
  }
}
