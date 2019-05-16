<template>
  <top-page />
</template>

<script>
import TopPage from '~/components/pages/TopPage'
import { setOAuthParams, removeOAuthParams } from '~/utils/oauth'

export default {
  components: {
    TopPage
  },
  async fetch({ store, error, from = {} }) {
    try {
      if (process.client) {
        if (from.name === 'oauth-authenticate') {
          setOAuthParams(from.query)
        } else {
          removeOAuthParams()
        }
      }

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
