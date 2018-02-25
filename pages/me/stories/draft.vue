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
    await store.dispatch('story/getDraftStories', { userId: '1' })
    const { draftStories: stories } = store.state.story
    await store.dispatch('story/getUserInfos', { stories })
    await store.dispatch('story/getAlisTokens', { stories })
    const { userInfos, alisTokens } = store.state.story
    const type = 'public'
    store.commit(`story/${types.SET_USER_INFO_TO_STORIES}`, {
      stories,
      userInfos,
      type
    })
    store.commit(`story/${types.SET_ALIS_TOKEN_TO_STORIES}`, {
      stories,
      alisTokens,
      type
    })
  }
}
</script>
