<template>
  <app-modal title="">
    <div slot="modal-content">
      <tip-flow-select-tip-amount-modal v-if="isSelectTipAmountModal" />
      <tip-flow-confirmation-modal v-else-if="isConfirmationModal" />
      <tip-flow-completed-modal v-else-if="isCompletedModal" />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import TipFlowSelectTipAmountModal from '../molecules/TipFlowSelectTipAmountModal'
import TipFlowConfirmationModal from '../molecules/TipFlowConfirmationModal'
import TipFlowCompletedModal from '../molecules/TipFlowCompletedModal'

export default {
  components: {
    AppModal,
    TipFlowSelectTipAmountModal,
    TipFlowConfirmationModal,
    TipFlowCompletedModal
  },
  computed: {
    isSelectTipAmountModal() {
      return this.tipFlowModal.isSelectTipAmountModal
    },
    isConfirmationModal() {
      return this.tipFlowModal.isConfirmationModal
    },
    isCompletedModal() {
      return this.tipFlowModal.isCompletedModal
    },
    ...mapGetters('user', ['tipFlowModal'])
  }
}
</script>
