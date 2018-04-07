<template>
  <div class="area-data">
    <!-- <article-card-content-data-profile-icon :user="article.user"/>
    <article-card-content-data-username :username="article.user.user_display_name"/>
    <article-card-content-data-created-at :createdAt="article.created_at"/> -->
  </div>
</template>

<script>
import ArticleCardContentDataProfileIcon from '../atoms/ArticleCardContentDataProfileIcon'
import ArticleCardContentDataUsername from '../atoms/ArticleCardContentDataUsername'
import ArticleCardContentDataCreatedAt from '../atoms/ArticleCardContentDataCreatedAt'

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
    ArticleCardContentDataCreatedAt
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
  grid-template-columns: 40px 100px;
  grid-template-rows: 20px 20px;
  line-height: 18px;

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
</style>
