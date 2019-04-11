<template>
  <app-modal title>
    <div slot="modal-content">
      <withdrawal-detail-modal-content />
    </div>
  </app-modal>
</template>

<script>
import AppModal from '../atoms/AppModal'
import WithdrawalDetailModalContent from '../molecules/WithdrawalDetailModalContent'

export default {
  components: {
    AppModal,
    WithdrawalDetailModalContent
  }
}
</script>
