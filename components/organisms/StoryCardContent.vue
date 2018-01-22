<template>
  <div class="area-story-card-content">
    <story-card-content-title :title="story.title" />
    <story-card-content-bookmark/>
    <story-card-content-body :body="story.body"/>
    <story-card-content-data :story="story"/>
    <story-card-content-token-amount :tokenAmount="story.tokenAmount"/>
  </div>
</template>

<script>
import StoryCardContentTitle from '../atoms/StoryCardContentTitle'
import StoryCardContentBookmark from '../atoms/StoryCardContentBookmark'
import StoryCardContentBody from '../atoms/StoryCardContentBody'
import StoryCardContentData from '../molecules/StoryCardContentData'
import StoryCardContentTokenAmount from '../atoms/StoryCardContentTokenAmount'

export default {
  props: ['story'],
  components: {
    StoryCardContentTitle,
    StoryCardContentBody,
    StoryCardContentBookmark,
    StoryCardContentData,
    StoryCardContentTokenAmount
  }
}
</script>

<style lang="scss" scoped>
.area-story-card-content {
  background: white;
  display: grid;
  font-family: YuGothic;
  grid-area: story-card-content;
  grid-gap: 6px;
  /* prettier-ignore */
  grid-template-areas:
    "title ... "
    "body  body"
    "data  ... ";
  grid-template-columns: 248px 44px;
  grid-template-rows: 48px 44px 40px;
  padding: 18px 24px;
  position: relative;
}

.long-story-card {
  .area-story-card-content {
    grid-template-rows: 52px 76px;
    grid-template-columns: 420px 60px;
    grid-area: long-story-card-content;
    grid-gap: 12px;
    padding: 28px;
  }
}
</style>
