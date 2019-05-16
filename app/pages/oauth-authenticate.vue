<template>
  <oauth-authenticate />
</template>

<script>
import OauthAuthenticate from '~/components/pages/OauthAuthenticate'

export default {
  components: {
    OauthAuthenticate
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
