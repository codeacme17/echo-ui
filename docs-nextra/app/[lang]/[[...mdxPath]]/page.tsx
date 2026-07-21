import { generateStaticParamsFor, importPage } from 'nextra/pages'
import type { FC } from 'react'
import { useMDXComponents as getMDXComponents } from '../../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

type PageProps = Readonly<{
  params: Promise<{
    lang: string
    mdxPath: string[]
  }>
}>

export async function generateMetadata({ params }: PageProps) {
  const { lang, mdxPath } = await params
  const { metadata } = await importPage(mdxPath, lang)

  return metadata
}

const Wrapper = getMDXComponents().wrapper

const Page: FC<PageProps> = async (props) => {
  const params = await props.params
  const {
    default: MDXContent,
    metadata,
    sourceCode,
    toc,
  } = await importPage(params.mdxPath, params.lang)

  return (
    <Wrapper metadata={metadata} sourceCode={sourceCode} toc={toc}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}

export default Page
