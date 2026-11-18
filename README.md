# Motive

Motive is a concept website for a social hangout-planning app. It helps groups combine budgets, preferred areas, moods, and other filters to discover ideas everyone can agree on.

## Website

This is a static site built with HTML, CSS, and vanilla JavaScript. No build step or package installation is required.

### Pages
- **Home** — product introduction
- **Features** — concept overview and how it works
- **Pricing** — sample plan page
- **Team** — project team information

## Run locally

Open `index.html` in your browser, or run a static server from the repository root:

```bash
python -m http.server 8000
```

Visit [http://localhost:8000](http://localhost:8000).

## Publish with GitHub Pages

1. Push changes to `main`.
2. Open repository **Settings → Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. The included `.github/workflows/pages.yml` workflow deploys the static site on pushes to `main`.

No build command is needed. The existing HTML pages, stylesheets, scripts, images, and mockups are served directly.
