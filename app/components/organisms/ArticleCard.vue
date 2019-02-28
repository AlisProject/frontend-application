<template>
  <section>
    <!--
      v1 の記事は medium-editor に関連したライブラリを CDN 経由で取得する必要があるため、
      http 通信でのページ遷移を行う必要がある。そのため、a タグを用いている。
    -->
    <a :href="`${getLink}`" class="article-card-container" v-if="linkTo === 'draft' && !isV2Article">
      <article-card-image :eyeCatchUrl="article.eye_catch_url"/>
      <article-card-content :article="article"/>
    </a>
    <nuxt-link :to="`${getLink}`" class="article-card-container" v-else>
      <article-card-image :eyeCatchUrl="article.eye_catch_url"/>
      <article-card-content :article="article"/>
    </nuxt-link>
  </section>
</template>

<script>
import ArticleCardImage from '../atoms/ArticleCardImage'
import ArticleCardContent from '../organisms/ArticleCardContent'
import { isV2 } from '~/utils/article'

export default {
  props: {
    article: {
      type: Object
    },
    linkTo: {
      type: String
    }
  },
  components: {
    ArticleCardImage,
    ArticleCardContent
  },
  computed: {
    isV2Article() {
      return isV2(this.article)
    },
    getLink() {
      let link = ''
      switch (this.linkTo) {
        case 'draft':
          link = this.isV2Article
            ? `/me/articles/draft/v2/${this.article.article_id}/edit`
            : `/me/articles/draft/${this.article.article_id}/edit`
          break
        default:
          link = `/${this.article.user_id}/articles/${this.article.article_id}`
      }
      return link
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.article-card-container {
  @include cassette-shadow();
  display: grid;
  grid-template-rows: 148px 144px;
  grid-template-columns: 296px;
  /* prettier-ignore */
  grid-template-areas:
    "article-card-image"
    "article-card-content";
  padding: 20px 22px;
  border-radius: 4px;
  grid-gap: 8px;
}

.draft .article-card-container {
  opacity: 0.7;
}

@media screen and (max-width: 320px) {
  .article-card-container {
    grid-template-columns: 256px;
  }
}
</style>
