<template>
  <section>
    <nuxt-link :to="`/${notification.user_id}/articles/${notification.article_id}`" class="notification-card-container">
      <notification-card-image :notification="notification"/>
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
  box-shadow: 0 0 8px 0 rgba(192, 192, 192, 0.5);
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "notification-card-image notification-card-content";
  grid-template-columns: 1fr 5fr;
  grid-template-rows: 140px;
  transition: all 400ms ease;

  &:hover {
    box-shadow: 0 0 8px 0 rgba(133, 141, 218, 0.5);

    &:active {
      box-shadow: 0 0 4px 0 rgba(133, 141, 218, 0.5);
    }
  }
}

@media screen and (max-width: 640px) {
  .notification-card-container {
    grid-template-rows: 90px;
  }
}
</style>
