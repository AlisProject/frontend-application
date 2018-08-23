<template>
  <app-modal title="" class="cover-screen">
    <div slot="modal-content">
      <tip-flow-select-tip-amount-modal v-if="isSelectTipAmountModal"/>
      <tip-flow-confirmation-modal v-if="isConfirmationModal"/>
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import TipFlowSelectTipAmountModal from '../molecules/TipFlowSelectTipAmountModal'
import TipFlowConfirmationModal from '../molecules/TipFlowConfirmationModal'

export default {
  components: {
    AppModal,
    TipFlowSelectTipAmountModal,
    TipFlowConfirmationModal
  },
  computed: {
    isSelectTipAmountModal() {
      return this.tipFlowModal.isSelectTipAmountModal
    },
    isConfirmationModal() {
      return this.tipFlowModal.isConfirmationModal
    },
    ...mapGetters('user', ['tipFlowModal'])
  }
}
</script>
