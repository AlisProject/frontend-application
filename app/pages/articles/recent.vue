<template>
  <new-article-list/>
</template>

<script>
import NewArticleList from '~/components/pages/NewArticleList'

export default {
  components: {
    NewArticleList
  },
  async fetch({ store, query, from = {}, error }) {
    try {
      // 新着記事の初期化
      // 人気・新着記事の切り替えを行った場合のみ記事データの初期化を行う。
      // 記事から遷移してきた場合は、スクロール位置を保持させたいので初期化はしない。
      if (from.name === 'articles-popular') {
        store.dispatch('article/resetArticleData')
      }

      store.dispatch('article/setArticleType', { articleType: 'newArticles' })
      const { topic } = query
      await store.dispatch('article/getTopics')
      store.dispatch('article/setTopicDisplayName', { topicName: topic })
      await store.dispatch('article/getNewPagesArticles', { topic })
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  head() {
    return {
      title: `${this.$store.state.article.topicDisplayName} - 新着記事`,
      meta: [
        {
          hid: `og:title`,
          property: 'og:title',
          content: `${this.$store.state.article.topicDisplayName} - 新着記事 | ALIS`
        },
        {
          hid: `og:description`,
          property: 'og:description',
          content: `${this.$store.state.article.topicDisplayName}の新着記事一覧`
        }
      ]
    }
  }
}
</script>
