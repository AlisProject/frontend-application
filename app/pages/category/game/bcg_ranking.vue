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
    title: 'ブロックチェーンゲーム-ランキング',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'ブロックチェーンゲーム-ランキング | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'ブロックチェーンゲーム-ランキング'
      }
    ]
  }
}
</script>
