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
    // 人気記事の初期化
    // 人気・新着記事の切り替えを行った場合のみ記事データの初期化を行う。
    // 記事から遷移してきた場合は、スクロール位置を保持させたいので初期化はしない。
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
    const { topicDisplayName } = this.$store.state.article
    const isTopPage = topicDisplayName === 'クリプト'
    const topPageTitle = 'ALIS - A Rewards System to Distinguish Trustworthy Articles.'
    return {
      title: isTopPage ? topPageTitle : `${topicDisplayName} - 人気記事`,
      titleTemplate: isTopPage ? '' : '%s | ALIS',
      meta: [
        {
          hid: `og:title`,
          property: 'og:title',
          content: isTopPage ? topPageTitle : `${topicDisplayName} - 人気記事 | ALIS`
        },
        {
          hid: `og:description`,
          property: 'og:description',
          content: isTopPage
            ? `ALIS is Japan's First Social Media Using Blockchain Technology`
            : `${topicDisplayName}の人気記事一覧`
        }
      ]
    }
  }
}
</script>
