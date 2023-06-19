/*  
Next.jsでは [param] のようにして
ページ名に角括弧を使うことで
動的なルーティング（Dynamic Routes）を作成できる。

/articles/:slug（/articles/article-1 など）
のパスで投稿の詳細を表示したいので、
app/articles/[slug]/page.tsx 
のファイルを作成
*/

import { getArticles, getArticleBySlug } from '@/lib/newt'
import styles from '@/app/page.module.css'
import type { Metadata } from 'next'
import type { Article } from '@/types/article'

type Props = {
  params: {
    slug: string
  }
}

/*
generateStaticParamsでビルド時に静的にルート生成
以下は全投稿のスラッグを定義
*/
export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

/*
falseで定義されていないパスアクセスで404返却
*/
export const dynamicParams = false


/*
動的にメタデータ生成
generateMetadata利用でtitleとdescription設定
getArticleBySlug で取得した投稿から詳細ページを表示
*/
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params
  const article = await getArticleBySlug(slug)

  return {
    title: article?.title,
    description: '投稿詳細ページです',
  }
}

export default async function Article({ params }: Props) {
  const { slug } = params
  const article = await getArticleBySlug(slug)
  if (!article) return

  return (
    <main className={styles.main}>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.body }} />
    </main>
  )
}