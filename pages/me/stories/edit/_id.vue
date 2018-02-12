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
  fetch({ store, params }) {
    const { id } = params
    store.dispatch('story/getEditStory', { id })
  },
  head
}
</script>
