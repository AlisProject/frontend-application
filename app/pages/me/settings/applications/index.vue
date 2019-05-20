<template>
  <application-list />
</template>

<script>
import ApplicationList from '~/components/pages/ApplicationList'
import { isMobile } from '~/utils/device'

export default {
  components: {
    ApplicationList
  },
  async mounted() {
    if (isMobile()) this.$router.replace('/')
    await this.$store.dispatch('user/getApplications')
  },
  head: {
    title: '登録中のアプリケーション一覧',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: '登録中のアプリケーション一覧 | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '登録中のアプリケーション一覧'
      }
    ]
  }
}
</script>
