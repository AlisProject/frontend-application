<template>
  <draft-article-list/>
</template>

<script>
import DraftArticleList from '~/components/pages/DraftArticleList'
import * as types from '~/store/mutation-types'

export default {
  components: {
    DraftArticleList
  },
  async fetch({ store }) {
    await store.dispatch('article/getDraftArticles', { userId: '1' })
    const { draftArticles: articles } = store.state.article
    await store.dispatch('article/getUserInfos', { articles })
    await store.dispatch('article/getAlisTokens', { articles })
    const { userInfos, alisTokens } = store.state.article
    const type = 'public'
    store.commit(`article/${types.SET_USER_INFO_TO_STORIES}`, {
      articles,
      userInfos,
      type
    })
    store.commit(`article/${types.SET_ALIS_TOKEN_TO_STORIES}`, {
      articles,
      alisTokens,
      type
    })
  }
}
</script>
