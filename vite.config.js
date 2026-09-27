import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production is indexable; local and Vercel previews retain noindex.
const productionRelease = process.env.VERCEL_ENV === 'production'
export default defineConfig({
  plugins: [react(), {
    name: 'velaire-release-metadata',
    transformIndexHtml(html) {
      return productionRelease ? html.replace('content="noindex, nofollow"', 'content="index, follow"') : html
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: productionRelease
        ? 'User-agent: *\nAllow: /\nSitemap: https://velaireco.com/sitemap.xml\n'
        : 'User-agent: *\nDisallow: /\n' })
    }
  }],
})
