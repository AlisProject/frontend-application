<template>
  <div class="area-article-card-list-container">
    <article-card
      v-for="(article, i) in articles"
      :article="article"
      :key="article.id"
      :class="i === 0 ? 'long-article-card top' : null"
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
.area-article-card-list-container {
  display: grid;
  grid-area: article-card-list;
  grid-gap: 30px;
  grid-template-columns: repeat(3, 340px);
  grid-template-rows: repeat(auto-fill, 268px);
}

.long-article-card .area-article-card-list-container {
  grid-template-columns: 1080px;
}

@media screen and (max-width: 1296px) {
  .long-article-card .area-article-card-list-container {
    grid-template-columns: 710px;
    grid-template-rows: repeat(auto-fill, 178px);
    grid-gap: 40px;
  }

  .area-article-card-list-container {
    grid-template-columns: repeat(2, 340px);
    grid-template-rows: 178px repeat(auto-fill, 268px);
  }
}

@media screen and (max-width: 920px) {
  .long-article-card .area-article-card-list-container {
    grid-template-columns: 340px;
    grid-template-rows: repeat(auto-fill, 268px);
    grid-gap: 30px;
  }

  .area-article-card-list-container {
    grid-template-columns: 340px;
    grid-template-rows: repeat(auto-fill, 268px);
  }
}

@media screen and (max-width: 550px) {
  .long-article-card .area-article-card-list-container {
    grid-gap: 15px;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fill, 300px);
  }

  .area-article-card-list-container {
    grid-gap: 15px;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fill, 300px);
  }
}
</style>
