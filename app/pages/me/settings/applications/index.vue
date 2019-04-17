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
  mounted() {
    if (isMobile()) this.$router.replace('/')
  }
}
</script>
