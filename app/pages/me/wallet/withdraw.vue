<template>
  <withdraw-token />
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import WithdrawToken from '~/components/pages/WithdrawToken'
import { isMobile } from '~/utils/device'

export default {
  components: {
    WithdrawToken
  },
  mounted() {
    if (isMobile()) {
      this.$router.replace('/')
      return
    }
    if (this.loggedIn && !this.currentUser.phoneNumberVerified) {
      this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'withdrawToken' })
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
  }
}
</script>
