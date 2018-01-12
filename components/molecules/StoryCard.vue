<template>
  <section class="story-card-container">
    <story-card-image/>
    <!-- TODO: data属性からCSSに渡す -->
    <!-- <div class="image" :data-image-url="story.imageUrl"></div> -->
    <story-card-content :story="story"/>
  </section>
</template>

<script>
import StoryCardImage from '../atoms/StoryCardImage'
import StoryCardContent from '../atoms/StoryCardContent'

export default {
  props: ['story'],
  components: {
    StoryCardImage,
    StoryCardContent
  }
}
</script>

<style lang="scss" scoped>
.story-card-container {
  display: grid;
  grid-template-rows: 88px 182px;
  grid-template-columns: 342px;
  /* prettier-ignore */
  grid-template-areas:
    "story-card-image"
    "story-card-content";
}
</style>
