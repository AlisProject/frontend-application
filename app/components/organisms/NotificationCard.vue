<template>
  <section>
    <a :href="`/me/articles/public/${this.notification.article_id}`" class="notification-card-container">
      <notification-card-image :iconUrl="notification.actedUserInfo.icon_image_url"/>
      <notification-card-content :notification="notification"/>
    </a>
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
  grid-template-columns: 1fr 4fr;
  box-shadow: 0 0 10px #DDDDDD;
  /* prettier-ignore */
  grid-template-areas:
    "notification-card-image notification-card-content";
}

@media screen and (max-width: 1296px) {
}

@media screen and (max-width: 920px) {
  .notification-card-container {
    grid-template-columns: 1fr 3fr;
  }
}

@media screen and (max-width: 550px) {
}
</style>
