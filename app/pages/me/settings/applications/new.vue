<template>
  <create-application />
</template>

<script>
import CreateApplication from '~/components/pages/CreateApplication'
import { isMobile } from '~/utils/device'

export default {
  components: {
    CreateApplication
  },
  mounted() {
    if (isMobile()) this.$router.replace('/')
  },
  head: {
    title: 'アプリケーションの登録',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'アプリケーションの登録 | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'アプリケーションの登録'
      }
    ]
  }
}
</script>
