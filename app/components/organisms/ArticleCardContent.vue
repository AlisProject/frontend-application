<template>
  <div class="area-article-card-content">
    <article-card-content-title :title="article.title" />
    <article-card-content-overview :overview="article.overview"/>
    <!-- <article-card-content-bookmark/> -->
    <article-card-content-data :article="article"/>
    <article-card-content-token-amount :tokenAmount="article.alisToken"/>
  </div>
</template>

<script>
import ArticleCardContentTitle from '../atoms/ArticleCardContentTitle'
// import ArticleCardContentBookmark from '../atoms/ArticleCardContentBookmark'
import ArticleCardContentOverview from '../atoms/ArticleCardContentOverview'
import ArticleCardContentData from '../molecules/ArticleCardContentData'
import ArticleCardContentTokenAmount from '../atoms/ArticleCardContentTokenAmount'

export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  components: {
    ArticleCardContentTitle,
    ArticleCardContentOverview,
    // ArticleCardContentBookmark,
    ArticleCardContentData,
    ArticleCardContentTokenAmount
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
