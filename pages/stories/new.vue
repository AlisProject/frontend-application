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
