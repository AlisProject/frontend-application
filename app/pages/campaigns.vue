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
    title: 'NFTもらえる一覧',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'NFTもらえる一覧 | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'NFTもらえる一覧'
      }
    ]
  }
}
</script>
