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
      store.dispatch('user/setSignUpModal', { showSignUpModal: true })

      const topic = 'crypto'
      await store.dispatch('article/getTopics')
      store.dispatch('article/resetArticleData')
      await store.dispatch('article/getPopularArticles', { topic })
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
