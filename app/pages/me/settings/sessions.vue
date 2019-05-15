<template>
  <connected-application-list />
</template>

<script>
import ConnectedApplicationList from '~/components/pages/ConnectedApplicationList'

export default {
  components: {
    ConnectedApplicationList
  },
  async mounted() {
    await this.$store.dispatch('user/getConnectedApplications')
  }
}
</script>
