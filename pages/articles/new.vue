<template>
  <new-article-list/>
</template>

<script>
import NewArticleList from '~/components/pages/NewArticleList'
import * as types from '~/store/mutation-types'

export default {
  components: {
    NewArticleList
  },
  async fetch({ store }) {
    await store.dispatch('article/getNewPagesArticles')
    const { newArticles: articles } = store.state.article
    await store.dispatch('article/getUserInfos', { articles })
    await store.dispatch('article/getAlisTokens', { articles })
    const { userInfos, alisTokens } = store.state.article
    const type = 'new'
    store.commit('article/' + types.SET_USER_INFO_TO_STORIES, {
      articles,
      userInfos,
      type
    })
    store.commit('article/' + types.SET_ALIS_TOKEN_TO_STORIES, {
      articles,
      alisTokens,
      type
    })
  }
}
</script>
