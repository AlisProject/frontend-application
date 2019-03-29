<template>
  <div class="area-article-card-image">
    <img
      v-if="eyeCatchUrl === null"
      class="article-image"
      src="~assets/images/pc/common/thumbnail_noimg.png"
    >
    <img v-else class="article-image" :src="`${eyeCatchUrl}?d=592x296`">
  </div>
</template>

<script>
export default {
  props: {
    eyeCatchUrl: {
      type: String,
      required: false,
      default: null
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
