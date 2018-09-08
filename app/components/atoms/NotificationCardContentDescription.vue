<template>
  <p class="area-description" v-if="notification.type === 'like'">
    <span class="liked_count">{{ notification.liked_count }}人</span>があなたの記事にいいねしました。"{{ notification.article_title }}"
  </p>
  <p class="area-description" v-else-if="notification.type === 'comment'">
    <span class="liked_count">{{ notification.userInfo.user_display_name }}</span>があなたの記事にコメントしました。"{{ notification.article_title }}"
  </p>
  <p class="area-description" v-else-if="notification.type === 'tip'">
    <span class="liked_count">{{ notification.userInfo.user_display_name }}</span>
    から
    <span class="liked_count">{{ notification.tip_value }}ALIS</span>
    受け取りました。"{{ notification.article_title }}"
  </p>
  <p class="area-description" v-else-if="notification.type === 'tip_error'">
    <span class="liked_count">{{ notification.userInfo.user_display_name }}</span>
    にトークンを贈れませんでした。"{{ notification.article_title }}"
  </p>
</template>

<script>
export default {
  props: {
    notification: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.area-description {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #7f7f7f;
  display: -webkit-box;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  overflow: hidden;
}

.liked_count {
  color: #040404;
}
</style>
