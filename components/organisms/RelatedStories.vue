<template>
  <div class="area-related-stories">
    <story-card
      v-for="story in stories"
      :story="story"
      :key="story.id"
      class="story-card"
    />
  </div>
</template>

<script>
import StoryCard from '../organisms/StoryCard'

export default {
  components: {
    StoryCard
  },
  props: ['stories']
}
</script>

<style lang="scss" scoped>
.area-related-stories {
  background: #f7f7f7;
  display: grid;
  grid-area: related-stories;
  grid-gap: 30px;
  grid-template-columns: repeat(3, 340px);
  justify-content: center;
}

.story-card {
  align-self: center;
}
</style>
