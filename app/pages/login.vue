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
      // from の値は mounted 時に取得できない。
      // そのため、mounted 時に使うために Vuex の state に値を保持する
      store.dispatch('user/setLoginFrom', { from })
      store.dispatch('user/setLoginModal', { showLoginModal: true })

      await store.dispatch('article/getTopics')
      store.dispatch('article/resetArticleData')
    } catch (e) {
      store.dispatch('user/setLoginModal', { showLoginModal: false })
      error({ statusCode: 404 })
    }
  },
  mounted() {
    const from = this.$store.state.user.loginFrom
    if (from.name === 'oauth-authenticate') {
      setOAuthParams(from.query)
    } else {
      removeOAuthParams()
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
