<template>
  <div class="area-notification-list-container">
    <notification-card
      v-for="notification in notifications"
      :notification="notification"
      :key="notification.sort_key"
    />
  </div>
</template>

<script>
import NotificationCard from '../organisms/NotificationCard'

export default {
  components: {
    NotificationCard
  },
  props: ['notifications']
}
</script>

<style lang="scss" scoped>
.area-notification-list-container {
  display: grid;
  grid-area: notification-card-list;
  grid-gap: 14px;
}

@media screen and (max-width: 640px) {
  .area-notification-list-container {
    grid-gap: 10px;
  }
}
</style>
