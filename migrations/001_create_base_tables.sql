-- 001_create_base_tables.sql
-- Migration: Create organizations and users tables with RLS and best practices
-- Enable pgcrypto for UUID generation
create extension if not exists "pgcrypto";

-- Create enum for user roles
create type user_role as enum ('user', 'org-admin', 'system-admin');

-- Enum for rate limit types
create type rate_limit_type as enum (
  'api',    -- For API calls
  'auth'    -- For authentication operations
);

-- ORGANIZATIONS TABLE
create table organizations (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    created_at timestamp with time zone default timezone('utc', now()),
    updated_at timestamp with time zone default timezone('utc', now()),
    deleted_at timestamp with time zone
);

-- USERS TABLE
create table users (
    id uuid primary key references auth.users(id) on delete cascade,
    first_name text not null,
    last_name text not null,
    email text not null,
    phone_number text,
    role user_role not null,
    organization_id uuid not null references organizations(id),
    created_at timestamp with time zone default timezone('utc', now()),
    updated_at timestamp with time zone default timezone('utc', now()),
    deleted_at timestamp with time zone,
    
    -- Ensure email matches auth.users email
    constraint users_email_check check (
        email = (select email from auth.users where id = users.id)
    )
);

-- Rate limits table
create table rate_limits (
  id uuid primary key default gen_random_uuid(),
  -- Scope: either user_id or organization_id must be set, but not both
  user_id uuid references auth.users(id),
  organization_id uuid references organizations(id),
  type rate_limit_type not null,
  key text not null,
  counter integer not null default 1,
  max_requests integer not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc', now()),
  last_updated_at timestamp with time zone default timezone('utc', now()),
  
  -- Ensure either user_id or organization_id is set, but not both
  constraint rate_limit_scope_check check (
    (user_id is not null and organization_id is null) or
    (user_id is null and organization_id is not null)
  ),
  
  -- Unique constraints for different scopes
  unique(user_id, type, key) where user_id is not null,
  unique(organization_id, type, key) where organization_id is not null
);

-- Indexes for performance
create index users_organization_id_idx on users(organization_id);
create index users_role_idx on users(role);
create index rate_limits_user_id_idx on rate_limits(user_id) where user_id is not null;
create index rate_limits_organization_id_idx on rate_limits(organization_id) where organization_id is not null;
create index rate_limits_type_key_idx on rate_limits(type, key);
create index rate_limits_expires_at_idx on rate_limits(expires_at);

-- RLS: Enable row level security
alter table
    users enable row level security;

alter table
    organizations enable row level security;

alter table 
    rate_limits enable row level security;

-- RLS Policies for users table
-- 1. Users can view their own profile
create policy "Users can view their own profile" on users for
select
    using (
        (select auth.uid()) = id
    );

-- 2. Users can view users in their organization
create policy "Users can view users in their org" on users for
select
    using (
        organization_id = (
            select organization_id from users where id = (select auth.uid())
        )
    );

-- 3. System admins can view all users
create policy "System admins can view all users" on users for
select
    using (
        (select role from users where id = (select auth.uid())) = 'system-admin'
    );

-- Org admins and system-admins can update users in their org
create policy "Users can update their own profile" on users for
update
    using (
        (select auth.uid()) = id
    )
    with check (
        -- Users can only update their own first_name and last_name
        (select auth.uid()) = id
        and (
            -- Only allow updating these fields
            (old.first_name is distinct from new.first_name) or
            (old.last_name is distinct from new.last_name)
        )
    );

-- Org admins and system-admins can update users in their org
create policy "Org admins and system-admins can update users in their org" on users for
update
    using (
        (
            select role from users where id = (select auth.uid())
        ) = 'system-admin'
        or (
            organization_id = (
                select organization_id from users where id = (select auth.uid())
            )
            and (
                select role from users where id = (select auth.uid())
            ) = 'org-admin'
        )
    );

-- Org admins and system-admins can delete users in their org
create policy "Org admins and system-admins can delete users in their org" on users for delete using (
    (
        select role from users where id = (select auth.uid())
    ) = 'system-admin'
    or (
        organization_id = (
            select organization_id from users where id = (select auth.uid())
        )
        and (
            select role from users where id = (select auth.uid())
        ) = 'org-admin'
    )
);

