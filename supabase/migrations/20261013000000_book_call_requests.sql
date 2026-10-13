create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

create table if not exists private.book_call_requests (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  name text not null,
  email text not null,
  business_name text not null,
  website text,
  service text not null,
  project_details text not null,
  created_at timestamptz not null default now()
);

create index if not exists book_call_requests_user_created_idx
  on private.book_call_requests (clerk_user_id, created_at desc);

alter table private.book_call_requests enable row level security;
revoke all on private.book_call_requests from public, anon, authenticated;
grant select, insert on private.book_call_requests to service_role;

create or replace function public.submit_book_call_request(
  p_clerk_user_id text,
  p_name text,
  p_email text,
  p_business_name text,
  p_website text,
  p_service text,
  p_project_details text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, private
as $$
declare
  day_start timestamptz := date_trunc('day', statement_timestamp() at time zone 'Asia/Kolkata') at time zone 'Asia/Kolkata';
  request_count integer;
  new_request_id uuid;
begin
  if p_clerk_user_id is null or length(p_clerk_user_id) = 0 then
    raise exception 'User identity is required';
  end if;

  -- Serialize submissions for one account and India Standard Time day so concurrent requests
  -- cannot race past the three-per-day limit.
  perform pg_advisory_xact_lock(
    hashtextextended(
      p_clerk_user_id || ':' || to_char(day_start at time zone 'Asia/Kolkata', 'YYYY-MM-DD'),
      0
    )
  );

  select count(*)::integer
    into request_count
    from private.book_call_requests
   where clerk_user_id = p_clerk_user_id
     and created_at >= day_start
     and created_at < day_start + interval '1 day';

  if request_count >= 3 then
    return jsonb_build_object('accepted', false, 'remaining', 0);
  end if;

  insert into private.book_call_requests (
    clerk_user_id, name, email, business_name, website, service, project_details
  ) values (
    p_clerk_user_id, p_name, p_email, p_business_name, nullif(p_website, ''), p_service, p_project_details
  ) returning id into new_request_id;

  return jsonb_build_object(
    'accepted', true,
    'requestId', new_request_id,
    'remaining', 2 - request_count
  );
end;
$$;

revoke all on function public.submit_book_call_request(text, text, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.submit_book_call_request(text, text, text, text, text, text, text)
  to service_role;
