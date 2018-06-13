<template>
  <section>
    <nuxt-link :to="`/${notification.user_id}/articles/${notification.article_id}`" class="notification-card-container">
      <notification-card-image />
      <notification-card-content :notification="notification"/>
    </nuxt-link>
  </section>
</template>

<script>
import NotificationCardImage from '../atoms/NotificationCardImage'
import NotificationCardContent from '../molecules/NotificationCardContent'

export default {
  props: {
    notification: {
      type: Object
    }
  },
  components: {
    NotificationCardImage,
    NotificationCardContent
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.notification-card-container {
  display: grid;
  grid-template-rows: 140px;
  grid-template-columns: 1fr 5fr;
  box-shadow: 0 0 10px #DDDDDD;
  /* prettier-ignore */
  grid-template-areas:
    "notification-card-image notification-card-content";
}

@media screen and (max-width: 640px) {
  .notification-card-container {
    grid-template-rows: 90px;
  }
}
</style>
