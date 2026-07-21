import Link from 'next/link'

export default function LanguageLandingPage() {
  return (
    <main className="language-landing">
      <p className="language-landing__eyebrow">Echo UI documentation</p>
      <h1>Choose your documentation language</h1>
      <p>选择文档语言以继续浏览 Echo UI 的 Nextra 迁移预览。</p>
      <nav aria-label="Documentation languages">
        <Link href="/en">English</Link>
        <Link href="/zh">简体中文</Link>
      </nav>
    </main>
  )
}
