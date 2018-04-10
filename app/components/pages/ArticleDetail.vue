<template>
  <div class="article-container">
    <app-header showDefaultHeaderNav class="logo-original"/>
    <div class="area-article">
      <h1 class="area-title">{{ article.title }}</h1>
      <img
        class="area-top-image"
        :src="article.eye_catch_url"
        v-if="article.eye_catch_url !== null">
      <div class="area-content" v-html="article.body" />
      <!-- <article-tags :tags="article.tags"/> -->
      <article-footer-actions :likesCount="article.likesCount"/>
      <article-side-actions :likesCount="article.likesCount"/>
      <article-sub-infos :createdAt="createdAt" :tokenAmount="tokenAmount"/>
      <author-info :user="user"/>
      <!-- <article-comments :comments="article.comments"/> -->
    </div>
    <!-- <related-articles :articles="article.relatedArticles"/> -->
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from '../organisms/AppHeader'
import ArticleFooterActions from '../atoms/ArticleFooterActions'
import ArticleSideActions from '../atoms/ArticleSideActions'
import ArticleSubInfos from '../atoms/ArticleSubInfos'
import AuthorInfo from '../atoms/AuthorInfo'
// import ArticleTags from '../atoms/ArticleTags'
// import ArticleComments from '../organisms/ArticleComments'
// import RelatedArticles from '../organisms/RelatedArticles'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    ArticleFooterActions,
    ArticleSideActions,
    ArticleSubInfos,
    AuthorInfo,
    // ArticleTags,
    // ArticleComments,
    // RelatedArticles,
    AppFooter
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    user() {
      return {
        userDisplayName: '山田太郎',
        userId: 'yamadaman',
        selfIntroduction:
          'ほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげほげ'
      }
    },
    createdAt() {
      return '2018/03/14'
    },
    tokenAmount() {
      return '1222k'
    }
  }
}
</script>

<style lang="scss" scoped>
.article-container {
  display: grid;
  grid-template-rows: 100px 50px 1fr 75px;
  // grid-template-rows: 100px 50px 1fr 470px 75px;
  grid-template-columns: 1fr 640px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    'app-header       app-header       app-header      '
    '...              ...              ...             '
    '...              article          ...             '
    // 'related-articles related-articles related-articles'
    'app-footer       app-footer       app-footer      ';
  background: white;
}

.area-article {
  display: grid;
  grid-area: article;
  grid-template-rows: auto;
  grid-template-columns: auto;
  grid-gap: 30px;
  /* prettier-ignore */
  grid-template-areas:
    'title         '
    'top-image     '
    'content       '
    'footer-actions'
    'article-sub-infos'
    // 'tags          '
    'author-info   ';
  // 'article-comments';
}

.area-title {
  font-size: 25px;
  grid-area: title;
  letter-spacing: 0.05em;
}

.area-top-image {
  grid-area: top-image;
  max-width: 100%;
  width: 100%;
}

.area-content {
  grid-area: content;
}

@media screen and (max-width: 1080px) {
  .article-container {
    grid-template-rows: 100px 50px 1fr 75px;
    // grid-template-rows: 100px 50px 1fr 950px 75px;
  }
}

@media screen and (max-width: 640px) {
  .article-container {
    grid-template-rows: 70px 0 1fr min-content;
    // grid-template-rows: 70px 0 1fr min-content 75px;
    grid-template-columns: 10px 1fr 10px;
    /* prettier-ignore */
    grid-template-areas:
    'app-header       app-header       app-header      '
    '...              ...              ...             '
    'article          article          article         '
    // 'related-articles related-articles related-articles'
    'app-footer       app-footer       app-footer      ';
  }

  .area-article {
    grid-template-columns: 8px auto 8px;
    grid-gap: 10px;
    /* prettier-ignore */
    grid-template-areas:
      'top-image      top-image         top-image     '
      '...            title             ...           '
      '...            content           ...           '
      // '...            tags           ...           '
      '...            article-sub-infos ...'
      'footer-actions footer-actions    footer-actions'
      '...            author-info       ...           ';
    // '...            article-comments ...           ';
  }

  .area-title {
    font-size: 16px;
    grid-area: title;
    letter-spacing: 0.1em;
  }
}
</style>
