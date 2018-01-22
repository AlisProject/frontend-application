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
</style>
