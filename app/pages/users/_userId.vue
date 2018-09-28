<template>
  <user-article-list/>
</template>

<script>
import UserArticleList from '~/components/pages/UserArticleList'

export default {
  components: {
    UserArticleList
  },
  async fetch({ store, params, error }) {
    try {
      await store.dispatch('user/setUserInfo', { userId: params.userId })
      await store.dispatch('user/getUserArticles', { userId: params.userId })
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  beforeDestroy() {
    this.$store.dispatch('user/resetUserArticles')
    this.$store.dispatch('user/resetUserArticlesLastEvaluatedKey')
  },
  head() {
    const userId =
      this.$store.state.user.userInfo.alias_user_id || this.$store.state.user.userInfo.user_id
    return {
      title: userId,
      meta: [
        {
          hid: `og:title`,
          property: 'og:title',
          content: `${userId} | ALIS`
        },
        {
          hid: `og:description`,
          property: 'og:description',
          content: `${userId}'s page.`
        },
        {
          hid: `og:type`,
          property: 'og:type',
          content: 'author'
        },
        {
          hid: `og:image`,
          property: 'og:image',
          content:
            this.$store.state.user.userInfo.icon_image_url ||
            `https://${process.env.DOMAIN}/d/nuxt/dist/icon_user_noimg.png`
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content:
            this.$store.state.user.userInfo.icon_image_url ||
            `https://${process.env.DOMAIN}/d/nuxt/dist/icon_user_noimg.png`
        }
      ]
    }
  }
}
</script>
