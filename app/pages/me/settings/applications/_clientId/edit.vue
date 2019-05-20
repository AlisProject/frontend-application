<template>
  <edit-application />
</template>

<script>
import EditApplication from '~/components/pages/EditApplication'
import { isMobile } from '~/utils/device'

export default {
  components: {
    EditApplication
  },
  mounted() {
    if (isMobile()) this.$router.replace('/')
  },
  head: {
    title: 'アプリケーションの編集',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'アプリケーションの編集 | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'アプリケーションの編集'
      }
    ]
  }
}
</script>
