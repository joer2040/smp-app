You are an expert Windows developer environment engineer.

Task 17: Configure Supabase CLI for the SMP project on Windows.

Context:
- Project path: SMP
- OS: Windows using PowerShell, not WSL
- Node is installed: v24.14.0
- pnpm works
- npx.cmd supabase --version works and returns 2.95.6
- supabase --version does NOT work directly
- npm install -g supabase failed because Supabase CLI global npm install is not supported
- Chocolatey choco install supabase failed because the package was not found
- Docker is installed but we are not using Supabase local yet
- Goal is to make Supabase CLI usable for this project safely

Important constraints:
- Do NOT modify project source code.
- Do NOT apply database migrations.
- Do NOT change Supabase Cloud project.
- Do NOT commit anything.
- Do NOT install random tools without explaining why.
- Prefer official or stable installation methods.
- If a tool is missing, report the exact command I should run manually.
- Avoid WSL for now.

Please do the following:

1. Inspect the current Windows environment:
   - Check if scoop exists
   - Check if winget exists
   - Check if supabase exists in PATH
   - Check current PATH entries relevant to npm/scoop/winget
   - Check if npx.cmd supabase --version works

2. Recommend the best installation path for Supabase CLI on this machine:
   - Prefer Scoop if available
   - Otherwise consider Winget if available
   - Otherwise document fallback using npx.cmd supabase

3. If Scoop is available:
   - Use the official Supabase Scoop bucket:
     scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
     scoop install supabase
   - Then validate:
     supabase --version

4. If Winget is available and Scoop is not:
   - Check whether a Supabase CLI package is available via winget
   - If available, provide the exact install command
   - If not available, do not force it

5. If neither Scoop nor Winget is usable:
   - Keep using:
     npx.cmd supabase
   - Create a local project script in package.json only if I explicitly approve later

6. Final output:
   - What was detected
   - What command was run or should be run
   - Whether supabase --version works directly
   - Recommended next command for login:
     supabase login
     or fallback:
     npx.cmd supabase login

Stop before running login.