<template>
  <top-page/>
</template>

<script>
import TopPage from '~/components/pages/TopPage'

export default {
  components: {
    TopPage
  },
  async fetch({ store }) {
    store.dispatch('user/setLoginModal', { showLoginModal: true })

    await store.dispatch('article/getAllArticles')
    const { articles } = store.state.article
    await store.dispatch('article/getUserInfos', { articles })
    await store.dispatch('article/getAlisTokens', { articles })
    const { userInfos, alisTokens } = store.state.article
    store.dispatch('article/setUserInfoToArticles', {
      articles,
      userInfos
    })
    store.dispatch('article/setAlisTokenToArticles', {
      articles,
      alisTokens
    })
  },
  created() {
    if (process.browser) document.querySelector('html,body').style.overflow = 'hidden'
  }
}
</script>
