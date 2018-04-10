<template>
  <div class="area-article-card-image">
    <img
      class="article-image"
      src="~assets/images/pc/common/thumbnail_noimg.png"
      v-if="this.eyeCatchUrl === null">
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
  overflow: hidden;

  .article-image {
    width: 100%;
    max-width: 100%;
  }
}

.long-article-card .area-article-card-image {
  grid-area: long-article-card-image;

  .article-image {
    height: 270px;
    object-fit: cover;
    object-position: 0%;
    width: 540px;
  }
}

@media screen and (max-width: 1296px) {
  .long-article-card .area-article-card-image {
    .article-image {
      height: 178px;
      width: 355px;
    }
  }
}

@media screen and (max-width: 920px) {
  .long-article-card {
    .area-article-card-image {
      grid-area: article-card-image;
    }
  }
}

@media screen and (max-width: 550px) {
  .long-article-card {
    .area-article-card-image {
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;

      .article-image {
        width: 100%;
      }
    }
  }

  .area-article-card-image {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;

    .article-image {
      width: 100%;
    }
  }
}
</style>
