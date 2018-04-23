<template>
  <article-detail :article="article"/>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ArticleDetail from '~/components/pages/ArticleDetail'

export default {
  components: {
    ArticleDetail
  },
  async fetch({ store, params, error }) {
    try {
      const { articleId } = params
      await store.dispatch('article/getArticleDetail', { articleId })
    } catch (error) {
      error({ statusCode: 404 })
    }
  },
  async mounted() {
    if (this.loggedIn) {
      const { articleId } = this.$route.params
      await this.getIsLikedArticle({ articleId })
      await this.postPv({ articleId })
    } else {
      this.setIsLikedArticle({ liked: false })
    }
  },
  computed: {
    ...mapGetters('user', ['loggedIn']),
    ...mapGetters('article', ['article'])
  },
  methods: {
    ...mapActions('article', ['postPv', 'getIsLikedArticle', 'setIsLikedArticle'])
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
