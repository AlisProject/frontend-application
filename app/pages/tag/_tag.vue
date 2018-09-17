<template>
  <tag-article-list/>
</template>

<script>
import TagArticleList from '~/components/pages/TagArticleList'

export default {
  components: {
    TagArticleList
  },
  async fetch({ store, params, error, from = {}, query }) {
    const { tag = null } = params

    // タグに関連する記事の初期化
    // 記事かユーザーページから遷移してきた場合、または
    // 現在表示中のタグに関連する記事のタグと、新しく取得するタグに関連する記事のタグが同じ場合は
    // スクロール位置を保持させたいので初期化はしない。
    if (
      (from.name !== 'user-articles-articleId' && from.name !== 'users-userId') ||
      store.state.article.tagArticles.currentTag !== tag ||
      query.from === 'articleTag'
    ) {
      store.dispatch('article/resetTagArticlesData')
      store.dispatch('presentation/setTagArticlesScrollHeight', { scrollHeight: 0 })
    }

    if (tag === null || (tag && tag.length > 25)) {
      error({ statusCode: 404 })
      return
    }

    try {
      await store.dispatch('article/getTagArticles', { tag })
    } catch (e) {
      error({ statusCode: 500 })
    }
  },
  head: {
    title: 'タグ'
  }
}
</script>
