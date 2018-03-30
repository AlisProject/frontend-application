<template>
  <app-modal title="">
    <div slot="modal-content">
      <report-modal-content />
    </div>
  </app-modal>
</template>

<script>
import AppModal from '../atoms/AppModal'
import ReportModalContent from '../molecules/ReportModalContent'

export default {
  components: {
    AppModal,
    ReportModalContent
  }
}
</script>
