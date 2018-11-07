<template>
  <app-modal :title="title" :showModalContent="articleReportModal.isShow">
    <div slot="modal-content">
      <article-report-select-reason-modal v-if="isSelectReasonModal" />
      <article-report-input-free-text-modal v-if="isInputFreeTextModal" />
      <article-report-confirmation-modal v-if="isConfirmationModal" />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import ArticleReportSelectReasonModal from '../molecules/ArticleReportSelectReasonModal'
import ArticleReportInputFreeTextModal from '../molecules/ArticleReportInputFreeTextModal'
import ArticleReportConfirmationModal from '../molecules/ArticleReportConfirmationModal'

export default {
  components: {
    AppModal,
    ArticleReportSelectReasonModal,
    ArticleReportInputFreeTextModal,
    ArticleReportConfirmationModal
  },
  computed: {
    title() {
      if (this.isSelectReasonModal) {
        return '報告理由の選択'
      } else if (this.isInputFreeTextModal) {
        return '報告内容の詳細'
      } else if (this.isConfirmationModal) {
        return ''
      }
    },
    isSelectReasonModal() {
      return this.articleReportModal.isSelectReasonModal
    },
    isInputFreeTextModal() {
      return this.articleReportModal.isInputFreeTextModal
    },
    isConfirmationModal() {
      return this.articleReportModal.isConfirmationModal
    },
    ...mapGetters('report', ['articleReportModal'])
  }
}
</script>
