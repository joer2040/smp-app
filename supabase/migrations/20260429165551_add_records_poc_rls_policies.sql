-- Temporary POC-only policies for public.records.
-- These policies are intentionally permissive so the offline-first POC can
-- validate browser-driven select, insert, and update flows before auth exists.
-- Replace these before production with proper auth-based policies.

create policy "records_poc_select_anon_authenticated"
on public.records
for select
to anon, authenticated
using (true);

create policy "records_poc_insert_anon_authenticated"
on public.records
for insert
to anon, authenticated
with check (true);

create policy "records_poc_update_anon_authenticated"
on public.records
for update
to anon, authenticated
using (true)
with check (true);

-- No delete policy is created. Physical deletes remain blocked by RLS.
