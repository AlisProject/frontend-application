<template>
  <public-article />
</template>

<script>
import PublicArticle from '~/components/pages/PublicArticle'
import { htmlDecode } from '~/utils/article'

export default {
  components: {
    PublicArticle
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
