<template>
  <create-story/>
</template>

<script>
import CreateStory from '~/components/pages/CreateStory'
import head from '~/utils/editor-head'

export default {
  components: {
    CreateStory
  },
  head
}
</script>
