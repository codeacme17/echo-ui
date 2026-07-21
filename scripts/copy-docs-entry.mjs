import { copyFileSync, existsSync } from 'node:fs'

const renderedPages = ['docs/.island/dist/en/index.html', 'docs/.island/dist/zh/index.html']

for (const page of renderedPages) {
  if (!existsSync(page)) {
    throw new Error(`Documentation build did not render ${page}`)
  }
}

copyFileSync('docs/.island/index.html', 'docs/.island/dist/index.html')
