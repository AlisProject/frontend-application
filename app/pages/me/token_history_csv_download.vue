<template>
  <token-history-csv-download />
</template>

<script>
import TokenHistoryCsvDownload from '~/components/pages/TokenHistoryCsvDownload'

export default {
  components: {
    TokenHistoryCsvDownload
  },
  head: {
    title: '全トークン履歴のダウンロード',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: '全トークン履歴のダウンロード | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '全トークン履歴のダウンロード'
      }
    ]
  }
}
</script>
