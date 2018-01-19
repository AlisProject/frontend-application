<template>
  <section>
    <div class="story-card-container">
      <story-card-image/>
      <!-- TODO: data属性からCSSに渡す -->
      <!-- <div class="image" :data-image-url="story.imageUrl"></div> -->
      <story-card-content :story="story"/>
    </div>
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
  grid-template-rows: 88px 180px;
  grid-template-columns: 340px;
  /* prettier-ignore */
  grid-template-areas:
    "story-card-image"
    "story-card-content";
}

.top {
  grid-column: 1 / 4;
}

.long-story-card {
  .top {
    grid-column: auto;
  }

  .story-card-container {
    grid-area: long-story-card;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 270px;
    /* prettier-ignore */
    grid-template-areas:
      "long-story-card-image long-story-card-content";
  }
}
</style>
