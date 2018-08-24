<template>
  <div>
    <p>トークンの送付を受け付けました</p>
    <p>受付を完了しました。送付先へ届くまでしばらくお待ち下さい</p>
    <app-button @click="closeModal">
      閉じる
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
    closeModal() {
      this.setTipModal({ showTipModal: false })
      this.setTipFlowCompletedModal({ isShow: false })
    },
    ...mapActions('user', ['setTipModal', 'setTipFlowCompletedModal'])
  }
}
</script>

