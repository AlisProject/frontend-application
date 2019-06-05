<template>
  <div class="area-tip-eyecatch-article-card-list">
    <template v-for="(article, i) in articles">
      <tip-eyecatch-article-card
        v-if="article !== null"
        :key="article.id"
        :article="article"
        :order="`eyecatch${i + 1}`"
      />
      <eyecatch-alternative-image v-else :order="`eyecatch${i + 1}`" />
    </template>
  </div>
</template>

<script>
import TipEyecatchArticleCard from '../organisms/TipEyecatchArticleCard'
import EyecatchAlternativeImage from '../atoms/EyecatchAlternativeImage'

export default {
  components: {
    TipEyecatchArticleCard,
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
.area-tip-eyecatch-article-card-list {
  display: grid;
  grid-area: tip-eyecatch-article-card-list;
  grid-template-columns: 710px 340px;
  grid-template-rows: 191px 191px;
  grid-gap: 30px;
  /* prettier-ignore */
  grid-template-areas:
    "eyecatch1 eyecatch2"
    "eyecatch1 eyecatch3"
}

@media screen and (max-width: 1296px) {
  .area-tip-eyecatch-article-card-list {
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
