<template>
  <div class="area-story-card-list-container">
    <story-card
      v-for="(story, i) in stories"
      :story="story"
      :key="story.id"
      :class="i === 0 ? 'long-story-card top' : null"
      :linkTo="linkTo"
    />
  </div>
</template>

<script>
import StoryCard from '../organisms/StoryCard'

export default {
  components: {
    StoryCard
  },
  props: ['stories', 'linkTo']
}
</script>

<style scoped>
.area-story-card-list-container {
  display: grid;
  grid-area: story-card-list;
  grid-gap: 30px;
  grid-template-columns: repeat(3, 340px);
  grid-template-rows: repeat(4, 268px);
}

.long-story-card .area-story-card-list-container {
  grid-template-columns: 1080px;
}

@media screen and (max-width: 1296px) {
  .long-story-card .area-story-card-list-container {
    grid-template-columns: 710px;
    grid-template-rows: repeat(10, 178px);
    grid-gap: 40px;
  }

  .area-story-card-list-container {
    grid-template-columns: repeat(2, 340px);
    grid-template-rows: 178px repeat(5, 268px);
  }
}

@media screen and (max-width: 920px) {
  .long-story-card .area-story-card-list-container {
    grid-template-columns: 340px;
    grid-template-rows: repeat(10, 268px);
    grid-gap: 30px;
  }
}

@media screen and (max-width: 550px) {
  .long-story-card .area-story-card-list-container {
    grid-gap: 15px;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(10, 300px);
  }
}
</style>
