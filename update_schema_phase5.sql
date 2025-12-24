-- Add columns for Phase 5 Logic

-- Add equipped_theme to profiles
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'equipped_theme') then
        alter table profiles add column equipped_theme text default 'default';
    end if;
end $$;

-- Add active_effects to profiles (JSONB to store things like { "double_xp_until": "timestamp" })
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'active_effects') then
        alter table profiles add column active_effects jsonb default '{}'::jsonb;
    end if;
end $$;
