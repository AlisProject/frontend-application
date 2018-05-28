<template>
  <top-page/>
</template>

<script>
import TopPage from '~/components/pages/TopPage'

export default {
  components: {
    TopPage
  },
  async fetch({ store }) {
    store.dispatch('user/setSignUpModal', { showSignUpModal: true })

    await store.dispatch('article/getPopularArticles')
  },
  mounted() {
    window.scrollTo(0, 0)
    document.querySelector('html,body').style.overflow = 'hidden'
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
