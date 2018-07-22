<template>
  <div class="area-search-article-card-list-container">
    <article-card
      v-for="article in articles"
      :article="article"
      :key="article.id"
      class="shadow"
      :linkTo="linkTo"
    />
  </div>
</template>

<script>
import ArticleCard from '../organisms/ArticleCard'

export default {
  components: {
    ArticleCard
  },
  props: ['articles', 'linkTo']
}
</script>

<style scoped>
.area-search-article-card-list-container {
  display: grid;
  grid-area: article-card-list;
  grid-gap: 30px;
  grid-template-columns: repeat(3, 340px);
  grid-template-rows: repeat(auto-fill, 268px);
}

@media screen and (max-width: 1296px) {
  .area-search-article-card-list-container {
    grid-template-columns: repeat(2, 340px);
    grid-template-rows: repeat(auto-fill, 268px);
  }
}

@media screen and (max-width: 920px) {
  .area-search-article-card-list-container {
    grid-template-columns: 340px;
    grid-template-rows: repeat(auto-fill, 268px);
  }
}

@media screen and (max-width: 550px) {
  .area-search-article-card-list-container {
    grid-gap: 15px;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fill, 300px);
  }
}
</style>
