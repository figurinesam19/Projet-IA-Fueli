-- Profils utilisateurs Fueli
-- Crée la table `profiles` liée à `auth.users` avec RLS strict

create type public.user_sex as enum ('homme', 'femme', 'autre');
create type public.user_goal as enum ('perte', 'masse', 'equilibre');
create type public.activity_level as enum ('aucun', 'peu', 'regulier');
create type public.activity_frequency as enum ('1-2', '3-4', '5+');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  age integer check (age between 13 and 120),
  sex public.user_sex,
  weight_kg numeric(5, 2) check (weight_kg between 30 and 300),
  height_cm numeric(5, 2) check (height_cm between 100 and 250),
  goal public.user_goal,
  activity_level public.activity_level,
  activity_frequency public.activity_frequency,
  rgpd_consent_at timestamptz,
  onboarding_step smallint not null default 1 check (onboarding_step between 1 and 7),
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_onboarding_completed_idx on public.profiles (onboarding_completed_at);

-- updated_at auto
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

-- Création automatique d'un profil à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS : chaque utilisateur ne voit/modifie que sa propre ligne
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
