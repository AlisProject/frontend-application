<template>
  <div class="area-related-articles">
    <article-card
      v-for="article in articles"
      :article="article"
      :key="article.id"
      class="article-card"
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
      type: Array
    }
  }
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
