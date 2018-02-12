<template>
  <new-story-list/>
</template>

<script>
import NewStoryList from '~/components/pages/NewStoryList'
import * as types from '~/store/mutation-types'

export default {
  components: {
    NewStoryList
  },
  async fetch({ store }) {
    await store.dispatch('story/getNewPagesStories')
    const { newStories: stories } = store.state.story
    await store.dispatch('story/getUserInfos', { stories })
    await store.dispatch('story/getAlisTokens', { stories })
    const { userInfos, alisTokens } = store.state.story
    const type = 'new'
    store.commit('story/' + types.SET_USER_INFO_TO_STORIES, {
      stories,
      userInfos,
      type
    })
    store.commit('story/' + types.SET_ALIS_TOKEN_TO_STORIES, {
      stories,
      alisTokens,
      type
    })
  }
}
</script>
