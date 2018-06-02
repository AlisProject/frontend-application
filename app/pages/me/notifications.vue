<template>
  <notification-page/>
</template>

<script>
import NotificationPage from '~/components/pages/NotificationPage'

export default {
  components: {
    NotificationPage
  },
  mounted() {
    this.$store.dispatch('user/getNotifications')
  },
  head: {
    title: 'お知らせ一覧'
  }
}
</script>
