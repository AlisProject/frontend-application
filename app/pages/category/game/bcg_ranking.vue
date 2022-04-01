<template>
  <bcg-ranking />
</template>

<script>
import BcgRanking from '~/components/pages/BcgRanking'

export default {
  components: {
    BcgRanking
  },
  head: {
    title: 'BCG月間ランキング',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'BCG月間ランキング | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'BCG月間ランキング'
      }
    ]
  }
}
</script>
