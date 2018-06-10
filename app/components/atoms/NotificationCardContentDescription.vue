<template>
  <p class="area-description">
    {{ notification.liked_count }}人があなたの記事にいいねしました。"{{ notification.article_title }}"
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

@media screen and (max-width: 1296px) {
  .area-description {
    -webkit-line-clamp: 2;
    font-size: 12px;
  }
}
</style>
