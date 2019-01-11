<template>
  <nuxt-link :to="`/users/${article.userInfo.user_id}`" class="area-data">
    <article-card-content-data-profile-icon :user="article.userInfo"/>
    <article-card-content-data-username :username="article.userInfo.user_display_name"/>
    <article-card-content-data-published-at :publishedAt="publishedAt"/>
  </nuxt-link>
</template>

<script>
import ArticleCardContentDataProfileIcon from '../atoms/ArticleCardContentDataProfileIcon'
import ArticleCardContentDataUsername from '../atoms/ArticleCardContentDataUsername'
import ArticleCardContentDataPublishedAt from '../atoms/ArticleCardContentDataPublishedAt'

export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  components: {
    ArticleCardContentDataProfileIcon,
    ArticleCardContentDataUsername,
    ArticleCardContentDataPublishedAt
  },
  computed: {
    publishedAt() {
      return this.article.published_at || this.article.created_at
    }
  }
}
</script>

<style lang="scss" scoped>
.area-data {
  color: #717171;
  display: grid;
  font-size: 12px;
  grid-area: data;
  /* prettier-ignore */
  grid-template-areas:
    "profile-icon  name"
    "profile-icon  date";
  grid-template-columns: 50px 168px;
  grid-template-rows: 18px 18px;
  text-decoration: none;
  padding: 4px 0;

  > * {
    margin: 0;
  }
}

.long-article-card {
  .area-data {
    align-self: flex-end;
  }
}

@media screen and (max-width: 550px) {
  .long-article-card {
    .area-data {
      bottom: 12px;
      left: 14px;
    }
  }
}

@media screen and (max-width: 550px) {
  .area-data {
    grid-template-columns: 50px 150px;
  }
}
</style>
