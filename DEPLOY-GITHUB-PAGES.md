# Deploy PLC Programming Hub to GitHub Pages

Your site will live at: **https://luc1342as2.github.io/PLCWebsite/**

## 1. Create the GitHub repo (if you haven’t)

- Go to [github.com/new](https://github.com/new).
- **Repository name:** `PLCWebsite` (must be exactly this for that URL).
- Choose Public, create the repo (no need to add README if you already have code).

## 2. Connect your project and push

In a terminal, from the **plc-programming-hub** folder:

```bash
cd "c:\Users\alber\Documents\Portfolio\plc-programming-hub"

# If this folder isn’t a git repo yet:
git init
git add .
git commit -m "Initial commit - PLC Programming Hub"

# Add your GitHub repo as origin (replace with your actual repo URL if different)
git remote add origin https://github.com/luc1342as2/PLCWebsite.git

# Push your main branch
git branch -M main
git push -u origin main
```

If the folder is already a git repo with a different remote, just make sure `origin` points to `https://github.com/luc1342as2/PLCWebsite.git`.

## 3. Build and deploy to the Pages branch

Still in **plc-programming-hub**:

```bash
npm install
npm run deploy
```

This will:

- Run `vite build` (creates the `dist` folder with `base: '/PLCWebsite/'`).
- Run `gh-pages -d dist` (pushes `dist` to the `gh-pages` branch of your repo).

## 4. Turn on GitHub Pages

1. Open **https://github.com/luc1342as2/PLCWebsite**
2. Go to **Settings** → **Pages** (left sidebar).
3. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages` → **/ (root)** → **Save**

After a minute or two, the site will be at:

**https://luc1342as2.github.io/PLCWebsite/**

## Later: update the live site

After you change code:

```bash
git add .
git commit -m "Your message"
git push
npm run deploy
```

Only `npm run deploy` updates the live site; it rebuilds and pushes the `gh-pages` branch again.
