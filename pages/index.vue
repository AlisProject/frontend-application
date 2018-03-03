<template>
  <top-page/>
</template>

<script>
import TopPage from '~/components/pages/TopPage'
import * as types from '~/store/mutation-types'

export default {
  components: {
    TopPage
  },
  async fetch({ store }) {
    await store.dispatch('article/getAllArticles')
    await store.dispatch('article/getUserInfos', { articles: store.state.article.articles })
    await store.dispatch('article/getAlisTokens', { articles: store.state.article.articles })
    store.commit('article/' + types.SET_USER_INFO_TO_ARTICLES, {
      articles: store.state.article.articles,
      userInfos: store.state.article.userInfos
    })
    store.commit('article/' + types.SET_ALIS_TOKEN_TO_ARTICLES, {
      articles: store.state.article.articles,
      alisTokens: store.state.article.alisTokens
    })
  }
}
</script>
