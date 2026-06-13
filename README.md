# Sukanya — Portfolio & Case Studies

Static portfolio site (no build step). Plain HTML/CSS/JS, ready for GitHub Pages.

## Structure
```
.
├── index.html                  # Home (portfolio)
├── capri.html                  # Capri Loans case study
├── crm.html                    # Fintech CRM case study
├── technical-valuation.html    # Technical Valuation case study
├── css/                        # one stylesheet per page
│   ├── index.css
│   ├── capri.css
│   ├── crm.css
│   └── technical-valuation.css
├── js/                         # one script per page
│   ├── index.js
│   ├── capri.js
│   ├── crm.js
│   └── technical-valuation.js
├── assets/
│   ├── thumbs/                 # video thumbnails
│   │   ├── customer-testimonial.jpg
│   │   └── collection-drive.jpg
│   └── docs/
│       └── Sukanya_Resume.pdf  # downloaded by the nav "Download Resume" button
├── .nojekyll                   # serve files/folders as-is on GitHub Pages
└── .gitignore
```

Notes:
- Page imagery is embedded (base64) inside each HTML file — no separate image folder needed.
- Videos are hosted on Cloudinary and referenced by URL, so no large media files live in the repo.
- All links are **relative**, so the site works whether it's served from a user site or a project subpath.

## Deploy to GitHub Pages
1. Create a repository (e.g. `sukanya-portfolio`) and push these files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/<username>/sukanya-portfolio.git
   git push -u origin main
   ```
2. In the repo, go to **Settings → Pages → Build and deployment**.
3. Set **Source: Deploy from a branch**, **Branch: `main`**, **Folder: `/ (root)`**, then **Save**.
4. Your site goes live at:
   `https://<username>.github.io/sukanya-portfolio/`
   (or `https://<username>.github.io/` if you name the repo `<username>.github.io`).

First publish can take 1–2 minutes.
