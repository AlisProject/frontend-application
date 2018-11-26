<template>
  <popular-article-list/>
</template>

<script>
import PopularArticleList from '~/components/pages/PopularArticleList'

export default {
  components: {
    PopularArticleList
  },
  async fetch({ store, error }) {
    try {
      store.dispatch('user/setLoginModal', { showLoginModal: true })

      const topic = 'crypto'
      await store.dispatch('article/getTopics')
      store.dispatch('article/resetArticleData')
      await store.dispatch('article/getPopularArticles', { topic })
    } catch (e) {
      store.dispatch('user/setLoginModal', { showLoginModal: false })
      error({ statusCode: 404 })
    }
  },
  head: {
    title: 'ログイン',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'ログイン | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'ログイン'
      }
    ]
  }
}
</script>
