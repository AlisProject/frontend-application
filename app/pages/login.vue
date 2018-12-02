<template>
  <top-page />
</template>

<script>
import TopPage from '~/components/pages/TopPage'

export default {
  components: {
    TopPage
  },
  async fetch({ store, error }) {
    try {
      store.dispatch('user/setLoginModal', { showLoginModal: true })

      await store.dispatch('article/getTopics')
      store.dispatch('article/resetArticleData')
      await Promise.all([
        store.dispatch('article/getEyecatchArticles'),
        store.dispatch('article/getRecommendedArticles')
      ])
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
