// Generates a static dist/<route>/index.html for each entry in ROUTES,
// reusing the hashed script/css tags from the real Vite build output so
// the page still boots into the full React app for real visitors.
// Crawlers that don't execute JavaScript (AdSense/AdMob review bots,
// Googlebot's initial pass) see the real page content and unique
// title/meta description immediately instead of a blank shell.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const indexPath = join(distDir, 'index.html')

if (!existsSync(indexPath)) {
  console.error('[prerender] dist/index.html not found — run `vite build` first.')
  process.exit(1)
}

const template = readFileSync(indexPath, 'utf-8')

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function bodyToHtml(title, body) {
  const paragraphs = body
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join('\n        ')
  return `<h1>${escapeHtml(title)}</h1>\n        ${paragraphs}`
}

const ROUTES = [
  {
    path: 'privacy',
    title: 'Privacy Policy - Animal Joy',
    description:
      "Animal Joy's privacy policy: what account, content, and Lost & Found information we collect and how it's used.",
    contentModule: '../src/content/legalContent.js',
    exportName: 'privacyContent',
  },
  {
    path: 'terms',
    title: 'Terms of Service - Animal Joy',
    description:
      'Terms of service for using Animal Joy, including account rules, Lost & Found reports, acceptable use, and content ownership.',
    contentModule: '../src/content/legalContent.js',
    exportName: 'termsContent',
  },
  {
    path: 'about',
    title: 'About Us - Animal Joy',
    description:
      'About Animal Joy: a home for animal lovers with happy rescue stories, jokes, amazing facts, and a Lost & Found community.',
    contentModule: '../src/content/legalContent.js',
    exportName: 'aboutContent',
  },
  {
    path: 'contact',
    title: 'Contact Us - Animal Joy',
    description: "Get in touch with Animal Joy \u2014 questions, feedback, or anything else you'd like to share with us.",
    contentModule: '../src/content/legalContent.js',
    exportName: 'contactContent',
    noBody: true,
  },
]

const legalContent = await import(join(__dirname, '..', 'src', 'content', 'legalContent.js'))

for (const route of ROUTES) {
  const data = legalContent[route.exportName]
  const bodyHtml = route.noBody
    ? `<h1>${escapeHtml(data.title)}</h1>\n        <p>${escapeHtml(data.description)}</p>`
    : bodyToHtml(data.title, data.body)

  let html = template

  // Swap <title>
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(route.title)}</title>`)

  // Swap meta description
  html = html.replace(
    /<meta name="description" content=".*?"\s*\/>/,
    `<meta name="description" content="${escapeHtml(route.description)}" />`
  )

  // Add canonical link right after the description tag
  const canonicalUrl = `https://animaljoystories.com/${route.path}`
  html = html.replace(
    /(<meta name="description" content=".*?"\s*\/>)/,
    `$1\n    <link rel="canonical" href="${canonicalUrl}" />`
  )

  // JSON-LD structured data
  const jsonLd = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: route.title,
    description: route.description,
    url: canonicalUrl,
  })}</script>`
  html = html.replace('</head>', `    ${jsonLd}\n  </head>`)

  // Replace the #root fallback content with the real page content so
  // crawlers see it without running JS. Client React (createRoot) still
  // takes over and re-renders on load for real visitors.
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>\n(\s*)<noscript>/,
    `<div id="root">\n      <main style="font-family: sans-serif; max-width: 720px; margin: 60px auto; padding: 0 24px; color: #38332C;">\n        ${bodyHtml}\n      </main>\n    </div>\n$1<noscript>`
  )

  const outDir = join(distDir, route.path)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
  console.log(`[prerender] wrote dist/${route.path}/index.html`)
}
