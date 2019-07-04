<template>
  <user-article-list />
</template>

<script>
import { mapGetters } from 'vuex'
import UserArticleList from '~/components/pages/UserArticleList'

export default {
  components: {
    UserArticleList
  },
  async fetch({ store, params, from = {}, error }) {
    // ユーザー記事の初期化
    // 記事から遷移してきた場合は、スクロール位置を保持させたいので初期化はしない。
    if (
      from.name !== 'userId-articles-articleId' ||
      store.state.user.userArticlesCurrentUserId !== params.userId
    ) {
      store.dispatch('user/resetUserArticles')
      store.dispatch('user/resetUserArticlesLastEvaluatedKey')
    }
    try {
      await store.dispatch('user/setUserInfo', { userId: params.userId })
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  async mounted() {
    try {
      if (this.isCurrentUser) {
        await this.$store.dispatch('article/getPublicArticles')
      } else {
        await this.$store.dispatch('user/getUserArticles', { userId: this.$route.params.userId })
      }
    } catch (error) {
      this.$root.error({ statusCode: 404 })
    }
  },
  computed: {
    isCurrentUser() {
      return this.loggedIn && this.$route.params.userId === this.currentUser.userId
    },
    ...mapGetters('user', ['loggedIn', 'currentUser'])
  },
  head() {
    return {
      title: this.$store.state.user.userInfo.user_id,
      meta: [
        {
          hid: `og:title`,
          property: 'og:title',
          content: `${this.$store.state.user.userInfo.user_id} | ALIS`
        },
        {
          hid: `og:description`,
          property: 'og:description',
          content: `${this.$store.state.user.userInfo.user_id}'s page.`
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
