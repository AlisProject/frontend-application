<template>
  <div class="area-story-card-list-container">
    <story-card
      v-for="story in stories"
      :story="story"
      :key="story.id"
    />
  </div>
</template>

<script>
import StoryCard from '../molecules/StoryCard'

export default {
  components: {
    StoryCard
  },
  props: ['stories']
}
</script>

<style scoped>
.area-story-card-list-container {
  display: grid;
  grid-area: story-card-list;
  grid-gap: 32px;
  grid-template-columns: repeat(3, 340px);
  grid-template-rows: repeat(4, 270px);
}
</style>
