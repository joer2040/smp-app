-- Restrict records access to the authenticated owner stored in created_by.
-- RLS remains enabled. Physical deletes remain blocked because no delete
-- policy is created.

drop policy if exists "records_select_authenticated" on public.records;
drop policy if exists "records_insert_authenticated" on public.records;
drop policy if exists "records_update_authenticated" on public.records;

create policy "records_select_owner"
on public.records
for select
to authenticated
using (auth.uid() = created_by);

create policy "records_insert_owner"
on public.records
for insert
to authenticated
with check (auth.uid() = created_by);

create policy "records_update_owner"
on public.records
for update
to authenticated
using (auth.uid() = created_by)
with check (auth.uid() = created_by);
