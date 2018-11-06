<template>
  <app-modal :title="title" :showModalContent="userReportModal.isShow">
    <div slot="modal-content">
      <user-report-select-reason-modal v-if="isSelectReasonModal" />
      <request-phone-number-verify-input-auth-code-modal-form v-if="isInputAuthCodeModal" />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import UserReportSelectReasonModal from '../molecules/UserReportSelectReasonModal'
import RequestPhoneNumberVerifyInputAuthCodeModalForm from '../molecules/RequestPhoneNumberVerifyInputAuthCodeModalForm'

export default {
  components: {
    AppModal,
    UserReportSelectReasonModal,
    RequestPhoneNumberVerifyInputAuthCodeModalForm
  },
  computed: {
    title() {
      if (this.isSelectReasonModal) {
        return '報告理由の選択'
      } else if (this.isInputAuthCodeModal) {
        return '認証コードの確認'
      }
    },
    isSelectReasonModal() {
      return this.userReportModal.isSelectReasonModal
    },
    isInputAuthCodeModal() {
      return this.userReportModal.isInputAuthCodeModal
    },
    ...mapGetters('user', ['userReportModal'])
  }
}
</script>
