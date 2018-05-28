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
    } catch (e) {
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
      ],
      meta: [
        {
          hid: `og:title`,
          property: 'og:title',
          content: `${this.$store.state.article.article.title} | ALIS`
        },
        {
          hid: `og:description`,
          property: 'og:description',
          content: this.$store.state.article.article.overview
        },
        {
          hid: `og:type`,
          property: 'og:type',
          content: 'article'
        },
        {
          hid: `og:image`,
          property: 'og:image',
          content:
            this.$store.state.article.article.eye_catch_url ||
            `https://${process.env.DOMAIN}/d/nuxt/dist/OGP_1200×630.png`
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content:
            this.$store.state.article.article.eye_catch_url ||
            `https://${process.env.DOMAIN}/d/nuxt/dist/OGP_1200×630.png`
        }
      ]
    }
  }
}
</script>
