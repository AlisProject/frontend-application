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
      const { oauth_token: oauthToken, oauth_verifier: oauthVerifier } = this.$route.query

      // history.replaceState(null, null, '/articles/popular?topic=crypto')

      if (!oauthToken || !oauthVerifier) return
      const { hasAliasUserId, status } = await this.$store.dispatch('user/checkAuthByTwitter', {
        oauthToken,
        oauthVerifier
      })
      if (!hasAliasUserId) {
        this.$store.dispatch('user/setSignUpAuthFlowModal', { showSignUpAuthFlowModal: true })
        this.$store.dispatch('user/setSignUpAuthFlowInputAliasUserIdModal', { isShow: true })
        return
      }
      await this.$store.dispatch('user/getUserSession')
      if (status === 'login') return
      this.$store.dispatch('user/setSignUpAuthFlowModal', { showSignUpAuthFlowModal: true })
      this.$store.dispatch('user/setSignUpAuthFlowCompletedAuthModal', { isShow: true })
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
