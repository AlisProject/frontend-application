<template>
  <div class="article-container">
    <app-header showDefaultHeaderNav class="logo-original"/>
    <div class="area-article">
      <h1 class="area-title">{{ article.title }}</h1>
      <div class="area-content" v-html="article.body" />
      <!-- <article-tags :tags="article.tags"/> -->
      <article-footer-actions
        :articleId="article.article_id"
        :likesCount="likesCount"
        :isLikedArticle="isLikedArticle"/>
      <article-side-actions
        :articleId="article.article_id"
        :likesCount="likesCount"
        :isLikedArticle="isLikedArticle"/>
      <article-sub-infos :publishedAt="publishedAt" :tokenAmount="article.alisToken"/>
      <author-info :user="article.userInfo"/>
    </div>
    <article-comments :comments="comments"/>
    <!-- <related-articles :articles="article.relatedArticles"/> -->
    <app-footer/>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import ArticleFooterActions from '../atoms/ArticleFooterActions'
import ArticleSideActions from '../atoms/ArticleSideActions'
import ArticleSubInfos from '../atoms/ArticleSubInfos'
import AuthorInfo from '../atoms/AuthorInfo'
// import ArticleTags from '../atoms/ArticleTags'
import ArticleComments from '../organisms/ArticleComments'
// import RelatedArticles from '../organisms/RelatedArticles'
import AppFooter from '../organisms/AppFooter'
import { showEmbedTweet } from '~/utils/article'

export default {
  components: {
    AppHeader,
    ArticleFooterActions,
    ArticleSideActions,
    ArticleSubInfos,
    AuthorInfo,
    // ArticleTags,
    ArticleComments,
    // RelatedArticles,
    AppFooter
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  mounted() {
    const figcaptions = document.querySelectorAll('figcaption')
    figcaptions.forEach((figcaption) => {
      figcaption.removeAttribute('contenteditable')
    })
    showEmbedTweet()
  },
  computed: {
    comments() {
      return [
        {
          id: 1,
          body: 'body',
          user: {
            username: '山田花子'
          },
          publishedAt: 'N分前'
        },
        {
          id: 2,
          body: 'body',
          user: {
            username: '山田花子'
          },
          publishedAt: 'N分前'
        }
      ]
    },
    publishedAt() {
      return this.article.published_at || this.article.created_at
    },
    ...mapGetters('article', ['likesCount', 'isLikedArticle'])
  }
}
</script>

<style lang="scss" scoped>
.article-container {
  display: grid;
  grid-template-rows: 100px 50px 1fr min-content 75px;
  // grid-template-rows: 100px 50px 1fr 470px 75px;
  grid-template-columns: 1fr 640px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    'app-header       app-header       app-header      '
    '...              ...              ...             '
    '...              article          ...             '
    'article-comments article-comments article-comments'
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
    'content       '
    'footer-actions'
    'article-sub-infos'
    // 'tags          '
    'author-info   ';
}

.area-title {
  font-size: 24px;
  grid-area: title;
  letter-spacing: 0.1em;
  line-height: 1.5;
  word-break: break-all;
}

.area-content {
  grid-area: content;
}

@media screen and (max-width: 1080px) {
  .article-container {
    grid-template-rows: 100px 50px 1fr min-content 75px;
    // grid-template-rows: 100px 50px 1fr 950px 75px;
  }
}

@media screen and (max-width: 640px) {
  .article-container {
    grid-template-rows: 70px 0 1fr min-content min-content;
    // grid-template-rows: 70px 0 1fr min-content 75px;
    grid-template-columns: 10px 1fr 10px;
    /* prettier-ignore */
    grid-template-areas:
    'app-header       app-header       app-header      '
    '...              ...              ...             '
    'article          article          article         '
    'article-comments article-comments article-comments'
    // 'related-articles related-articles related-articles'
    'app-footer       app-footer       app-footer      ';
  }

  .area-article {
    grid-template-columns: 8px auto 8px;
    grid-gap: 10px;
    /* prettier-ignore */
    grid-template-areas:
      '...            title             ...           '
      '...            content           ...           '
      // '...            tags           ...           '
      '...            article-sub-infos ...'
      '...            author-info       ...           '
      'footer-actions footer-actions    footer-actions';
    // '...            article-comments ...           ';
  }

  .area-title {
    font-size: 20px;
  }
}
</style>
