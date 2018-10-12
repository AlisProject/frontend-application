<template>
  <div class="modal-body">
    <p class="announce">
      ALISへの<span class="br"/>登録が完了しました！
    </p>
    <p class="description">
      次のステップで電話番号による認証が完了すると、
      誰かの記事にいいねをしたり、自分の書いた記事がいいねされることで
      ALISトークンを獲得できるようになります。
    </p>
    <app-button class="to-next-step-button" @click="transitToNextStep">
      次へ
    </app-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  },
  async mounted() {
    await this.getUserSession()
  },
  methods: {
    transitToNextStep() {
      this.setSignUpAuthFlowCompletedAuthModal({ isShow: false })
      this.setSignUpAuthFlowInputPhoneNumberModal({
        isSignUpAuthFlowInputPhoneNumberModal: true
      })
    },
    transitToTop() {
      document.querySelector('html,body').style.overflow = ''
      this.setSignUpAuthFlowModal({
        showSignUpAuthFlowModal: false
      })
    },
    ...mapActions('user', [
      'setSignUpAuthFlowModal',
      'setSignUpAuthFlowCompletedAuthModal',
      'getUserSession',
      'setSignUpAuthFlowInputPhoneNumberModal'
    ])
  }
}
</script>

<style lang="scss" scoped>
.modal-body {
  margin: 0 auto;
}

.announce {
  color: #030303;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 1.14px;
  line-height: 1.5;
  margin: 60px 0 0;
  text-align: center;
}

.description {
  color: #030303;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.17px;
  line-height: 2;
  margin: 40px auto 0;
  max-width: 400px;
}

.to-next-step-button {
  margin: 40px auto;
}

@media screen and (max-width: 550px) {
  .br {
    &:before {
      content: '\A';
      white-space: pre;
    }
  }

  .announce {
    margin: 20vh 0 0;
  }

  .description {
    max-width: 80%;
  }

  .to-next-step-button {
    margin: 60px auto 10vh;
  }
}
</style>
