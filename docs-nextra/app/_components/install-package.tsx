import type { FC } from 'react'
import styles from './controller-docs.module.css'

type InstallPackageProps = Readonly<{
  lang: 'en' | 'zh'
}>

const copy = {
  en: 'Install the package, then import its stylesheet once in your application entry point.',
  zh: '安装软件包，然后在应用入口文件中引入一次样式表。',
} as const

export const InstallPackage: FC<InstallPackageProps> = ({ lang }) => (
  <aside className={styles.install} aria-label={lang === 'zh' ? '安装' : 'Installation'}>
    <span className={styles.installBadge}>{lang === 'zh' ? '安装' : 'Package'}</span>
    <p className={styles.installCopy}>{copy[lang]}</p>
    <code className={styles.installCommand}>pnpm add @nafr/echo-ui</code>
  </aside>
)
