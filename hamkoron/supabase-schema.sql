-- HAMKORON Supabase Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Workers table
create table if not exists workers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text not null,
  profession text not null,
  experience text not null,
  city text not null,
  photo_url text,
  rating numeric(3,2) default 0,
  review_count int default 0,
  verified boolean default false,
  created_at timestamp with time zone default now()
);

-- Jobs table
create table if not exists jobs (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text not null,
  city text not null,
  description text not null,
  profession text,
  status text default 'open' check (status in ('open', 'closed')),
  created_at timestamp with time zone default now()
);

-- Reviews table
create table if not exists reviews (
  id uuid default uuid_generate_v4() primary key,
  worker_id uuid references workers(id) on delete cascade,
  reviewer_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table workers enable row level security;
alter table jobs enable row level security;
alter table reviews enable row level security;

-- Public read access
create policy "Public read workers" on workers for select using (true);
create policy "Public read jobs" on jobs for select using (true);
create policy "Public read reviews" on reviews for select using (true);

-- Public insert (with rate limiting handled server-side)
create policy "Anyone can register as worker" on workers for insert with check (true);
create policy "Anyone can post a job" on jobs for insert with check (true);
create policy "Anyone can leave a review" on reviews for insert with check (true);

-- Auto-update worker rating trigger
create or replace function update_worker_rating()
returns trigger as $$
begin
  update workers
  set
    rating = (select avg(rating) from reviews where worker_id = new.worker_id),
    review_count = (select count(*) from reviews where worker_id = new.worker_id)
  where id = new.worker_id;
  return new;
end;
$$ language plpgsql;

create trigger after_review_insert
after insert on reviews
for each row execute function update_worker_rating();

-- Sample data
insert into workers (name, phone, profession, experience, city, rating, review_count, verified) values
('Алишер Раҳимов', '+992 900 123 456', 'electrician', '5 сол', 'Душанбе', 4.8, 24, true),
('Баҳром Назаров', '+992 917 234 567', 'plumber', '7 сол', 'Хуҷанд', 4.9, 31, true),
('Давлат Юсупов', '+992 934 345 678', 'builder', '10 сол', 'Душанбе', 4.7, 18, false),
('Фируз Каримов', '+992 918 456 789', 'painter', '4 сол', 'Кӯлоб', 4.6, 12, true),
('Ҷамшед Мирзоев', '+992 935 567 890', 'welder', '8 сол', 'Бохтар', 5.0, 42, true),
('Санҷар Тошматов', '+992 901 678 901', 'tile', '6 сол', 'Хуҷанд', 4.5, 9, false),
('Умед Ҳасанов', '+992 919 789 012', 'carpenter', '12 сол', 'Душанбе', 4.9, 55, true),
('Шерзод Абдуллоев', '+992 936 890 123', 'general', '3 сол', 'Истаравшан', 4.3, 7, false);
