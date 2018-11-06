<template>
  <app-modal :title="title" :showModalContent="userReportModal.isShow">
    <div slot="modal-content">
      <user-report-select-reason-modal v-if="isSelectReasonModal" />
      <user-report-input-free-text-modal v-if="isInputFreeTextModal" />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import UserReportSelectReasonModal from '../molecules/UserReportSelectReasonModal'
import UserReportInputFreeTextModal from '../molecules/UserReportInputFreeTextModal'

export default {
  components: {
    AppModal,
    UserReportSelectReasonModal,
    UserReportInputFreeTextModal
  },
  computed: {
    title() {
      if (this.isSelectReasonModal) {
        return '報告理由の選択'
      } else if (this.isInputFreeTextModal) {
        return '報告内容の詳細'
      }
    },
    isSelectReasonModal() {
      return this.userReportModal.isSelectReasonModal
    },
    isInputFreeTextModal() {
      return this.userReportModal.isInputFreeTextModal
    },
    ...mapGetters('user', ['userReportModal'])
  }
}
</script>
