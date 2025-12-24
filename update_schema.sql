-- Marketplace & Inventory
create table if not exists items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  cost int not null,
  type text not null, -- 'Consumable', 'Cosmetic', 'RealWorld'
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists inventory (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  item_id uuid references items on delete cascade not null,
  quantity int default 1,
  acquired_at timestamp with time zone default timezone('utc'::text, now())
);

-- Achievements
create table if not exists badges (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  icon_url text,
  condition_type text not null, -- 'Streak', 'TotalTasks', 'RRule'
  condition_value int not null,
  xp_reward int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists user_badges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  badge_id uuid references badges on delete cascade not null,
  earned_at timestamp with time zone default timezone('utc'::text, now())
);

-- Guilds
create table if not exists guilds (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  description text,
  leader_id uuid references auth.users on delete set null,
  total_xp int default 0,
  level int default 1,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Add guild_id to profiles if it doesn't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'guild_id') then
        alter table profiles add column guild_id uuid references guilds(id) on delete set null;
    end if;
end $$;

-- RLS for New Tables
alter table items enable row level security;
alter table inventory enable row level security;
alter table badges enable row level security;
alter table user_badges enable row level security;
alter table guilds enable row level security;

-- Policies for New Tables (Drop if exists to avoid errors on re-run)
drop policy if exists "Public read items" on items;
create policy "Public read items" on items for select using (true);

drop policy if exists "Users can view own inventory" on inventory;
create policy "Users can view own inventory" on inventory for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own inventory" on inventory;
create policy "Users can insert own inventory" on inventory for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own inventory" on inventory;
create policy "Users can update own inventory" on inventory for update using (auth.uid() = user_id);

drop policy if exists "Public read badges" on badges;
create policy "Public read badges" on badges for select using (true);

drop policy if exists "Users can view own badges" on user_badges;
create policy "Users can view own badges" on user_badges for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own badges" on user_badges;
create policy "Users can insert own badges" on user_badges for insert with check (auth.uid() = user_id);

drop policy if exists "Public read guilds" on guilds;
create policy "Public read guilds" on guilds for select using (true);

drop policy if exists "Guild members can update guild" on guilds;
create policy "Guild members can update guild" on guilds for update using (auth.uid() in (select id from profiles where guild_id = guilds.id));

drop policy if exists "Authenticated users can create guilds" on guilds;
create policy "Authenticated users can create guilds" on guilds for insert with check (auth.role() = 'authenticated');
