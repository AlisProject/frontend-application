<template>
  <p class="area-description">
    <span class="liked_count">{{ notification.liked_count }}人</span>があなたの記事にいいねしました。"{{ notification.article_title }}"
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
  line-height: 1.4;
  margin: 0;
  overflow: hidden;
}

.liked_count {
  color: #040404;
}
</style>
