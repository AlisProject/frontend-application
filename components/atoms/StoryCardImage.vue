<template>
  <img class="area-story-card-image" src='~assets/top-story-card-image.png'>
  <!-- TODO: data属性からCSSに渡す -->
  <!-- <div class="image" :data-image-url="story.imageUrl"></div> -->
</template>

<style lang="scss" scoped>
.area-story-card-image {
  grid-area: story-card-image;
  width: 100%;
  max-width: 100%;
}
</style>