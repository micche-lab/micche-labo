/* サーバー上でのみ実行 */
import 'server-only'
import { cache } from 'react'
import { createClient } from 'newt-client-js'
import type { Article } from '@/types/article'

/* 環境変数を入力 */
const client = createClient({
  spaceUid: process.env.NEWT_SPACE_UID + '',
  token: process.env.NEWT_CDN_API_TOKEN + '',
  apiType: 'cdn',
})

/*
投稿一覧の取得メソッド
cacheで囲んで余計なリクエストを送らないようにする
*/
export const getArticles = cache(async() => {
    const { items } = await client.getContents<Article>({
        appUid: 'blog',
        modelUid: 'article',
        query:{
            select: ['_id','title','slug','body'],
        },
    })
    return items
})

/*
詳細ページの取得メソッド
cacheで囲んで余計なリクエストを送らないようにする
getFirstContentで該当するコンテンツの最初の１件を返却
*/

export const getArticleBySlug = cache(async (slug: string) => {
    const article = await client.getFirstContent<Article>({
        appUid: 'blog',
        modelUid: 'article',
        query: {
            slug,
            select:['_id','title','slug','body'],
        },
    })
    return article
})