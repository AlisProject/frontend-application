<template>
  <token-use-guidline/>
</template>

<script>
import TokenUseGuidline from '~/components/pages/TokenUseGuidline'

export default {
  components: {
    TokenUseGuidline
  },
  head: {
    title: 'ALISトークン利用ガイドライン',
    meta: [
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'ALISトークン利用ガイドライン | ALIS'
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'ALISトークン利用ガイドライン'
      }
    ]
  }
}
</script>
