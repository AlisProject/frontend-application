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
    this.$store.dispatch('user/putUnreadNotification')
  },
  head: {
    title: 'お知らせ一覧'
  }
}
</script>
