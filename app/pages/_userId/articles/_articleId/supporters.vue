<template>
  <tip-supporters />
</template>

<script>
import TipSupporters from '~/components/pages/TipSupporters'

export default {
  components: {
    TipSupporters
  },
  head: {
    title: 'サポーター一覧',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'サポーター一覧 | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'サポーター一覧'
      }
    ]
  }
}
</script>
