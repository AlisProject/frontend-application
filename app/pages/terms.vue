<template>
  <terms-of-service/>
</template>

<script>
import TermsOfService from '~/components/pages/TermsOfService'

export default {
  components: {
    TermsOfService
  },
  head: {
    title: '利用規約',
    meta: [
      {
        hid: 'og:title',
        name: 'og:title',
        content: '利用規約 | ALIS'
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: '利用規約'
      }
    ]
  }
}
</script>
