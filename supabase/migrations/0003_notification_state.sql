-- État d'envoi des rappels push (une ligne par utilisateur).
-- `state` : par créneau, la date du dernier envoi (idempotence : jamais deux
-- notifs du même créneau le même jour) et l'index de la dernière accroche
-- (anti-répétition immédiate). Ex :
--   { "diner": { "last_date": "2026-09-13", "last_copy": 4 } }
-- Écrite uniquement par le cron via service_role : RLS activée sans policy.
create table public.notification_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.notification_state enable row level security;
