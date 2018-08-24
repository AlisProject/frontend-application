<template>
  <div>
    <p>トークン送付の確認</p>
    <p>{{ tipTokenAmount }} ALIS</p>
    <app-button @click="moveToCompletedPage">
      トークンを送付する
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
  computed: {
    ...mapGetters('user', ['tipTokenAmount'])
  },
  methods: {
    moveToCompletedPage() {
      this.setTipFlowConfirmationModal({ isShow: false })
      this.setTipFlowCompletedModal({ isShow: true })
    },
    ...mapActions('user', ['setTipFlowConfirmationModal', 'setTipFlowCompletedModal'])
  }
}
</script>
