<template>
  <deposit-token />
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DepositToken from '~/components/pages/DepositToken'
import { isMobile } from '~/utils/device'

export default {
  components: {
    DepositToken
  },
  mounted() {
    if (isMobile()) {
      this.$router.replace('/')
      return
    }
    if (this.loggedIn && !this.currentUser.phoneNumberVerified) {
      this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'depositToken' })
      this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
      this.$router.replace('/')
    }
  },
  computed: {
    ...mapGetters('user', ['loggedIn', 'currentUser'])
  },
  methods: {
    ...mapActions('user', [
      'setRequestPhoneNumberVerifyModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberModal'
    ])
  },
  head() {
    return {
      title: '入金'
    }
  }
}
</script>
