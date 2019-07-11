<template>
  <div class="area-article-content-edit-history-list-container">
    <nuxt-link :to="`edit`" class="current-card">
      <span class="current-label">現在のバージョン</span>
    </nuxt-link>
    <article-content-edit-history-card
      v-for="articleContentEditHistory in articleContentEditHistories"
      :key="articleContentEditHistory.sort_key"
      :articleContentEditHistory="articleContentEditHistory"
    />
    <p class="caution-statement">
      ※ 編集履歴は最新の 100 件が保存されます。<br>
      ※ 本文が復元されます。タイトルは復元されません。
    </p>
  </div>
</template>

<script>
import ArticleContentEditHistoryCard from './ArticleContentEditHistoryCard'

export default {
  components: {
    ArticleContentEditHistoryCard
  },
  props: ['articleContentEditHistories']
}
</script>

<style lang="scss" scoped>
.area-article-content-edit-history-list-container {
  display: grid;
  grid-area: article-content-edit-history-card-list;
  grid-gap: 14px;
  grid-auto-rows: min-content;
  padding: 0px 0px 30px 0px;
}

.current-card {
  @include cassette-shadow();
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "current-label";
  grid-template-columns: auto;
  grid-template-rows: auto;
  padding: 12px 0px 12px 0px;
  border-radius: 4px;
  text-decoration: none;
}

.current-label {
  grid-area: current-label;
  color: #7f7f7f;
  font-size: 16px;
  margin: 0px auto 0px 12px;
}

.caution-statement {
  color: #7f7f7f;
  font-size: 13px;
}

@media screen and (max-width: 640px) {
  .area-article-content-edit-history-list-container {
    grid-gap: 10px;
  }
}
</style>
