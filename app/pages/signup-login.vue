<template>
  <no-ssr>
    <top-page />
  </no-ssr>
</template>

<script>
import TopPage from '~/components/pages/TopPage'

export default {
  components: {
    TopPage
  },
  async fetch({ store, error }) {
    try {
      store.dispatch('user/setSignUpAuthFlowModal', { showSignUpAuthFlowModal: true })
      store.dispatch('user/setSignUpAuthFlowLoginModal', { isSignUpAuthFlowLoginModal: true })

      await store.dispatch('article/getTopics')
      store.dispatch('article/resetArticleData')
    } catch (e) {
      store.dispatch('user/setSignUpAuthFlowModal', { showSignUpAuthFlowModal: false })
      store.dispatch('user/setSignUpAuthFlowLoginModal', { isSignUpAuthFlowLoginModal: false })
      error({ statusCode: 404 })
    }
  },
  mounted() {
    if (window.innerWidth <= 550) {
      document.querySelector('html,body').style.overflow = ''
    }
  },
  head: {
    title: 'サインアップ',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'サインアップ | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'サインアップ'
      }
    ]
  }
}
</script>
