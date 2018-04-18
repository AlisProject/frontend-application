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
  async fetch({ store, params }) {
    const { articleId } = params
    await store.dispatch('article/getArticleDetail', { articleId })
  },
  mounted() {
    if (this.loggedIn) this.postPv({ articleId: this.$route.params.articleId })
  },
  computed: {
    ...mapGetters('user', ['loggedIn']),
    ...mapGetters('article', ['article'])
  },
  methods: {
    ...mapActions('article', ['postPv'])
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
