-- Repas Fueli
-- Une `meal` regroupe les `meal_items` (aliments individuels) d'une même prise alimentaire.
-- Les photos sont envoyées à OpenAI mais JAMAIS stockées (cf. minimisation des données).

create type public.meal_kind as enum ('petit_dejeuner', 'dejeuner', 'diner', 'collation');
create type public.meal_source as enum ('scan_photo', 'recherche', 'code_barre', 'manuel');

create table public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consumed_at timestamptz not null default now(),
  kind public.meal_kind,
  source public.meal_source not null,
  total_kcal numeric(7, 2) not null default 0,
  total_protein_g numeric(6, 2) not null default 0,
  total_carbs_g numeric(6, 2) not null default 0,
  total_fat_g numeric(6, 2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index meals_user_consumed_idx on public.meals (user_id, consumed_at desc);

create table public.meal_items (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals(id) on delete cascade,
  name text not null,
  quantity_g numeric(7, 2),
  kcal numeric(7, 2) not null default 0,
  protein_g numeric(6, 2) not null default 0,
  carbs_g numeric(6, 2) not null default 0,
  fat_g numeric(6, 2) not null default 0,
  ciqual_code text,
  off_barcode text,
  created_at timestamptz not null default now()
);

create index meal_items_meal_idx on public.meal_items (meal_id);

create trigger meals_touch_updated_at
before update on public.meals
for each row execute function public.touch_updated_at();

-- RLS : chaque user ne voit/écrit que ses repas et leurs items
alter table public.meals enable row level security;
alter table public.meal_items enable row level security;

create policy "meals_select_own" on public.meals
  for select using (auth.uid() = user_id);
create policy "meals_insert_own" on public.meals
  for insert with check (auth.uid() = user_id);
create policy "meals_update_own" on public.meals
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "meals_delete_own" on public.meals
  for delete using (auth.uid() = user_id);

create policy "meal_items_select_own" on public.meal_items
  for select using (
    exists (select 1 from public.meals m where m.id = meal_id and m.user_id = auth.uid())
  );
create policy "meal_items_insert_own" on public.meal_items
  for insert with check (
    exists (select 1 from public.meals m where m.id = meal_id and m.user_id = auth.uid())
  );
create policy "meal_items_update_own" on public.meal_items
  for update using (
    exists (select 1 from public.meals m where m.id = meal_id and m.user_id = auth.uid())
  );
create policy "meal_items_delete_own" on public.meal_items
  for delete using (
    exists (select 1 from public.meals m where m.id = meal_id and m.user_id = auth.uid())
  );
