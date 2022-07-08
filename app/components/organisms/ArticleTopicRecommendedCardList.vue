<template>
  <div class="area-article-topic-recommended-card-list">
    <div v-if="articles.length > 0" class="area-article-topic-recommended-title">
      <span>
        こちらもおすすめ！
      </span>
    </div>
    <span class="area-article-topic-recommended-list">
      <template v-for="(article, i) in articles">
        <recommended-article-card
          v-if="article !== null"
          :key="article.id"
          :article="article"
          :order="`${i + 1}`"
        />
      </template>
    </span>
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
      type: Array
    }
  }
}
</script>

<style lang="scss" scoped>
.area-article-topic-recommended-card-list {
  display: grid;
  grid-area: recommended-card-list;
  grid-template-areas:
    'title    '
    'card-list';
  grid-template-rows: auto auto;
  margin: 30px 0 60px 0;
}
.area-article-topic-recommended-title {
  grid-area: title;
  font-size: 14px;
  font-weight: bold;
  /*text-decoration:underline;*/
  margin-bottom: 30px;
}
.area-article-topic-recommended-list {
  display: grid;
  grid-area: card-list;
  grid-gap: 16px;
  grid-auto-rows: min-content;
  grid-template-columns: min-content min-content;
}
:deep(a.recommended-article-card) {
  width: 312px;
}
a.recommended-article-card {
  :deep(.eye-catch-image-box) {
    width: 268px;
  }
  :deep(.title) {
    width: 268px;
  }
  :deep(.username) {
    width: 162px;
  }
}

@media screen and (max-width: 640px) {
  :deep(a.recommended-article-card) {
    width: 340px;
  }
  a.recommended-article-card {
    :deep(.eye-catch-image-box) {
      width: 296px;
    }
    :deep(.title) {
      width: 296px;
    }
    :deep(.username) {
      width: 168px;
    }
  }
  .area-article-topic-recommended-title {
    margin-left: calc(50% - 170px);
    justify-self: left;
  }
  .area-article-topic-recommended-card-list {
    justify-items: center;
    align-items: center;
  }
  .area-article-topic-recommended-list {
    grid-template-columns: min-content;
  }
}
@media screen and (max-width: 340px) {
  .area-article-topic-recommended-title {
    margin-left: calc(50% - 150px);
  }
  :deep(a.recommended-article-card) {
    width: 300px;
  }
  a.recommended-article-card {
    :deep(.eye-catch-image-box) {
      width: 256px;
    }
    :deep(.title) {
      width: 256px;
    }
    :deep(.username) {
      width: 150px;
    }
  }
}
</style>
