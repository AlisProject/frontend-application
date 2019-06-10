<template>
  <div class="area-article-card-list-container">
    <template v-for="(article, i) in articles">
      <recommended-article-card
        v-if="article !== null"
        :key="article.id"
        :article="article"
        :isTipRanking="isTipRanking"
        :order="`${i + 1}`"
      />
    </template>
  </div>
</template>

<script>
import RecommendedArticleCard from '../organisms/RecommendedArticleCard'

export default {
  components: {
    RecommendedArticleCard
  },
  props: {
    articles: {
      type: Array,
      required: true
    },
    isTipRanking: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style scoped>
.area-article-card-list-container {
  display: grid;
  grid-area: article-card-list;
  grid-gap: 30px;
  grid-template-columns: repeat(auto-fill, 340px);
  grid-template-rows: repeat(auto-fill, auto);
}

@media screen and (max-width: 1296px) {
  .area-article-card-list-container {
    grid-template-columns: repeat(2, 340px);
  }
}

@media screen and (max-width: 920px) {
  .area-article-card-list-container {
    grid-template-columns: 340px;
  }
}

@media screen and (max-width: 550px) {
  .area-article-card-list-container {
    grid-template-columns: 1fr;
    grid-gap: 24px;
  }
}
</style>
