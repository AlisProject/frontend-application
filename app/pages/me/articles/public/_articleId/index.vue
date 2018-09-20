<template>
  <public-article :article="article"/>
</template>

<script>
import { mapGetters } from 'vuex'
import PublicArticle from '~/components/pages/PublicArticle'
import { showEmbedTweet, htmlDecode } from '~/utils/article'

export default {
  components: {
    PublicArticle
  },
  async beforeCreate() {
    const { articleId } = this.$route.params
    await this.$store.dispatch('article/getPublicArticleDetail', { articleId })
    showEmbedTweet()
  },
  computed: {
    ...mapGetters('article', ['article'])
  },
  head() {
    const { article } = this.$store.state.article
    const decodedArticleTitle = htmlDecode(article.title)

    return {
      title: decodedArticleTitle,
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
