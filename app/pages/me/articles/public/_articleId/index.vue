<template>
  <public-article :article="article"/>
</template>

<script>
import { mapGetters } from 'vuex'
import PublicArticle from '~/components/pages/PublicArticle'
import showEmbedTweet from '~/utils/showEmbedTweet'

export default {
  components: {
    PublicArticle
  },
  async beforeCreate() {
    const { articleId } = this.$route.params
    await this.$store.dispatch('article/getPublicArticleDetail', { articleId })
    showEmbedTweet({ $axios: this.$axios })
  },
  computed: {
    ...mapGetters('article', ['article'])
  },
  head() {
    return {
      title: this.$store.state.article.article.title,
      link: [
        {
          rel: 'stylesheet',
          href:
            'https://cdnjs.cloudflare.com/ajax/libs/medium-editor-insert-plugin/2.4.1/css/medium-editor-insert-plugin.min.css'
        }
      ]
    }
  }
}
</script>
