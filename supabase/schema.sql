create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  university text,
  major text,
  graduation_year integer,
  phone text,
  student_id_url text,
  profile_photo_url text,
  accept_terms boolean default false,
  accept_rules boolean default false,
  accept_updates boolean default false,
  updated_at timestamptz default now()
);

create table if not exists public.participant_stats (
  id integer primary key default 1,
  total_participants integer not null default 0,
  updated_at timestamptz default now()
);

create table if not exists public.accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  cash numeric not null default 100000,
  invested numeric not null default 0,
  margin_used numeric not null default 0,
  updated_at timestamptz default now()
);

create table if not exists public.options_chain (
  contract_id text primary key,
  symbol text not null,
  option_type text not null check (option_type in ('call', 'put')),
  strike numeric not null,
  expiration_date date not null,
  bid numeric,
  ask numeric,
  last numeric,
  mark numeric,
  volume numeric,
  open_interest numeric,
  implied_vol numeric,
  delta numeric,
  gamma numeric,
  theta numeric,
  vega numeric,
  rho numeric,
  updated_at timestamptz default now()
);

create table if not exists public.option_positions (
  user_id uuid references auth.users(id) on delete cascade,
  contract_id text not null references public.options_chain(contract_id),
  symbol text not null,
  option_type text not null,
  strike numeric not null,
  expiration_date date not null,
  quantity integer not null,
  avg_price numeric not null,
  mark numeric,
  implied_vol numeric,
  delta numeric,
  gamma numeric,
  theta numeric,
  vega numeric,
  rho numeric,
  updated_at timestamptz default now(),
  primary key (user_id, contract_id)
);

alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.option_positions enable row level security;
alter table public.options_chain enable row level security;
alter table public.participant_stats enable row level security;

create policy "Profiles are self readable"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are self updatable"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are self updatable 2"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Accounts are self readable"
  on public.accounts for select
  using (auth.uid() = user_id);

create policy "Accounts are self updatable"
  on public.accounts for update
  using (auth.uid() = user_id);

create policy "Positions are self readable"
  on public.option_positions for select
  using (auth.uid() = user_id);

create policy "Positions are self modifiable"
  on public.option_positions for insert
  with check (auth.uid() = user_id);

create policy "Positions are self update"
  on public.option_positions for update
  using (auth.uid() = user_id);

create policy "Options chain readable"
  on public.options_chain for select
  using (true);

create policy "Participant stats readable"
  on public.participant_stats for select
  using (true);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  insert into public.accounts (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.participant_stats (id, total_participants)
  values (1, 1)
  on conflict (id)
  do update set total_participants = public.participant_stats.total_participants + 1,
                updated_at = now();

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.place_option_order(
  contract_id_input text,
  quantity_input integer,
  side_input text
)
returns table(remaining_cash numeric) as $$
declare
  current_cash numeric;
  price numeric;
  multiplier numeric := 100;
begin
  if quantity_input <= 0 then
    raise exception 'Quantity must be positive';
  end if;

  if side_input not in ('buy', 'sell') then
    raise exception 'Invalid side';
  end if;

  select cash into current_cash
  from public.accounts
  where user_id = auth.uid()
  for update;

  select coalesce(ask, bid, last, mark) into price
  from public.options_chain
  where contract_id = contract_id_input;

  if price is null then
    raise exception 'Contract not found';
  end if;

  if side_input = 'buy' then
    if current_cash < price * quantity_input * multiplier then
      raise exception 'Insufficient cash';
    end if;

    update public.accounts
      set cash = cash - price * quantity_input * multiplier,
          invested = invested + price * quantity_input * multiplier,
          updated_at = now()
      where user_id = auth.uid();

    insert into public.option_positions (
      user_id,
      contract_id,
      symbol,
      option_type,
      strike,
      expiration_date,
      quantity,
      avg_price,
      mark,
      implied_vol,
      delta,
      gamma,
      theta,
      vega,
      rho
    )
    select
      auth.uid(),
      oc.contract_id,
      oc.symbol,
      oc.option_type,
      oc.strike,
      oc.expiration_date,
      quantity_input,
      price,
      oc.mark,
      oc.implied_vol,
      oc.delta,
      oc.gamma,
      oc.theta,
      oc.vega,
      oc.rho
    from public.options_chain oc
    where oc.contract_id = contract_id_input
    on conflict (user_id, contract_id) do update
      set quantity = public.option_positions.quantity + excluded.quantity,
          avg_price = ((public.option_positions.avg_price * public.option_positions.quantity)
            + (excluded.avg_price * excluded.quantity))
            / (public.option_positions.quantity + excluded.quantity),
          updated_at = now();
  else
    if not exists (
      select 1 from public.option_positions
      where user_id = auth.uid()
        and contract_id = contract_id_input
        and quantity >= quantity_input
    ) then
      raise exception 'Insufficient position to sell';
    end if;

    update public.option_positions
      set quantity = quantity - quantity_input,
          updated_at = now()
      where user_id = auth.uid()
        and contract_id = contract_id_input;

    delete from public.option_positions
      where user_id = auth.uid()
        and contract_id = contract_id_input
        and quantity <= 0;

    update public.accounts
      set cash = cash + price * quantity_input * multiplier,
          invested = greatest(invested - price * quantity_input * multiplier, 0),
          updated_at = now()
      where user_id = auth.uid();
  end if;

  select cash into current_cash
  from public.accounts
  where user_id = auth.uid();

  return query select current_cash;
end;
$$ language plpgsql security definer;

grant execute on function public.place_option_order(text, integer, text) to authenticated;
