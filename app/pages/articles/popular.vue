<template>
  <popular-article-list/>
</template>

<script>
import PopularArticleList from '~/components/pages/PopularArticleList'

export default {
  components: {
    PopularArticleList
  },
  async fetch({ store, query, from = {} }) {
    // 人気・新着記事の切り替えをセレクトボックスで行った場合は記事データがリセットされるが、
    // その後新着記事一覧ページから人気記事一覧ページへブラウザの戻るボタンで戻った場合は
    // 記事データがリセットされない。
    // 記事データをリセットしないと、取得する記事のページ情報が正しくないため
    // 記事が表示されなくなってしまう。
    if (from.name === 'articles-recent') {
      store.dispatch('article/resetArticleData')
    }
    store.dispatch('article/setArticleType', { articleType: 'popularArticles' })
    const { topic } = query
    await store.dispatch('article/getTopics')
    store.dispatch('article/setTopicDisplayName', { topicName: topic })
    await store.dispatch('article/getPopularArticles', { topic })
  },
  head() {
    return {
      title: `${this.$store.state.article.topicDisplayName} - 人気記事`,
      meta: [
        {
          hid: `og:title`,
          property: 'og:title',
          content: `${this.$store.state.article.topicDisplayName} - 人気記事 | ALIS`
        },
        {
          hid: `og:description`,
          property: 'og:description',
          content: `${this.$store.state.article.topicDisplayName}の人気記事一覧`
        }
      ]
    }
  }
}
</script>
