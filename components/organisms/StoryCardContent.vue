<template>
  <div class="area-article-card-content">
    <story-card-content-title :title="story.title" />
    <article-card-content-bookmark/>
    <story-card-content-overview :overview="story.overview"/>
    <story-card-content-data :story="story"/>
    <story-card-content-token-amount :tokenAmount="story.alisToken"/>
  </div>
</template>

<script>
import StoryCardContentTitle from '../atoms/StoryCardContentTitle'
import ArticleCardContentBookmark from '../atoms/ArticleCardContentBookmark'
import StoryCardContentOverview from '../atoms/StoryCardContentOverview'
import StoryCardContentData from '../molecules/StoryCardContentData'
import StoryCardContentTokenAmount from '../atoms/StoryCardContentTokenAmount'

export default {
  props: ['story'],
  components: {
    StoryCardContentTitle,
    StoryCardContentOverview,
    ArticleCardContentBookmark,
    StoryCardContentData,
    StoryCardContentTokenAmount
  }
}
</script>

<style lang="scss" scoped>
.area-article-card-content {
  background: white;
  display: grid;
  grid-area: article-card-content;
  grid-gap: 6px;
  /* prettier-ignore */
  grid-template-areas:
    "title     ...     "
    "overview  overview"
    "data      ...     ";
  grid-template-columns: 248px 44px;
  grid-template-rows: 48px 44px 40px;
  padding: 18px 24px;
  position: relative;
}

.long-article-card {
  .area-article-card-content {
    grid-template-rows: 52px 76px;
    grid-template-columns: 420px 60px;
    grid-area: long-article-card-content;
    grid-gap: 12px;
    padding: 28px;
  }
}

@media screen and (max-width: 1296px) {
  .long-article-card {
    .area-article-card-content {
      grid-template-rows: 50px 44px;
      grid-template-columns: 1fr 1fr;
      /* prettier-ignore */
      grid-template-areas:
        "title    title   "
        "overview overview"
        "data     ...     ";
      padding: 12px 20px;
    }
  }
}

@media screen and (max-width: 920px) {
  .long-article-card {
    .area-article-card-content {
      grid-area: article-card-content;
      grid-gap: 6px;
      /* prettier-ignore */
      grid-template-areas:
        "title    title   "
        "overview overview"
        "data     ...     ";
      grid-template-rows: 48px 44px 40px;
      padding: 18px 24px;
    }
  }
}

@media screen and (max-width: 550px) {
  .long-article-card {
    .area-article-card-content {
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      grid-template-rows: 50px 40px 40px;
      grid-gap: 12px;
      padding: 18px 12px;
    }
  }

  .area-article-card-content {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    grid-template-rows: 50px 40px 40px;
    grid-template-columns: 1fr 1fr;
    grid-gap: 12px;
    /* prettier-ignore */
    grid-template-areas:
        "title    title   "
        "overview overview"
        "data     ...     ";
    padding: 18px 12px;
  }
}
</style>
