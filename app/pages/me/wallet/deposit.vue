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
  async mounted() {
    if (isMobile()) {
      this.$router.replace('/')
      return
    }
    if (this.loggedIn && !this.currentUser.phoneNumberVerified) {
      this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'depositToken' })
      this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
      this.$router.replace('/')
    }
    const encryptInfo = await this.getWalletEncryptInfo()
    if (this.loggedIn && !encryptInfo.encrypted_secret_key) {
      this.setRequestWalletPasswordModal({ isShow: true })
      this.setRequestInputWalletPasswordModal({ isShow: true })
    }
  },
  computed: {
    ...mapGetters('user', ['loggedIn', 'currentUser'])
  },
  methods: {
    ...mapActions('user', [
      'setRequestPhoneNumberVerifyModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberModal',
      'getWalletEncryptInfo',
      'setRequestWalletPasswordModal',
      'setRequestInputWalletPasswordModal'
    ])
  },
  head() {
    return {
      title: '入金'
    }
  }
}
</script>
