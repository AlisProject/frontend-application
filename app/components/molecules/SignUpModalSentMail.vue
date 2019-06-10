<template>
  <transition name="modal-sent-mail">
    <div class="modal-body">
      <p class="send-mail">
        確認メールを送信しました
      </p>
      <p class="signup-form-description">
        ご登録いただいたメールアドレスに記載のリンクにアクセスし、ログインを行うことで登録が完了します。
      </p>
      <app-button class="to-top-button" @click="transitToTop">
        トップに戻る
      </app-button>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  },
  mounted() {
    document.querySelector('.modal-container').style.maxWidth = '800px'
  },
  methods: {
    transitToTop() {
      this.setSignUpModal({ showSignUpModal: false })
      document.querySelector('html,body').style.overflow = ''
      setTimeout(() => {
        this.setSentMail({ sentMail: false })
      }, 1000)
      this.$router.push('/')
    },
    ...mapActions('user', ['setSignUpModal', 'setSentMail'])
  }
}
</script>

<style lang="scss" scoped>
.modal-body {
  margin: 0 auto;

  .send-mail {
    height: 21px;
    color: #030303;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    text-align: center;
    margin: 60px auto 0;
  }

  .signup-form-description {
    height: 54px;
    max-width: 400px;
    width: 100%;
    color: #6e6e6e;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.5;
    margin: 20px auto 0;

    a {
      color: #0086cc;
      text-decoration: none;
    }
  }

  .to-top-button {
    margin: 60px auto;
  }
}
</style>
