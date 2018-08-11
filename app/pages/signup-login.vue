<template>
  <popular-article-list/>
</template>

<script>
import PopularArticleList from '~/components/pages/PopularArticleList'

export default {
  components: {
    PopularArticleList
  },
  async fetch({ store }) {
    store.dispatch('user/setSignUpAuthFlowModal', { showSignUpAuthFlowModal: true })
    store.dispatch('user/setSignUpAuthFlowLoginModal', { isSignUpAuthFlowLoginModal: true })

    await store.dispatch('article/getPopularArticles')
  },
  mounted() {
    if (window.innerWidth <= 550) {
      document.querySelector('html,body').style.overflow = ''
    }
    history.replaceState(null, null, '/')
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
