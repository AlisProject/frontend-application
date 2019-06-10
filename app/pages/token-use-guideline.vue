<template>
  <token-use-guideline />
</template>

<script>
import TokenUseGuideline from '~/components/pages/TokenUseGuideline'

export default {
  components: {
    TokenUseGuideline
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
