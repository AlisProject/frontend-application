<template>
  <esports />
</template>

<script>
import Esports from '~/components/pages/Esports'

export default {
  components: {
    Esports
  },
  head: {
    title: 'GameFi大会一覧',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'GameFi大会一覧 | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'GameFi大会一覧'
      }
    ]
  }
}
</script>
