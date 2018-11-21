<template>
  <div class="article-container">
    <app-header />
    <div class="area-article">
      <span class="area-topic" v-if="topic">
        {{ topic }}
      </span>
      <h1 class="area-title">{{ decodedTitle }}</h1>
      <div class="area-content" v-html="article.body" />
      <article-tags :tags="article.tags"/>
      <article-footer-actions
        :articleId="article.article_id"
        :articleUserId="article.user_id"
        :likesCount="likesCount"
        :isLikedArticle="isLikedArticle"/>
      <article-side-actions
        :articleId="article.article_id"
        :likesCount="likesCount"
        :isLikedArticle="isLikedArticle"/>
      <article-sub-infos :publishedAt="publishedAt" :tokenAmount="article.alisToken"/>
      <author-info :user="article.userInfo"/>
    </div>
    <article-comments :comments="article.comments"/>
    <article-comment-form/>
    <app-footer/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import ArticleFooterActions from '../atoms/ArticleFooterActions'
import ArticleSideActions from '../atoms/ArticleSideActions'
import ArticleSubInfos from '../atoms/ArticleSubInfos'
import AuthorInfo from '../atoms/AuthorInfo'
import ArticleTags from '../molecules/ArticleTags'
import ArticleCommentForm from '../molecules/ArticleCommentForm'
import ArticleComments from '../organisms/ArticleComments'
import AppFooter from '../organisms/AppFooter'
import { showEmbedTweet, htmlDecode } from '~/utils/article'

export default {
  components: {
    AppHeader,
    ArticleFooterActions,
    ArticleSideActions,
    ArticleSubInfos,
    AuthorInfo,
    ArticleTags,
    ArticleCommentForm,
    ArticleComments,
    AppFooter
  },
  props: {
    article: {
      type: Object,
      required: true
    },
    topic: {
      type: String,
      required: false
    }
  },
  mounted() {
    const figcaptions = document.querySelectorAll('figcaption')
    figcaptions.forEach((figcaption) => {
      figcaption.removeAttribute('contenteditable')
    })
    showEmbedTweet()
  },
  beforeDestroy() {
    this.resetArticleCommentsLastEvaluatedKey()
  },
  computed: {
    decodedTitle() {
      return htmlDecode(this.article.title)
    },
    publishedAt() {
      return this.article.published_at || this.article.created_at
    },
    ...mapGetters('article', ['likesCount', 'isLikedArticle'])
  },
  methods: {
    ...mapActions('article', ['resetArticleCommentsLastEvaluatedKey'])
  }
}
</script>

<style lang="scss" scoped>
.article-container {
  display: grid;
  grid-template-rows: 100px 1fr min-content min-content 75px;
  // grid-template-rows: 100px 50px 1fr 470px 75px;
  grid-template-columns: 1fr 640px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    'app-header           app-header           app-header      '
    '...                  article              ...             '
    'article-comments     article-comments     article-comments'
    'article-comment-form article-comment-form article-comment-form'
    'app-footer           app-footer           app-footer      ';
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
    'topic         '
    'title         '
    'content       '
    'tags          '
    'article-sub-infos'
    'footer-actions'
    'author-info   ';
}

.area-topic {
  border-bottom: 1px solid #f0f0f0;
  color: #5e5e5e;
  font-size: 14px;
  grid-area: topic;
  height: 28px;
  letter-spacing: 0.3px;
  margin-bottom: -20px;
  word-break: break-all;
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
    grid-template-rows: 100px 1fr min-content min-content 75px;
  }
}

@media screen and (max-width: 640px) {
  .article-container {
    grid-template-rows: 66px 1fr min-content min-content min-content;
    grid-template-columns: 10px 1fr 10px;
    /* prettier-ignore */
    grid-template-areas:
    'app-header           app-header           app-header      '
    'article              article              article         '
    'article-comments     article-comments     article-comments'
    'article-comment-form article-comment-form article-comment-form'
    'app-footer           app-footer           app-footer      ';
  }

  .area-article {
    grid-template-columns: 8px auto 8px;
    grid-gap: 10px;
    /* prettier-ignore */
    grid-template-areas:
      '...            topic             ...           '
      '...            title             ...           '
      '...            content           ...           '
      '...            tags              ...           '
      '...            article-sub-infos ...'
      '...            author-info       ...           '
      'footer-actions footer-actions    footer-actions';
  }

  .area-topic {
    margin: 20px 0 0;
  }

  .area-title {
    font-size: 20px;
  }
}
</style>
