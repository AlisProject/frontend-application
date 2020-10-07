<template>
  <component
    :is="componentName"
    :article="article"
    :userPopularArticles="userPopularArticles"
    :topic="topicDisplayName"
  />
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BlankPage from '~/components/pages/BlankPage'
import ArticleDetailV1 from '~/components/pages/ArticleDetailV1'
import ArticleDetailV2 from '~/components/pages/ArticleDetailV2'
import { htmlDecode, isV2, showEmbed } from '~/utils/article'

export default {
  components: {
    BlankPage,
    ArticleDetailV1,
    ArticleDetailV2
  },
  data() {
    return {
      componentName: 'BlankPage'
    }
  },
  async fetch({ store, params, error, redirect }) {
    try {
      const { articleId } = params
      let getArticleType = 'getArticleDetail'
      if (process.client) {
        const loggedIn = store.state.user.loggedIn
        if (loggedIn) await store.dispatch('article/setPurchasedArticleIds')
        const isCurrentUser = loggedIn && params.userId === store.state.user.currentUser.userId
        const isPurchased = loggedIn && store.state.article.purchasedArticleIds.includes(articleId)

        if (isCurrentUser) {
          getArticleType = 'getPublicArticleDetail'
        } else if (isPurchased) {
          getArticleType = 'getPurchaedArticleDetail'
        }
      }
      await Promise.all([
        store.dispatch(`article/${getArticleType}`, { articleId }),
        store.dispatch('article/getArticleSupporters', { articleId }),
        store.dispatch('user/resetUserPopularArticles', {})
      ])
      if (params.userId !== store.state.article.article.user_id) {
        redirect(
          `/${store.state.article.article.user_id}/articles/${
            store.state.article.article.article_id
          }`
        )
      }
      await store.dispatch('article/getTopics')
      store.dispatch('article/setTopicDisplayName', {
        topicName: store.state.article.article.topic
      })
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  created() {
    if (isV2(this.article)) {
      this.componentName = 'ArticleDetailV2'
    } else {
      this.componentName = 'ArticleDetailV1'
    }
  },
  async mounted() {
    const { articleId, userId } = this.$route.params

    // 記事情報取得
    if (this.loggedIn) {
      if (this.currentUser.phoneNumberVerified) await this.postPv({ articleId })
      await this.getIsLikedArticle({ articleId })
      await this.updateArticleCommentsByCommentIds({ articleId })

      // 自分の記事の場合は getPublicArticleDetail より記事情報を取得する。
      // 但し、fetch 時に取得済みの場合は実施しない
      if (this.isCurrentUser && !this.$store.state.article.isFetchedPublicArticle) {
        await this.$store.dispatch('article/getPublicArticleDetail', { articleId })
        this.$store.dispatch('article/setIsFetchedPublicArticle', { isFetched: true })
        const paywallLine = document.querySelector('.paywall-line')
        if (paywallLine) {
          paywallLine.innerHTML = `これより上のエリアが<span class="br" />無料で表示されます`
        }
        showEmbed()
        // 記事を購入していた場合は getPurchaedArticleDetail より記事情報を取得する。
        // 但し、fetch 時に取得済みの場合は実施しない
      } else if (!this.isCurrentUser && !this.$store.state.article.isFetchedPurchasedArticle) {
        await this.$store.dispatch('article/setPurchasedArticleIds')
        const isPurchased =
          this.loggedIn && this.$store.state.article.purchasedArticleIds.includes(articleId)
        if (isPurchased) {
          await this.$store.dispatch('article/getPurchaedArticleDetail', { articleId })
          const paywallLine = document.querySelector('.paywall-line')
          if (paywallLine) paywallLine.remove()
          showEmbed()
        }
      }
    } else {
      this.setIsLikedArticle({ liked: false })
    }
    // 該当ユーザの人気記事取得
    await this.getTopUserPopularArticles({ userId, excludeArticleId: articleId })
    // コメント取得
    await this.setArticleComments({ articleId })
  },
  computed: {
    isCurrentUser() {
      return this.loggedIn && this.$route.params.userId === this.currentUser.userId
    },
    ...mapGetters('user', ['loggedIn', 'currentUser', 'userPopularArticles']),
    ...mapGetters('article', ['article', 'topicDisplayName'])
  },
  methods: {
    ...mapActions('article', [
      'postPv',
      'getIsLikedArticle',
      'setIsLikedArticle',
      'setArticleComments',
      'updateArticleCommentsByCommentIds'
    ]),
    ...mapActions('user', ['getTopUserPopularArticles'])
  },
  head() {
    const { article } = this.$store.state.article
    const decodedArticleTitle = htmlDecode(article.title)
    const decodedArticleOverview = htmlDecode(article.overview)
    const eyeCatchUrl = article.eye_catch_url ? `${article.eye_catch_url}?d=1200x630` : null

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
            eyeCatchUrl || `https://${process.env.ALIS_APP_DOMAIN}/d/nuxt/dist/OGP_1200×630.png`
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content:
            eyeCatchUrl || `https://${process.env.ALIS_APP_DOMAIN}/d/nuxt/dist/OGP_1200×630.png`
        }
      ]
    }
  }
}
</script>