-- Org admins and system-admins can invite users to their org
create policy "Users can insert their own profile" on users for
insert
    with check (
        (select auth.uid()) = id
        and (role = 'user' or role = 'org-admin')
        and organization_id is not null  -- Must be assigned to an organization
    );

-- Org admins and system-admins can invite users to their org
create policy "Org admins and system-admins can invite users to their org" on users for
insert
    with check (
        (
            select role from users where id = (select auth.uid())
        ) = 'system-admin'
        or (
            organization_id = (
                select organization_id from users where id = (select auth.uid())
            )
            and (
                select role from users where id = (select auth.uid())
            ) = 'org-admin'
        )
    );

-- RLS Policies for organizations table
-- 1. Users can view their own organization
-- 2. system-admin can view all organizations
create policy "Users can view their org or as system-admin" on organizations for
select
    using (
        (
            select role from users where id = (select auth.uid())
        ) = 'system-admin'
        or id = (
            select organization_id from users where id = (select auth.uid())
        )
    );

-- Org admins and system-admins can update their org
create policy "Org admins and system-admins can update their org" on organizations for
update
    using (
        (
            select role from users where id = (select auth.uid())
        ) = 'system-admin'
        or (
            id = (
                select organization_id from users where id = (select auth.uid())
            )
            and (
                select role from users where id = (select auth.uid())
            ) = 'org-admin'
        )
    );

-- Soft delete: always filter out deleted_at IS NOT NULL in your queries

-- TRIGGERS: Auto-update updated_at on row UPDATE
-- Function for users table
create or replace function update_users_updated_at() 
returns trigger as $$ 
begin 
    new.updated_at = timezone('utc', now());
    return new;
end;
$$ language plpgsql;

create trigger trigger_update_users_updated_at 
before update on users 
for each row 
execute procedure update_users_updated_at();

-- Function for organizations table
create or replace function update_organizations_updated_at() 
returns trigger as $$ 
begin 
    new.updated_at = timezone('utc', now());
    return new;
end;
$$ language plpgsql;

create trigger trigger_update_organizations_updated_at 
before update on organizations 
for each row
execute procedure update_organizations_updated_at();

-- Function to increment rate limit counters
create or replace function increment_rate_limit(
  scope_type text, -- 'user' or 'organization'
  scope_id uuid,   -- user_id or organization_id
  type_param rate_limit_type,
  key_param text,
  ttl_param integer,
  max_param integer
)
returns integer
language plpgsql
as $$
declare
  current_count integer;
  now_time timestamp with time zone := now();
  expire_time timestamp with time zone := now() + (ttl_param * interval '1 second');
begin
  -- Clean up expired entries
  delete from rate_limits where expires_at < now_time;
  
  -- Try to insert or update based on scope
  if scope_type = 'user' then
    insert into rate_limits (
      user_id,
      type,
      key,
      counter,
      max_requests,
      expires_at
    )
    values (
      scope_id,
      type_param,
      key_param,
      1,
      max_param,
      expire_time
    )
    on conflict (user_id, type, key) where user_id is not null
    do update set
      counter = rate_limits.counter + 1,
      last_updated_at = now_time
    returning counter into current_count;
  else
    insert into rate_limits (
      organization_id,
      type,
      key,
      counter,
      max_requests,
      expires_at
    )
    values (
      scope_id,
      type_param,
      key_param,
      1,
      max_param,
      expire_time
    )
    on conflict (organization_id, type, key) where organization_id is not null
    do update set
      counter = rate_limits.counter + 1,
      last_updated_at = now_time
    returning counter into current_count;
  end if;
  
  return current_count;
end;
$$;

-- Cleanup function
create or replace function cleanup_expired_rate_limits()
returns void
language plpgsql
as $$
begin
  delete from rate_limits where expires_at < now();
end;
$$;

-- Schedule cleanup job
select cron.schedule(
  'cleanup-rate-limits',
  '0 * * * *', -- Run every hour
  'select cleanup_expired_rate_limits()'
);

-- Users can view their own rate limits
create policy "Users can view their own rate limits"
on rate_limits for select
using (
    (select auth.uid()) = user_id
    or
    organization_id in (
        select organization_id 
        from users 
        where id = (select auth.uid())
    )
);

-- Grant access to authenticated users
grant select, insert, update, delete on rate_limits to authenticated;
grant execute on function increment_rate_limit to authenticated;
grant execute on function cleanup_expired_rate_limits to authenticated;
