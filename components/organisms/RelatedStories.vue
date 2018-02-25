<template>
  <div class="area-related-articles">
    <story-card
      v-for="story in stories"
      :story="story"
      :key="story.id"
      class="article-card"
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
.area-related-articles {
  background: #f7f7f7;
  display: grid;
  grid-area: related-articles;
  grid-gap: 30px;
  grid-template-columns: repeat(3, 340px);
  justify-content: center;
}

.article-card {
  align-self: center;
}

@media screen and (max-width: 1080px) {
  .area-related-articles {
    grid-gap: 15px;
    grid-template-columns: 340px;
    grid-template-rows: repeat(3, 300px);
    padding: 10px;
  }
}

@media screen and (max-width: 640px) {
  .area-related-articles {
    grid-gap: 15px;
    grid-template-rows: repeat(3, 300px);
    padding: 40px 10px 20px;
  }
}
</style>
