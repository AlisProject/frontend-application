<template>
  <oauth-authenticate />
</template>

<script>
import OauthAuthenticate from '~/components/pages/OauthAuthenticate'

export default {
  components: {
    OauthAuthenticate
  },
  mounted() {
    const { loggedIn, currentUser } = this.$store.state.user
    if (loggedIn) {
      if (!currentUser.phoneNumberVerified) {
        this.$store.dispatch('user/setRequestPhoneNumberVerifyModal', {
          isShow: true,
          requestType: 'provideInfo'
        })
        this.$store.dispatch('user/setRequestPhoneNumberVerifyInputPhoneNumberModal', {
          isShow: true
        })
      }
    } else {
      this.$router.push('/login')
    }
  },
  head: {
    title: 'アプリケーション認証',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'アプリケーション認証 | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'アプリケーション認証'
      }
    ]
  }
}
</script>
