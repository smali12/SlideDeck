import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Presentation = {
  id: string;
  title: string;
  description: string | null;
  theme: string;
  created_at: string;
  updated_at: string;
};

export type Slide = {
  id: string;
  presentation_id: string;
  order_index: number;
  title: string;
  content: ContentBlock[];
  layout: string;
  background_color: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentBlock = {
  type: 'heading' | 'text' | 'bullet' | 'image' | 'code';
  value: string;
  level?: number;
};