-- ===== ตารางเก็บงานอินโฟกราฟิก (รันใน Supabase > SQL Editor) =====
-- ถ้าไม่ต้องการเก็บงาน สามารถข้ามส่วน Supabase ทั้งหมดได้

create table if not exists public.infographics (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  school_name text,
  sub_line text,
  title text,
  content text,
  design_prompt text,
  theme_color text,
  html text
);

-- เปิด Row Level Security
alter table public.infographics enable row level security;

-- อนุญาตให้ anon (ผู้ใช้ทั่วไปที่ผ่านรหัสหน้าเว็บแล้ว) เพิ่ม/อ่านงานได้
-- หมายเหตุ: นี่เป็นระบบภายในโรงเรียน ความปลอดภัยระดับพื้นฐาน
create policy "อนุญาตให้เพิ่มงาน" on public.infographics
  for insert to anon with check (true);

create policy "อนุญาตให้อ่านงาน" on public.infographics
  for select to anon using (true);
