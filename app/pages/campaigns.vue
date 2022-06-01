<template>
  <campaigns />
</template>

<script>
import Campaigns from '~/components/pages/Campaigns'

export default {
  components: {
    Campaigns
  },
  head: {
    title: 'NFTもらえるコラボ一覧',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'NFTもらえるコラボ一覧 | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'NFTもらえるコラボ一覧'
      }
    ]
  }
}
</script>
