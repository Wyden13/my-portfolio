This is a personal portfolio built with [Next.js](https://nextjs.org).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy to GitHub Pages

1. In the repository, go to **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to the `main` branch (or run the **Deploy to GitHub Pages** workflow manually from the Actions tab).
4. After deployment, your site will be available at:
   - `https://<username>.github.io/my-portfolio/`

This repository is configured to export a static Next.js build and deploy it through `.github/workflows/deploy-pages.yml`.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
