<template>
  <connected-application-list />
</template>

<script>
import ConnectedApplicationList from '~/components/pages/ConnectedApplicationList'

export default {
  components: {
    ConnectedApplicationList
  },
  async mounted() {
    await this.$store.dispatch('user/getConnectedApplications')
  },
  head: {
    title: '連携中のアプリケーション一覧',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: '連携中のアプリケーション一覧 | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '連携中のアプリケーション一覧'
      }
    ]
  }
}
</script>
