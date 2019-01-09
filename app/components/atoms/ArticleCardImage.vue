<template>
  <div class="area-article-card-image">
    <img
      class="article-image"
      src="~assets/images/pc/common/thumbnail_noimg.png"
      v-if="eyeCatchUrl === null">
    <img
      class="article-image"
      :src="eyeCatchUrl"
      v-else>
  </div>
</template>

<script>
export default {
  props: {
    eyeCatchUrl: {
      type: String,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
.area-article-card-image {
  grid-area: article-card-image;
  background: #fff;
  overflow: hidden;

  .article-image {
    height: 100%;
    max-width: 100%;
    object-fit: cover;
    width: 100%;
  }
}
</style>
