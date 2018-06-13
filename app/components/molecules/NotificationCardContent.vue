<template>
  <div class="area-notification-card-content">
    <notification-card-content-description :notification="notification"/>
    <notification-card-content-created-at :createdAt="convertSortKeyToUnixTime"/>
  </div>
</template>

<script>
import NotificationCardContentDescription from '../atoms/NotificationCardContentDescription'
import NotificationCardContentCreatedAt from '../atoms/NotificationCardContentCreatedAt'

export default {
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  components: {
    NotificationCardContentDescription,
    NotificationCardContentCreatedAt
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
  grid-template-rows: 2fr 1fr;
  grid-gap: 6px;
  padding: 36px 12px;
  position: relative;
}

@media screen and (max-width: 640px) {
  .area-notification-card-content {
    grid-template-rows: 3fr 1fr;
    padding: 16px 12px;
  }
}
</style>
