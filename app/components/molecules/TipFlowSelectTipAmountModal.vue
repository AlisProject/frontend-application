<template>
  <div class="tip-flow-select-tip-amount-modal">
    <p>応援してほしいメッセージ</p>
    <p>{{ tipTokenAmount }} ALIS</p>
    <button @click="addTipTokenAmount(10)">10</button>
    <button @click="addTipTokenAmount(1)">1</button>
    <button @click="addTipTokenAmount(0.1)">0.1</button>
    <app-button @click="moveToConfirmationPage">
      応援する
    </app-button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  },
  data() {
    return {
      tipTokenAmount: 0
    }
  },
  mounted() {
    this.getUsersAlisToken()
  },
  computed: {
    ...mapGetters('user', ['alisToken'])
  },
  methods: {
    addTipTokenAmount(amount) {
      // TODO: BigNumber等のライブラリを使う
      const isAddableToken = this.tipTokenAmount <= 10.5 - amount
      // const isAddableToken = this.tipTokenAmount <= this.alisToken - amount
      if (!isAddableToken) return
      this.tipTokenAmount += amount
    },
    moveToConfirmationPage() {
      this.setTipTokenAmount({ tipTokenAmount: this.tipTokenAmount })
      this.setTipFlowSelectTipAmountModal({ isShow: false })
      this.setTipFlowConfirmationModal({ isShow: true })
    },
    ...mapActions('user', [
      'getUsersAlisToken',
      'setTipFlowSelectTipAmountModal',
      'setTipFlowConfirmationModal',
      'setTipTokenAmount'
    ])
  }
}
</script>


<style lang="scss" scoped>
.tip-flow-select-tip-amount-modal {
}
</style>
