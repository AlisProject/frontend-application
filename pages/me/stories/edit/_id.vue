<template>
  <edit-story/>
</template>

<script>
import EditStory from '~/components/pages/EditStory'
import head from '~/utils/editor-head'

export default {
  components: {
    EditStory
  },
  async fetch({ store, params }) {
    const { story_id: storyId } = params
    await store.dispatch('story/getEditStory', { storyId })
  },
  head
}
</script>
