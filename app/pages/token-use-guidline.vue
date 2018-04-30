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
        property: 'og:title',
        content: 'ALISトークン利用ガイドライン | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'ALISトークン利用ガイドライン'
      }
    ]
  }
}
</script>
