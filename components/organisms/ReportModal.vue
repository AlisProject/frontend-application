<template>
  <app-modal title="" class="cover-screen">
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
