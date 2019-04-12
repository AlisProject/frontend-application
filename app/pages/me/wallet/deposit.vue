<template>
  <deposit-token />
</template>

<script>
import DepositToken from '~/components/pages/DepositToken'
import { isMobile } from '~/utils/device'

export default {
  components: {
    DepositToken
  },
  mounted() {
    if (isMobile()) this.$router.replace('/')
  }
}
</script>
