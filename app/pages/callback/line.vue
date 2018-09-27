<template>
  <popular-article-list/>
</template>

<script>
import PopularArticleList from '~/components/pages/PopularArticleList'

export default {
  components: {
    PopularArticleList
  },
  async mounted() {
    try {
      global.showModal = () => {
        this.$store.dispatch('user/setSignUpAuthFlowModal', { showSignUpAuthFlowModal: true })
        this.$store.dispatch('user/setSignUpAuthFlowInputAliasUserIdModal', { isShow: true })
      }
      const { code } = this.$route.query

      // history.replaceState(null, null, '/articles/popular?topic=crypto')

      if (!code) return
      const { hasAliasUserId, status } = await this.$store.dispatch('user/checkAuthByLine', {
        code
      })
      if (!hasAliasUserId) {
        this.$store.dispatch('user/setSignUpAuthFlowModal', { showSignUpAuthFlowModal: true })
        this.$store.dispatch('user/setSignUpAuthFlowInputAliasUserIdModal', { isShow: true })
        return
      }
      if (status === 'login') return
      this.$store.dispatch('user/setSignUpAuthFlowModal', { showSignUpAuthFlowModal: true })
      this.$store.dispatch('user/setSignUpAuthFlowCompletedAuthModal', { isShow: true })
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
