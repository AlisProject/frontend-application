<template>
  <section>
    <nuxt-link
      :to="
        `/me/articles/${article_status}/v2/${articleContentEditHistory.article_id}/edit?version=${
          articleContentEditHistory.version
        }`
      "
      class="article-content-edit-history-container"
    >
      <span class="area-article-content-edit-history-card-content-updated-at">
        <article-content-edit-history-card-content-updated-at
          :updated-at="articleContentEditHistory.update_at"
        />
      </span>
      <span class="area-import-label">このバージョンを復元</span>
    </nuxt-link>
  </section>
</template>

<script>
import ArticleContentEditHistoryCardContentUpdatedAt from '../atoms/ArticleContentEditHistoryCardContentUpdatedAt'

export default {
  components: {
    ArticleContentEditHistoryCardContentUpdatedAt
  },
  props: {
    articleContentEditHistory: {
      type: Object
    }
  },
  computed: {
    article_status() {
      return this.$route.path.startsWith('/me/articles/public') ? 'public' : 'draft'
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.article-content-edit-history-container {
  @include cassette-shadow();
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "updated-at import-label";
  grid-template-columns: auto;
  grid-template-rows: auto;
  padding: 12px 0px 12px 0px;
  border-radius: 4px;
}

.area-article-content-edit-history-card-content-updated-at {
  grid-area: updated-at;
  padding: 0px 0px 0px 8px;
}

.area-import-label {
  grid-area: import-label;
  color: #7f7f7f;
  font-size: 16px;
  margin: 0px 8px 0px auto;
}
</style>
