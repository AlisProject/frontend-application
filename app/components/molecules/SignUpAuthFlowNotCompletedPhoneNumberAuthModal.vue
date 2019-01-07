<template>
  <div class="modal-body">
    <div class="wrapper">
      <p class="description">
        アカウント登録が<span class="br"/>完了しました。<br>
        ALISのはじめ方を<span class="br"/>確認しましょう。
      </p>
      <app-button class="submit" @click="close">
        <nuxt-link to="/ALIS-official/articles/3reY5BgBEZ8B">
          はじめ方をみる
        </nuxt-link>
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

.description {
  color: #030303;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 1.37px;
  line-height: 1.5;
  margin: 260px 0 0;
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

@media screen and (max-width: 550px) {
  .br {
    &:before {
      content: '\A';
      white-space: pre;
    }
  }

  .wrapper {
    background-size: auto 320px;
  }

  .description {
    margin: 340px 0 0;
    width: 328px;
  }
}

@media screen and (max-width: 320px) {
  .wrapper {
    background-size: auto 274px;
  }

  .description {
    margin: 290px 0 0;
    width: 288px;
    font-size: 20px;
  }

  .submit {
    margin: 30px 0 0;
  }
}
</style>
