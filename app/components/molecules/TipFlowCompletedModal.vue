<template>
  <div class="tip-flow-completed-modal">
    <span class="completed-message">
      贈り物を受け付けました
    </span>
    <span class="description">
      受付を完了しました。贈り先へ届くまでしばらくお待ち下さい
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
    ...mapGetters('user', ['tipTokenAmount'])
  },
  mounted() {
    window.scrollTo(0, 0)
  },
  methods: {
    closeModal() {
      this.setTipModal({ showTipModal: false })
      this.setTipFlowCompletedModal({ isShow: false })
      document.querySelector('html').style.overflow = ''
      document.querySelector('body').style.overflow = ''
    },
    ...mapActions('user', ['setTipModal', 'setTipFlowCompletedModal'])
  }
}
</script>

<style lang="scss" scoped>
.completed-message {
  color: #030303;
  display: block;
  font-size: 14px;
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
