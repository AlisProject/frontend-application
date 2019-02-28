<template>
  <div class="area-user-article-card-list-container">
    <article-card
      v-for="article in articles"
      :key="article.article_id"
      :article="article"
      :link-to="linkTo"
    />
  </div>
</template>

<script>
import ArticleCard from '../organisms/ArticleCard'

export default {
  components: {
    ArticleCard
  },
  props: {
    articles: {
      type: Array,
      required: true
    },
    linkTo: {
      type: String,
      required: false
    }
  }
}
</script>

<style scoped>
.area-user-article-card-list-container {
  display: grid;
  grid-area: article-card-list;
  grid-gap: 30px;
  grid-template-columns: repeat(2, 340px);
  grid-template-rows: repeat(auto-fill, 340px);
}

@media screen and (max-width: 920px) {
  .area-user-article-card-list-container {
    grid-template-columns: 340px;
  }
}

@media screen and (max-width: 550px) {
  .area-user-article-card-list-container {
    grid-gap: 24px;
    grid-template-columns: 1fr;
  }
}
</style>
