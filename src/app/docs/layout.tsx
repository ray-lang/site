import type { ReactNode } from 'react'
import { Layout } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const pageMap = await getPageMap()
  return (
    <Layout
      pageMap={pageMap}
      docsRepositoryBase="https://github.com/ray-lang/site/blob/main"
    >
      {children}
    </Layout>
  )
}
