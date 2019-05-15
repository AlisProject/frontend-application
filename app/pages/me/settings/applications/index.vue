<template>
  <application-list />
</template>

<script>
import ApplicationList from '~/components/pages/ApplicationList'
import { isMobile } from '~/utils/device'

export default {
  components: {
    ApplicationList
  },
  async mounted() {
    if (isMobile()) this.$router.replace('/')
    await this.$store.dispatch('user/getApplications')
  }
}
</script>
