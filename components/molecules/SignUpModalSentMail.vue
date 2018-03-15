<template>
  <transition name="modal-sent-mail">
    <div class="modal-body">
      <p class="sned-mail">
        確認メールを送信しました
      </p>
      <p class="signup-form-description">
        ご登録いただいたメールアドレスに記載のリンクにアクセスし、ログイン
        を行うことで登録が完了します。※メールが届かない場合はこちらから再
        送してください。
      </p>
      <button class="to-top-button" @click="transitToTop">
        トップに戻る
      </button>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    transitToTop() {
      this.setSignUpModal({ showSignUpModal: false })
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

  .sned-mail {
    height: 21px;
    width: 351px;
    color: #030303;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
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
    line-height: 18px;
    margin: 20px auto 0;

    a {
      color: #858dda;
      text-decoration: none;
    }
  }

  .to-top-button {
    background: linear-gradient(134.72deg, #232538 0%, #858dda 100%);
    border-radius: 18px;
    border: none;
    box-shadow: 0 0 10px gray;
    color: #fff;
    cursor: pointer;
    display: block;
    font-size: 13px;
    margin: 20px auto 60px;
    outline: none;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    width: 265px;

    &:focus {
      opacity: 0.8;
    }
  }
}
</style>
