<template>
  <div class="area-user-article-popular-card-list">
    <div v-if="articles.length > 0">
      <hr class="hr">
      <span class="user-article-popular-title">
        投稿者の人気記事
      </span>
    </div>
    <user-article-popular-card
      v-for="article in articles"
      :key="article.article_id"
      :article="article"
      :userInfo="userInfo"
    />
  </div>
</template>

<script>
import UserArticlePopularCard from './UserArticlePopularCard'

export default {
  components: {
    UserArticlePopularCard
  },
  props: {
    articles: {
      type: Array
    }
  }
}
</script>

<style lang="scss" scoped>
.hr {
  border: none;
  height: 1px;
  background-color: #dedede;
  margin-bottom: 32px;
}
.user-article-popular-title {
  font-size: 14px;
  font-weight: bold;
}
.area-user-article-popular-card-list {
  display: grid;
  grid-area: user-article-popular-card-list;
  grid-gap: 16px;
  grid-auto-rows: min-content;
  /*margin: 0 20px 40px 20px;*/
  margin: 0 0 40px 0;
}

@media screen and (max-width: 640px) {
  .area-user-article-popular-card-list {
    grid-gap: 16px;
    margin: 0 0px 60px 0;
  }
}
</style>
