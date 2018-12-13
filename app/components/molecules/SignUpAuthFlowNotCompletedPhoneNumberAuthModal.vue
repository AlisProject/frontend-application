<template>
  <div class="modal-body">
    <div class="wrapper">
      <h2 class="title">
        ご登録お疲れ様でした！
      </h2>
      <p class="about">
        アカウント認証について
      </p>
      <p class="description">
        ALISを報酬として受け取ることができるようになりました。記事の作成・いいねを行うことでALISを獲得できます。まずは記事の作成を行ってみましょう！
      </p>
      <app-button class="submit" @click="submit">
        認証する
      </app-button>
      <app-button class="close" @click="close">
        閉じる
      </app-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  },
  methods: {
    submit() {},
    close() {
      this.setSignUpAuthFlowModal({ showSignUpAuthFlowModal: false })
      this.setSignUpAuthFlowNotCompletedPhoneNumberAuthModal({ isShow: false })
    },
    ...mapActions('user', [
      'setSignUpAuthFlowModal',
      'setSignUpAuthFlowNotCompletedPhoneNumberAuthModal'
    ])
  }
}
</script>

<style lang="scss" scoped>
.modal-body {
  margin: 0 auto;
  display: flex;
}

.wrapper {
  width: 100vw;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: url('~assets/images/pc/bg/not-completed-phone-number-auth.png') no-repeat;
  background-size: auto 240px;
  background-position-x: center;
  margin: -50px -30px 0;
  height: 100%;
}

.title {
  color: #030303;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 5px;
  margin: 280px 0 0;
  text-align: center;
}

.about {
  color: #030303;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.8px;
  margin: 30px 0 0;
  text-align: center;
}

.description {
  color: #6e6e6e;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.8px;
  line-height: 1.5;
  margin: 20px 0 0;
  width: 256px;
}

.submit {
  margin: 40px 0 0;
}

.close {
  margin: 20px 0 60px;
  background: #fff;
  border: 1px solid #0086cc;
  color: #0086cc;
  font-weight: bold;
  box-shadow: none;

  &:hover,
  &:focus {
    background: #fff;
  }
}
</style>
