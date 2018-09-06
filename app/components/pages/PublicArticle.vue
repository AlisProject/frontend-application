<template>
  <div class="public-article-container">
    <app-header />
    <public-article-header-nav class="public-article" />
    <div class="area-article">
      <h1 class="area-title">{{ article.title }}</h1>
      <div class="area-content" v-html="article.body" />
    </div>
    <public-article-share-buttons/>
  </div>
</template>

<script>
import AppHeader from '../organisms/AppHeader'
import PublicArticleHeaderNav from '../molecules/PublicArticleHeaderNav'
import PublicArticleShareButtons from '../atoms/PublicArticleShareButtons'

export default {
  components: {
    AppHeader,
    PublicArticleHeaderNav,
    PublicArticleShareButtons
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.public-article-container {
  display: grid;
  grid-template-rows: 100px auto 50px 1fr;
  grid-template-columns: 1fr 640px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    'app-header app-header app-header'
    'nav        nav        nav       '
    '...        ...        ...       '
    '...        article    ...       ';
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
    'content       ';
}

.area-title {
  font-size: 24px;
  grid-area: title;
  letter-spacing: 0.1em;
  line-height: 1.5;
  word-break: break-all;
  margin: 0;
}

.area-content {
  grid-area: content;
}

@media screen and (max-width: 1080px) {
  .public-article-container {
    grid-template-rows: 100px auto 50px 1fr 950px 75px;
  }
}

@media screen and (max-width: 640px) {
  .public-article-container {
    grid-template-rows: 70px 20px 0 1fr;
    grid-template-columns: 10px 1fr 10px;
  }

  .area-article {
    grid-template-columns: 8px auto 8px;
    grid-gap: 10px;
    /* prettier-ignore */
    grid-template-areas:
      '...            title          ...           '
      '...            content        ...           ';
  }

  .area-title {
    font-size: 20px;
  }
}
</style>
