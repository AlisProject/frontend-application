<template>
  <app-modal title="" class="cover-screen">
    <div slot="modal-content">
      <tip-flow-select-tip-amount />
    </div>
  </app-modal>
</template>

<script>
import AppModal from '../atoms/AppModal'
import TipFlowSelectTipAmount from '../molecules/TipFlowSelectTipAmount'

export default {
  components: {
    AppModal,
    TipFlowSelectTipAmount
  }
}
</script>
