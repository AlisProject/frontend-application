<template>
  <article-detail :article="article" :topic="topicDisplayName"/>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ArticleDetail from '~/components/pages/ArticleDetail'
import { htmlDecode } from '~/utils/article'

export default {
  components: {
    ArticleDetail
  },
  async fetch({ store, params, error }) {
    try {
      const { articleId } = params
      const isCurrentUser =
        store.state.user.loggedIn && params.user === store.state.user.currentUser.userId
      const getArticleType = isCurrentUser ? 'getPublicArticleDetail' : 'getArticleDetail'

      await store.dispatch(`article/${getArticleType}`, { articleId })
      await store.dispatch('article/getTopics')
      store.dispatch('article/setTopicDisplayName', {
        topicName: store.state.article.article.topic
      })
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  async mounted() {
    if (this.loggedIn) {
      const { articleId } = this.$route.params
      if (this.currentUser.phoneNumberVerified) await this.postPv({ articleId })
      await this.getIsLikedArticle({ articleId })
      await this.updateArticleCommentsByCommentIds({ articleId })

      if (this.isCurrentUser && !this.$store.state.article.isFetchedPublicArticle) {
        await this.$store.dispatch('article/getPublicArticleDetail', { articleId })
        this.$store.dispatch('article/setIsFetchedPublicArticle', { isFetched: true })
      }
    } else {
      this.setIsLikedArticle({ liked: false })
    }
  },
  computed: {
    isCurrentUser() {
      return this.loggedIn && this.$route.params.user === this.currentUser.userId
    },
    ...mapGetters('user', ['loggedIn', 'currentUser']),
    ...mapGetters('article', ['article', 'topicDisplayName'])
  },
  methods: {
    ...mapActions('article', [
      'postPv',
      'getIsLikedArticle',
      'setIsLikedArticle',
      'updateArticleCommentsByCommentIds'
    ])
  },
  head() {
    const { article } = this.$store.state.article
    const decodedArticleTitle = htmlDecode(article.title)
    const decodedArticleOverview = htmlDecode(article.overview)

    return {
      title: decodedArticleTitle,
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
          content: `${decodedArticleTitle} | ALIS`
        },
        {
          hid: `og:description`,
          property: 'og:description',
          content: decodedArticleOverview
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
            article.eye_catch_url || `https://${process.env.DOMAIN}/d/nuxt/dist/OGP_1200×630.png`
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content:
            article.eye_catch_url || `https://${process.env.DOMAIN}/d/nuxt/dist/OGP_1200×630.png`
        }
      ]
    }
  }
}
</script>
