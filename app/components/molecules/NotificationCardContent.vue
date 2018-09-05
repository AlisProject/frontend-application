<template>
  <div class="area-notification-card-content">
    <notification-card-content-description :notification="notification"/>
    <notification-card-content-updated-at :updatedAt="convertSortKeyToUnixTime"/>
  </div>
</template>

<script>
import NotificationCardContentDescription from '../atoms/NotificationCardContentDescription'
import NotificationCardContentUpdatedAt from '../atoms/NotificationCardContentUpdatedAt'

export default {
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  components: {
    NotificationCardContentDescription,
    NotificationCardContentUpdatedAt
  },
  computed: {
    convertSortKeyToUnixTime() {
      return Math.floor(this.notification.sort_key / 1000000)
    }
  }
}
</script>

<style lang="scss" scoped>
.area-notification-card-content {
  background: white;
  display: grid;
  grid-area: notification-card-content;
  grid-template-rows: auto auto;
  grid-gap: 6px;
  padding: 12px 12px 12px 0;
}
</style>
