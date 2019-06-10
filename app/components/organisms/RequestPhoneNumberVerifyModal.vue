<template>
  <app-modal :title="title" :show-modal-content="requestPhoneNumberVerifyModal.isShow">
    <div slot="modal-content">
      <request-phone-number-verify-input-phone-number-modal-form v-if="isInputPhoneNumberModal" />
      <request-phone-number-verify-input-auth-code-modal-form v-if="isInputAuthCodeModal" />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import RequestPhoneNumberVerifyInputPhoneNumberModalForm from '../molecules/RequestPhoneNumberVerifyInputPhoneNumberModalForm'
import RequestPhoneNumberVerifyInputAuthCodeModalForm from '../molecules/RequestPhoneNumberVerifyInputAuthCodeModalForm'

export default {
  components: {
    AppModal,
    RequestPhoneNumberVerifyInputPhoneNumberModalForm,
    RequestPhoneNumberVerifyInputAuthCodeModalForm
  },
  computed: {
    title() {
      if (this.isInputPhoneNumberModal) {
        return 'アカウント認証'
      } else if (this.isInputAuthCodeModal) {
        return '認証コードの確認'
      }
    },
    isInputPhoneNumberModal() {
      return this.requestPhoneNumberVerifyModal.isInputPhoneNumberModal
    },
    isInputAuthCodeModal() {
      return this.requestPhoneNumberVerifyModal.isInputAuthCodeModal
    },
    ...mapGetters('user', ['requestPhoneNumberVerifyModal'])
  }
}
</script>
