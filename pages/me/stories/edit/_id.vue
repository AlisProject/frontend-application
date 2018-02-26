<template>
  <edit-article/>
</template>

<script>
import EditArticle from '~/components/pages/EditArticle'
import head from '~/utils/editor-head'

export default {
  components: {
    EditArticle
  },
  async fetch({ store, params }) {
    const { story_id: storyId } = params
    await store.dispatch('story/getEditStory', { storyId })
  },
  head
}
</script>
