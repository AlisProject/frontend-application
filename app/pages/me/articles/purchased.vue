<template>
  <purchased-articles />
</template>

<script>
import PurchasedArticles from '~/components/pages/PurchasedArticles'

export default {
  components: {
    PurchasedArticles
  },
  async fetch({ store, params, from = {}, error }) {
    // ユーザー記事の初期化
    // 記事から遷移してきた場合は、スクロール位置を保持させたいので初期化はしない。
    if (
      from.name !== 'userId-articles-articleId' ||
      store.state.user.userArticlesCurrentUserId !== params.userId
    ) {
      store.dispatch('user/resetPurchasedArticles')
      store.dispatch('user/resetPurchasedArticlesLastEvaluatedKey')
    }
  },
  async mounted() {
    try {
      await this.$store.dispatch('article/getPurchasedArticles')
    } catch (error) {
      this.$root.error({ statusCode: 404 })
    }
  },
  head: {
    title: '購入した記事'
  }
}
</script>
