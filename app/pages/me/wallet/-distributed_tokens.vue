<template>
  <distributed-tokens />
</template>

<script>
import DistributedTokens from '~/components/pages/DistributedTokens'

export default {
  components: {
    DistributedTokens
  },
  async mounted() {
    this.$store.dispatch('user/getDistributedTokens')
  }
}
</script>
