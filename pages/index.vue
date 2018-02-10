<template>
  <top/>
</template>

<script>
import Top from '~/components/pages/Top'
import * as types from '~/store/mutation-types'

export default {
  components: {
    Top
  },
  async fetch({ store }) {
    await store.dispatch('story/getAllStories')
    await store.dispatch('story/getUserInfos', { stories: store.state.story.stories })
    await store.dispatch('story/getAlisTokens', { stories: store.state.story.stories })
    store.commit('story/' + types.SET_USER_INFO_TO_STORIES, {
      stories: store.state.story.stories,
      userInfos: store.state.story.userInfos
    })
    store.commit('story/' + types.SET_ALIS_TOKEN_TO_STORIES, {
      stories: store.state.story.stories,
      alisTokens: store.state.story.alisTokens
    })
  }
}
</script>
