<template>
  <top/>
</template>

<script>
import Top from '~/components/pages/Top'

export default {
  components: {
    Top
  },
  fetch({ store }) {
    store.dispatch('story/getAllStories')
  }
}
</script>
