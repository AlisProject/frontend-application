<template>
  <public-article :article="article"/>
</template>

<script>
/* eslint-disable no-undef */
import { mapGetters } from 'vuex'
import PublicArticle from '~/components/pages/PublicArticle'

export default {
  components: {
    PublicArticle
  },
  async beforeCreate() {
    const { articleId } = this.$route.params
    await this.$store.dispatch('article/getPublicArticleDetail', { articleId })
    document.querySelectorAll('[data-alis-iframely-url]').forEach((element) => {
      element.innerHTML = `<a href="${element.dataset.alisIframelyUrl}" data-iframely-url></a>`
    })
    iframely.load()
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
