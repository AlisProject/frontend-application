<template>
  <article-detail :story="this.$store.state.story.story"/>
</template>

<script>
import ArticleDetail from '~/components/pages/ArticleDetail'
import * as types from '~/store/mutation-types'

export default {
  components: {
    ArticleDetail
  },
  async fetch({ store, params }) {
    const { story_id: storyId, user_id: userId } = params
    await store.dispatch('story/getStoryDetail', { storyId })
    await store.dispatch('story/getUserInfo', { userId })
    await store.dispatch('story/getLikesCountOfStory', { storyId })
    await store.dispatch('story/getAlisToken', { storyId })
    const { userInfo, likesCount, alisToken } = store.state.story
    store.commit(`story/${types.SET_USER_INFO_TO_STORY}`, {
      userInfo
    })
    store.commit(`story/${types.SET_LIKES_COUNT_TO_STORY}`, {
      likesCount
    })
    store.commit(`story/${types.SET_ALIS_TOKEN_TO_STORY}`, {
      alisToken
    })
  }
}
</script>
