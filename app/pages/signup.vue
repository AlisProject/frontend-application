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
      store.dispatch('user/setSignUpModal', { showSignUpModal: true })

      await store.dispatch('article/getTopics')
      store.dispatch('article/resetArticleData')
    } catch (e) {
      store.dispatch('user/setSignUpModal', { showSignUpModal: false })
      error({ statusCode: 404 })
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
