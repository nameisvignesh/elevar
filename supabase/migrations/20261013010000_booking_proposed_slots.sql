alter table private.book_call_requests
  add column if not exists proposed_date date,
  add column if not exists proposed_time time without time zone;

do $$
begin
  if not exists (
    select 1
      from pg_constraint
     where conname = 'book_call_requests_proposed_time_check'
       and conrelid = 'private.book_call_requests'::regclass
  ) then
    alter table private.book_call_requests
      add constraint book_call_requests_proposed_time_check
      check (
        proposed_time is null or (
          proposed_time >= time '09:00'
          and proposed_time <= time '17:00'
          and extract(minute from proposed_time) in (0, 30)
        )
      );
  end if;
end;
$$;

create or replace function public.submit_book_call_request(
  p_clerk_user_id text,
  p_name text,
  p_email text,
  p_business_name text,
  p_website text,
  p_service text,
  p_project_details text,
  p_proposed_date date,
  p_proposed_time time without time zone
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

  if p_proposed_date is null or p_proposed_time is null then
    raise exception 'A proposed date and time are required';
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
    clerk_user_id, name, email, business_name, website, service, project_details, proposed_date, proposed_time
  ) values (
    p_clerk_user_id, p_name, p_email, p_business_name, nullif(p_website, ''), p_service, p_project_details, p_proposed_date, p_proposed_time
  ) returning id into new_request_id;

  return jsonb_build_object(
    'accepted', true,
    'requestId', new_request_id,
    'remaining', 2 - request_count
  );
end;
$$;

drop function if exists public.submit_book_call_request(text, text, text, text, text, text, text);
revoke all on function public.submit_book_call_request(text, text, text, text, text, text, text, date, time without time zone)
  from public, anon, authenticated;
grant execute on function public.submit_book_call_request(text, text, text, text, text, text, text, date, time without time zone)
  to service_role;
