import type { FC } from 'react'

type InstallPackageProps = Readonly<{
  lang: 'en' | 'zh'
}>

export const InstallPackage: FC<InstallPackageProps> = ({ lang }) => (
  <h2 id="import">{lang === 'zh' ? '导入' : 'Import'}</h2>
)
