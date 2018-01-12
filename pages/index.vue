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
    store.dispatch('getStories')
  }
}
</script>
