<template>
  <div class="tip-flow-completed-modal">
    <span class="completed-message">
      贈り物を受け付けました
    </span>
    <span class="description">
      贈り先へ届くまでしばらくお待ち下さい
    </span>
    <app-button class="close-button" @click="closeModal">
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
    ...mapGetters('user', ['tipTokenAmount', 'currentUserInfo'])
  },
  methods: {
    closeModal() {
      this.setTipModal({ showTipModal: false })
      this.setTipFlowCompletedModal({ isShow: false })
      if (!this.currentUserInfo.is_tipped_article) {
        this.setFirstProcessModal({ isShow: true })
        this.setFirstProcessTippedArticleModal({ isShow: true })
      }
    },
    ...mapActions('user', [
      'setTipModal',
      'setTipFlowCompletedModal',
      'setFirstProcessModal',
      'setFirstProcessTippedArticleModal'
    ])
  }
}
</script>

<style lang="scss" scoped>
.completed-message {
  color: #030303;
  display: block;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.8px;
  margin-top: 100px;
  text-align: center;
}

.description {
  color: #6e6e6e;
  display: block;
  font-size: 12px;
  margin-top: 20px;
  text-align: center;
  line-height: 1.5;
}

.close-button {
  margin: 40px auto 80px;
}

@media screen and (max-width: 550px) {
  .completed-message {
    // 74px - half height of .tip-flow-completed-modal
    margin-top: calc(50vh - 74px);
  }

  .close-button {
    // 74px - half height of .tip-flow-completed-modal
    margin: 40px auto calc(50vh - 74px);
  }
}
</style>
