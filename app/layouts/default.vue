<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  mounted() {
    // セルフXSS対策
    this.warnSelfXss()

    const userId =
      localStorage.getItem(
        `CognitoIdentityServiceProvider.${process.env.CLIENT_ID}.LastAuthUser`
      ) || ''
    const externalProviderUserIdPrefix = ['LINE-', 'Twitter-', 'Facebook-', 'Yahoo-']
    const isExternalProviderUserId = externalProviderUserIdPrefix.some((prefix) =>
      userId.startsWith(prefix)
    )

    if (isExternalProviderUserId) {
      this.$store.dispatch('user/setSignUpAuthFlowModal', { showSignUpAuthFlowModal: true })
      this.$store.dispatch('user/setSignUpAuthFlowInputUserIdModal', { isShow: true })
    }

    if (location.pathname.startsWith('/me/')) {
      if (!this.loggedIn) {
        this.$router.push('/login')
      }
    }
  },
  computed: {
    ...mapGetters('user', ['loggedIn'])
  },
  methods: {
    warnSelfXss() {
      if (process.env.NODE_ENV !== 'development') {
        const style = `font-size: 1.2rem; line-height: 1.5; font-family: 'Yu Gothic', sans-serif;`
        console.log('%c警告：', 'font-size: 1.7rem; color: red;')
        console.log(
          '%cこれは開発者向けのブラウザ機能です。ここに何かをコピー・貼り付けするように言われた場合、それは第三者があなたのALISアカウントへのアクセスを得るための不正行為である危険性があります。',
          style
        )
        console.log('%cよくわからないコードは入力したり貼り付けたりしないでください。', style)
      }
    }
  },
  watch: {
    $route(to, from) {
      // ログインが必要なページに遷移した場合、ユーザーにログインを求めるために
      // ログインモーダルを表示する必要があるためモーダルを消す処理をスキップ
      if (to.name === 'login') return
      this.$root.$emit('closeModal')
    }
  },
  head() {
    return {
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `https://${process.env.DOMAIN}${this.$route.fullPath}`
        }
      ]
    }
  }
}
</script>

<style>
@import 'normalize.css';

@font-face {
  font-family: 'Yu Gothic';
  src: local('Yu Gothic Medium');
  font-weight: 100;
}
@font-face {
  font-family: 'Yu Gothic';
  src: local('Yu Gothic Medium');
  font-weight: 200;
}
@font-face {
  font-family: 'Yu Gothic';
  src: local('Yu Gothic Medium');
  font-weight: 300;
}
@font-face {
  font-family: 'Yu Gothic';
  src: local('Yu Gothic Medium');
  font-weight: 400;
}
@font-face {
  font-family: 'Yu Gothic';
  src: local('Yu Gothic Bold');
  font-weight: bold;
}

body {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: 'Yu Gothic', YuGothic, 'Helvetica Neue', Helvetica, Arial, 游ゴシック体, '游ゴシック',
    'ヒラギノ角ゴ ProN W3', 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ Pro W3',
    'Hiragino Kaku Gothic Pro', 'メイリオ', Meiryo, 'MS ゴシック', 'MS Gothic', sans-serif;
}

button,
input,
select,
textarea {
  font-family: inherit;
}
</style>
