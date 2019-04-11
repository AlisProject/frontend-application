<template>
  <purchased-articles />
</template>

<script>
import PurchasedArticles from '~/components/pages/PurchasedArticles'

export default {
  components: {
    PurchasedArticles
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
