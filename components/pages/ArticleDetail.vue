<template>
  <div class="article-container">
    <app-header showDefaultHeaderNav class="logo-original"/>
    <div class="area-article">
      <h1 class="area-title">{{ story.title }}</h1>
      <img class="area-top-image" src="~assets/images/top-story-card-image.png">
      <div class="area-content" v-html="story.body" />
      <article-tags :tags="story.tags"/>
      <article-footer-actions :likesCount="story.likesCount"/>
      <article-side-actions :likesCount="story.likesCount"/>
      <author-info :story="story"/>
      <article-comments :comments="story.comments"/>
    </div>
    <related-articles :stories="story.relatedStories"/>
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from '../organisms/AppHeader'
import ArticleFooterActions from '../atoms/ArticleFooterActions'
import ArticleSideActions from '../atoms/ArticleSideActions'
import AuthorInfo from '../atoms/AuthorInfo'
import ArticleTags from '../atoms/ArticleTags'
import ArticleComments from '../organisms/ArticleComments'
import RelatedArticles from '../organisms/RelatedArticles'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    ArticleFooterActions,
    ArticleSideActions,
    AuthorInfo,
    ArticleTags,
    ArticleComments,
    RelatedArticles,
    AppFooter
  },
  props: ['story']
}
</script>

<style lang="scss" scoped>
.article-container {
  display: grid;
  grid-template-rows: 100px 50px 1fr 470px 75px;
  grid-template-columns: 1fr 640px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    'app-header       app-header       app-header      '
    '...              ...              ...             '
    '...              article          ...             '
    'related-articles related-articles related-articles'
    '...              app-footer       ...             ';
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
    'tags          '
    'author-info   '
    'article-comments';
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
    grid-template-rows: 100px 50px 1fr 950px 75px;
  }
}

@media screen and (max-width: 640px) {
  .article-container {
    grid-template-rows: 70px 0 1fr min-content 75px;
    grid-template-columns: 10px 1fr 10px;
    /* prettier-ignore */
    grid-template-areas:
    'app-header       app-header       app-header      '
    '...              ...              ...             '
    'article          article          article         '
    'related-articles related-articles related-articles'
    '...              app-footer       ...             ';
  }

  .area-article {
    grid-template-columns: 8px auto 8px;
    grid-gap: 10px;
    /* prettier-ignore */
    grid-template-areas:
      'top-image      top-image      top-image     '
      '...            title          ...           '
      '...            content        ...           '
      '...            tags           ...           '
      '...            author-info    ...           '
      'footer-actions footer-actions footer-actions'
      '...            article-comments ...           ';
  }

  .area-title {
    font-size: 16px;
    grid-area: title;
    letter-spacing: 0.1em;
  }
}
</style>
