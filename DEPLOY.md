# Deploy (GitHub + Vercel)

This project has 87 files and no hidden platform folders, so it fits GitHub's
website upload limit (100 files per upload). Using git or GitHub Desktop is still safest.

1. Unzip. Open a terminal in the folder and run:
   git init && git add . && git commit -m "Boonies Bakery"
   git branch -M main
   git remote add origin https://github.com/YOUR-NAME/boonies-bakery.git
   git push -u origin main
2. vercel.com > Add New > Project > import the repo. Framework: leave auto (or "Other").
   Node.js version: 22.x. Build command: leave default (npm run build).
3. Environment variables: VITE_SITE_URL and SITE_URL = your https:// address (no trailing slash).
   Optional: VITE_GOOGLE_SITE_VERIFICATION.
4. Deploy. After adding a custom domain, update both variables and redeploy.
