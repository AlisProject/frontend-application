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

    const topic = 'crypto'
    await store.dispatch('article/getTopics')
    store.dispatch('article/resetArticleData')
    await store.dispatch('article/getPopularArticles', { topic })
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
