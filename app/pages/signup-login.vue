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
  }
}
</script>
