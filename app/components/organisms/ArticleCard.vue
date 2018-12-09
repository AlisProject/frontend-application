<template>
  <section>
    <a :href="`${getLink}`" class="article-card-container" v-if="linkTo === 'draft'">
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
    getLink() {
      let link = ''
      switch (this.linkTo) {
        case 'draft':
          link = `/me/articles/draft/${this.article.article_id}/edit`
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
  display: grid;
  box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.7);
  grid-template-rows: 148px 136px;
  grid-template-columns: 296px;
  /* prettier-ignore */
  grid-template-areas:
    "article-card-image"
    "article-card-content";
  transition: all 400ms ease;
  padding: 22px;
  border-radius: 4px;
  grid-gap: 12px;

  &:hover {
    box-shadow: 0 0 16px 0 rgba(0, 134, 204, 0.5);

    &:active {
      box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.7);
    }
  }
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
