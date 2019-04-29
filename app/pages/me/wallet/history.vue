<template>
  <withdrawal-details />
</template>

<script>
import WithdrawalDetails from '~/components/pages/WithdrawalDetails'
import { isMobile } from '~/utils/device'

export default {
  components: {
    WithdrawalDetails
  },
  mounted() {
    if (isMobile()) this.$router.replace('/')
  },
  head() {
    return {
      title: '入出金履歴'
    }
  }
}
</script>
