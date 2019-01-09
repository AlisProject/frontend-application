<template>
  <div class="area-eyecatch-article-card-list">
    <template v-for="(article, i) in articles">
      <eyecatch-article-card
        v-if="article !== null"
        :article="article"
        :order="`eyecatch${i + 1}`"
        :key="article.id" />
      <eyecatch-alternative-image :order="`eyecatch${i + 1}`" v-else />
    </template>
  </div>
</template>

<script>
import EyecatchArticleCard from '../organisms/EyecatchArticleCard'
import EyecatchAlternativeImage from '../atoms/EyecatchAlternativeImage'

export default {
  components: {
    EyecatchArticleCard,
    EyecatchAlternativeImage
  },
  props: {
    articles: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.area-eyecatch-article-card-list {
  display: grid;
  grid-area: eyecatch-article-card-list;
  grid-template-columns: 710px 340px;
  grid-template-rows: 191px 191px;
  grid-gap: 30px;
  /* prettier-ignore */
  grid-template-areas:
    "eyecatch1 eyecatch2"
    "eyecatch1 eyecatch3"
}

@media screen and (max-width: 1296px) {
  .area-eyecatch-article-card-list {
    grid-template-columns: 340px 340px;
    grid-template-rows: 412px 191px;
    grid-gap: 30px;
    /* prettier-ignore */
    grid-template-areas:
      "eyecatch1 eyecatch1"
      "eyecatch2 eyecatch3"
  }
}
</style>
