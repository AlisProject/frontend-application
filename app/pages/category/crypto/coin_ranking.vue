<template>
  <coin-ranking />
</template>

<script>
import CoinRanking from '~/components/pages/CoinRanking'

export default {
  components: {
    CoinRanking
  },
  head: {
    title: '時価総額ランキング',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: '時価総額ランキング | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '時価総額ランキング'
      }
    ]
  }
}
</script>
