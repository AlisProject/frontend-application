<template>
  <draft-story-list/>
</template>

<script>
import DraftStoryList from '~/components/pages/DraftStoryList'

export default {
  components: {
    DraftStoryList
  },
  fetch({ store }) {
    store.dispatch('story/getDraftStories', { userId: '1' })
  }
}
</script>
