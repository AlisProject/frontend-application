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
  async mounted() {
    if (isMobile()) {
      this.$router.replace('/')
      return
    }
    if (this.loggedIn && !this.currentUser.phoneNumberVerified) {
      this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'withdrawToken' })
      this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
      this.$router.replace('/')
    }

    // ウォレット未移行の場合はdepositへ遷移しモーダルを表示
    const encryptInfo = await this.getWalletEncryptInfo()
    if (this.loggedIn && !encryptInfo.encrypted_secret_key) {
      this.$router.replace('/me/wallet/deposit')
    }
  },
  computed: {
    ...mapGetters('user', ['loggedIn', 'currentUser'])
  },
  methods: {
    ...mapActions('user', [
      'getWalletEncryptInfo',
      'setRequestPhoneNumberVerifyModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberModal'
    ])
  },
  head() {
    return {
      title: '出金'
    }
  }
}
</script>
