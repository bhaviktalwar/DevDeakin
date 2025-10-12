# How to push this project to GitHub

Follow these steps from the project root (`e:/Sem3/SIT313/task92c`). I show a command-line (bash) flow and an alternative using the GitHub web UI or `gh` CLI.

1) Make sure sensitive files are ignored

  - `.env.local` and `.env` are already listed in `.gitignore`. Do NOT commit any secret keys or `sk_` values.

2) Initialize git (if not already)

```bash
git init
git add .
git commit -m "Initial commit"
```

3) Create a new repo on GitHub

Option A — using the `gh` CLI (recommended):

```bash
# install GH CLI if you don't have it: https://cli.github.com/
gh auth login
gh repo create <your-username>/<repo-name> --private --source=. --remote=origin --push
```

Option B — using the GitHub web UI:

- Go to https://github.com/new
- Choose a name, description, visibility (public/private)
- DON'T initialize with README (we already have one)
- Create repository
- GitHub will show the commands to run locally; copy the `git remote add origin ...` and `git push -u origin main` commands and run them locally.

4) Push your code

```bash
# if remote not set by gh
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

5) Add secrets (CI / deployment)

- If you deploy to Vercel/Netlify/GitHub Actions, add server secrets (Stripe secret key, Firebase service account, webhook secret) in the dashboard — never commit them.

6) (Optional) Setup a README and LICENSE if desired

7) Quick checklist before push

- Ensure `.gitignore` contains `.env.local`.
- Remove any accidental secret pasted into code or README.
- If you previously committed any secret, rotate it now and remove the commit (use git filter-repo or BFG) — I can help if that happened.
