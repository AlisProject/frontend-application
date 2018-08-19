<template>
  <new-article-list/>
</template>

<script>
import NewArticleList from '~/components/pages/NewArticleList'

export default {
  components: {
    NewArticleList
  },
  async fetch({ store, query, from = {} }) {
    // 人気・新着記事の切り替えをセレクトボックスで行った場合は記事データがリセットされるが、
    // その後人気記事一覧ページから新着記事一覧ページへブラウザの戻るボタンで戻った場合は
    // 記事データがリセットされない。
    // 記事データをリセットしないと、取得する記事のページ情報が正しくないため
    // 記事が表示されなくなってしまう。
    if (from.name === 'articles-popular') {
      store.dispatch('article/resetArticleData')
    }
    store.dispatch('article/setArticleType', { articleType: 'newArticles' })
    const { topic } = query
    await store.dispatch('article/getTopics')
    store.dispatch('article/setTopicDisplayName', { topicName: topic })
    await store.dispatch('article/getNewPagesArticles', { topic })
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
