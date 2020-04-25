<template>
  <app-modal :title="title" :show-modal-content="requestWalletPasswordModal.isShow">
    <div slot="modal-content">
      <request-input-wallet-password-modal-form v-if="isRequestInputWalletPasswordModal" />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import RequestInputWalletPasswordModalForm from '../molecules/RequestInputWalletPasswordModalForm'

export default {
  components: {
    AppModal,
    RequestInputWalletPasswordModalForm
  },
  computed: {
    title() {
      if (this.isRequestInputWalletPasswordModal) {
        return 'ウォレットパスワード設定'
      }
    },
    isRequestInputWalletPasswordModal() {
      return this.requestWalletPasswordModal.isRequestInputWalletPasswordModal
    },
    ...mapGetters('user', ['requestWalletPasswordModal'])
  }
}
</script>
