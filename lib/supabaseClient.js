import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase เป็นออปชัน: ถ้าไม่ได้ตั้งค่า env จะ return null และปุ่ม "บันทึก" จะถูกซ่อน
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseEnabled = Boolean(url && anonKey);
