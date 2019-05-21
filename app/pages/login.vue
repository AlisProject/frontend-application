<template>
  <top-page />
</template>

<script>
import TopPage from '~/components/pages/TopPage'
import { setOAuthParams, removeOAuthParams } from '~/utils/oauth'

export default {
  components: {
    TopPage
  },
  async fetch({ store, error, from = {} }) {
    try {
      // 認可画面からの遷移の場合、クエリ文字列の値をローカルストレージに保存する。
      // そうでなかった場合はローカルストレージに保存された値を消したいが、fetch 時には
      // ローカルストレージにアクセスできないため、このコンポーネントの
      // mounted で消す処理を行うためのフラグを true にしている。
      if (process.client && from.name === 'oauth-authenticate') {
        setOAuthParams(from.query)
      } else {
        store.dispatch('user/setShouldDeleteOAuthParams', { shouldDelete: true })
      }

      store.dispatch('user/setLoginModal', { showLoginModal: true })

      await store.dispatch('article/getTopics')
      store.dispatch('article/resetArticleData')
      await Promise.all([
        store.dispatch('article/getEyecatchArticles'),
        store.dispatch('article/getRecommendedArticles')
      ])
    } catch (e) {
      store.dispatch('user/setLoginModal', { showLoginModal: false })
      error({ statusCode: 404 })
    }
  },
  mounted() {
    if (this.$store.state.user.shouldDeleteOAuthParams) {
      removeOAuthParams()
      this.$store.dispatch('user/setShouldDeleteOAuthParams', { shouldDelete: false })
    }
  },
  head: {
    title: 'ログイン',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'ログイン | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'ログイン'
      }
    ]
  }
}
</script>
