<template>
  <public-article :article="article"/>
</template>

<script>
import { mapGetters } from 'vuex'
import PublicArticle from '~/components/pages/PublicArticle'

export default {
  components: {
    PublicArticle
  },
  beforeCreate() {
    const { articleId } = this.$route.params
    this.$store.dispatch('article/getPublicArticleDetail', { articleId })
  },
  computed: {
    ...mapGetters('article', ['article'])
  }
}
</script>
