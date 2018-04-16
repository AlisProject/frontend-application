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
    store.dispatch('user/setSignUpAuthFlowModal', { showSignUpAuthFlowModal: true })
    store.dispatch('user/setSignUpAuthFlowLoginModal', { isSignUpAuthFlowLoginModal: true })

    await store.dispatch('article/getPopularArticles')
  },
  mounted() {
    if (window.innerWidth <= 550) {
      document.querySelector('html,body').style.overflow = ''
    }
  },
  head: {
    title: 'サインアップ'
  }
}
</script>
