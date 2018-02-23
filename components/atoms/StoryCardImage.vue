<template>
  <div class="area-article-card-image">
    <img class="story-image" src='~assets/images/top-story-card-image.png'>
    <!-- TODO: data属性からCSSに渡す -->
    <!-- <div class="image" :data-image-url="story.imageUrl"></div> -->
  </div>
</template>

<style lang="scss" scoped>
.area-article-card-image {
  grid-area: article-card-image;
  overflow: hidden;

  .story-image {
    width: 100%;
    max-width: 100%;
  }
}

.long-article-card .area-article-card-image {
  grid-area: long-article-card-image;

  .story-image {
    height: 270px;
    object-fit: cover;
    object-position: 0%;
    width: 540px;
  }
}

@media screen and (max-width: 1296px) {
  .long-article-card .area-article-card-image {
    .story-image {
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

      .story-image {
        width: 100%;
      }
    }
  }

  .area-article-card-image {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;

    .story-image {
      width: 100%;
    }
  }
}
</style>
