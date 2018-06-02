<template>
  <p class="area-description">
    {{notification.actedUserInfo.user_display_name}}さんが"{{ notification.article_title }}"にいいねしました。
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
  line-height: 20px;
  margin: 0;
  overflow: hidden;
}

@media screen and (max-width: 1296px) {
  .area-description {
    -webkit-line-clamp: 2;
    font-size: 12px;
    line-height: 24px;
  }
}

@media screen and (max-width: 550px) {
  .long-notification-card {
    .area-overview {
      line-height: 18px;
    }
  }
}
</style>
