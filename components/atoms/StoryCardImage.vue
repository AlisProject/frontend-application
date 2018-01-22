<template>
  <div class="area-story-card-image">
    <img class="story-image" src='~assets/images/top-story-card-image.png'>
    <!-- TODO: data属性からCSSに渡す -->
    <!-- <div class="image" :data-image-url="story.imageUrl"></div> -->
  </div>
</template>

<style lang="scss" scoped>
.area-story-card-image {
  grid-area: story-card-image;
  overflow: hidden;

  .story-image {
    width: 100%;
    max-width: 100%;
  }
}

.long-story-card .area-story-card-image {
  grid-area: long-story-card-image;

  .story-image {
    height: 270px;
    object-fit: cover;
    object-position: 0%;
    width: 540px;
  }
}
</style>
