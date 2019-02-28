<template>
  <div class="modal-body">
    <div class="wrapper">
      <p class="description">
        アカウント登録が<span class="br" />完了しました。<br>
        記事を書いたりいいねをして<span class="br" />ALISを獲得しましょう。
      </p>
      <app-button class="submit" @click="close">
        <nuxt-link to="/me/articles/new">
          記事を作成する
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
      this.setSignUpAuthFlowCompletedPhoneNumberAuthModal({ isShow: false })
    },
    ...mapActions('user', [
      'setSignUpAuthFlowModal',
      'setSignUpAuthFlowCompletedPhoneNumberAuthModal'
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
  background: url('~assets/images/pc/bg/completed-phone-number-auth.png') no-repeat;
  background-size: auto 240px;
  background-position-x: center;
  margin: -50px -30px 0;
  height: 100%;

  .description {
    color: #030303;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 1.37px;
    line-height: 1.5;
    margin: 260px 0 20px;
  }

  .submit {
    margin: 20px 0 0;
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

    .description {
      font-size: 20px;
      margin: 340px 0 0;
    }

    .submit {
      margin: 30px 0 0;
    }

    .close {
      margin: 10px 0 60px;
    }
  }
}

@media screen and (max-width: 320px) {
  .wrapper {
    background-size: auto 240px;

    .description {
      margin: 260px 0 0;
      font-size: 18px;
    }
  }
}
</style>
