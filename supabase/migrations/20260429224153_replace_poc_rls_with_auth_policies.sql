-- Replace temporary POC policies with auth-based access.
-- RLS remains enabled. Physical deletes remain blocked because no delete
-- policy is created.

drop policy if exists "records_poc_select_anon_authenticated" on public.records;
drop policy if exists "records_poc_insert_anon_authenticated" on public.records;
drop policy if exists "records_poc_update_anon_authenticated" on public.records;

create policy "records_select_authenticated"
on public.records
for select
to authenticated
using (true);

create policy "records_insert_authenticated"
on public.records
for insert
to authenticated
with check (true);

create policy "records_update_authenticated"
on public.records
for update
to authenticated
using (true)
with check (true);
