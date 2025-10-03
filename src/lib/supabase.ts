import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Document {
  id: string;
  user_id: string | null;
  filename: string;
  file_url: string | null;
  markdown: string | null;
  chunks: any;
  splits: any;
  metadata: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface Extraction {
  id: string;
  document_id: string;
  schema: any;
  extraction: any;
  extraction_metadata: any;
  metadata: any;
  created_at: string;
}
