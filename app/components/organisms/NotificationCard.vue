<template>
  <section>
    <nuxt-link
      :to="`/users/${notification.acted_user_id}`"
      class="notification-card-container"
      v-if="notification.type === 'tip'">
      <notification-card-image :notification="notification"/>
      <notification-card-content :notification="notification"/>
    </nuxt-link>
    <nuxt-link
      :to="articlePath"
      class="notification-card-container"
      v-else>
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
  },
  computed: {
    articlePath() {
      switch (this.notification.type) {
        case 'tip_error':
          return `/${this.notification.article_user_id}/articles/${this.notification.article_id}`
        case 'comment':
        case 'reply':
        case 'thread':
          // 記事のコメント欄に遷移する（#article-comments）
          return `/${this.notification.user_id}/articles/${
            this.notification.article_id
          }/#article-comments`
        default:
          return `/${this.notification.user_id}/articles/${this.notification.article_id}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.notification-card-container {
  @include cassette-shadow();
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "notification-card-image notification-card-content";
  grid-template-columns: auto 5fr;
  grid-template-rows: auto;
  border-radius: 4px;
}
</style>
