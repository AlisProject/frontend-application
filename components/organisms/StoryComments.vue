<template>
  <div class="area-story-comments">
    <template v-for="comment in comments">
      <story-comment :comment="comment" :key="comment.id"/>
    </template>
  </div>
</template>

<script>
import StoryComment from '../atoms/StoryComment'

export default {
  components: {
    StoryComment
  },
  props: ['comments']
}
</script>

<style lang="scss" scoped>
.area-story-comments {
  display: grid;
  grid-area: story-comments;
  grid-gap: 20px;
}
</style>
