<template>
  <public-article-list/>
</template>

<script>
import PublicArticleList from '~/components/pages/PublicArticleList'
import * as types from '~/store/mutation-types'

export default {
  components: {
    PublicArticleList
  },
  async fetch({ store }) {
    await store.dispatch('story/getPublicStories', { userId: '1' })
    const { publicStories } = store.state.story
    await store.dispatch('story/getUserInfos', { stories: publicStories })
    await store.dispatch('story/getAlisTokens', { stories: publicStories })
    const { userInfos, alisTokens } = store.state.story
    store.commit(`story/${types.SET_USER_INFO_TO_STORIES}`, {
      stories: publicStories,
      userInfos,
      type: 'public'
    })
    store.commit(`story/${types.SET_ALIS_TOKEN_TO_STORIES}`, {
      stories: publicStories,
      alisTokens,
      type: 'public'
    })
  }
}
</script>
