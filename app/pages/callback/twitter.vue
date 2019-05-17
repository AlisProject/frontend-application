<template>
  <top-page />
</template>

<script>
import { mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import TopPage from '~/components/pages/TopPage'
import { getOAuthParams, removeOAuthParams } from '~/utils/oauth'

export default {
  components: {
    TopPage
  },
  async fetch({ store }) {
    await store.dispatch('article/getTopics')
    store.dispatch('article/resetArticleData')
    await Promise.all([
      store.dispatch('article/getEyecatchArticles'),
      store.dispatch('article/getRecommendedArticles')
    ])
  },
  async mounted() {
    try {
      const { oauth_token: oauthToken, oauth_verifier: oauthVerifier } = this.$route.query

      this.$router.replace('/')

      if (!oauthToken || !oauthVerifier) return
      const { hasUserId, status } = await this.$store.dispatch('user/checkAuthByTwitter', {
        oauthToken,
        oauthVerifier
      })
      if (!hasUserId) {
        this.$store.dispatch('user/setSignUpAuthFlowModal', { showSignUpAuthFlowModal: true })
        this.$store.dispatch('user/setSignUpAuthFlowInputUserIdModal', { isShow: true })
        return
      }
      await this.$store.dispatch('user/getUserSession')
      if (status === 'login') {
        const oauthParams = getOAuthParams()
        if (oauthParams) {
          this.$router.push({ path: 'oauth-authenticate', query: { ...oauthParams } })
          removeOAuthParams()
        }
        return
      }
      this.$store.dispatch('user/setSignUpAuthFlowModal', { showSignUpAuthFlowModal: true })
      this.$store.dispatch('user/setSignUpAuthFlowInputPhoneNumberModal', {
        isSignUpAuthFlowInputPhoneNumberModal: true
      })
    } catch (error) {
      const { message } = error.response.data
      switch (message) {
        case 'EmailExistsException':
          this.sendNotification({
            text: 'ご利用いただいた外部サービスに紐づくメールアドレスは既に登録されています'
          })
          this.$store.dispatch('user/setSignUpModal', { showSignUpModal: true })
          break
        default:
          this.sendNotification({
            text: 'エラーが発生しました。お手数ですが、時間をおいて再度お試しください',
            type: 'warning'
          })
          break
      }
    }
  },
  methods: {
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    })
  }
}
</script>
