<template>
  <withdraw-token />
</template>

<script>
import WithdrawToken from '~/components/pages/WithdrawToken'
import { isMobile } from '~/utils/device'

export default {
  components: {
    WithdrawToken
  },
  mounted() {
    if (isMobile()) this.$router.replace('/')
  }
}
</script>
