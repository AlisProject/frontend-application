<template>
  <public-story-list/>
</template>

<script>
import PublicStoryList from '~/components/pages/PublicStoryList'

export default {
  components: {
    PublicStoryList
  },
  fetch({ store }) {
    store.dispatch('story/getPublicStories', { userId: '1' })
  }
}
</script>
