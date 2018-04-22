<template>
  <div class="report-modal-content">
    <p class="confirm-text">
      記事の作成・評価にはログインが必要です
    </p>
    <div class="left">
      <p class="for-submitted-user">
        β版登録済みの方
      </p>
      <p class="description">
        既に登録済みの方は以下のボタンよりログイン
        画面へお進みください。また新規登録がお進み
        でない方は新規登録画面へお進みください。
      </p>
      <span
        @click="showLoginModal"
        class="login-button">
        ログインする
      </span>
      <span
        @click="showSignUpModal"
        class="signup-button">
        新規登録する
      </span>
    </div>
    <div class="right">
      <p class="for-not-submitted-user">
        β版未登録の方
      </p>
      <p class="description">
        β版の登録がお済みでない方は大変恐縮です
        が、ウェイティングリストへのご登録をお願い
        致しております。ご登録の上、利用開始メール
        送付までお待ち下さい。
      </p>
      <a
        href="http://eepurl.com/drM0Jr"
        target="_blank"
        rel="noopener noreferrer nofollow"
        class="submit-button">
        ウェイティングリストに登録する
      </a>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    showSignUpModal() {
      this.setRequestLoginModal({ showRequestLoginModal: false })
      this.setSignUpModal({ showSignUpModal: true })
      document.documentElement.scrollTop = 0
      if (window.innerWidth > 550) {
        document.querySelector('html,body').style.overflow = 'hidden'
      }
    },
    showLoginModal() {
      this.setRequestLoginModal({ showRequestLoginModal: false })
      this.setLoginModal({ showLoginModal: true })
      document.documentElement.scrollTop = 0
      if (window.innerWidth > 550) {
        document.querySelector('html,body').style.overflow = 'hidden'
      }
    },
    ...mapActions('user', ['setSignUpModal', 'setLoginModal', 'setRequestLoginModal'])
  }
}
</script>

<style lang="scss" scoped>
.report-modal-content {
  &::after {
    content: '';
    display: block;
    clear: both;
  }
}

.confirm-text {
  color: #030303;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2px;
  line-height: 21px;
  text-align: center;
  padding: 30px 0 0;
}

.left {
  width: 50%;
  float: left;
}

.right {
  width: 50%;
  float: right;
}

.for-submitted-user,
.for-not-submitted-user {
  color: #030303;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.17px;
  line-height: 21px;
  text-align: center;
  margin: 50px 0 0;
}

.description {
  width: 255px;
  color: #6e6e6e;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  margin: 20px auto 0;
}

.login-button,
.signup-button,
.submit-button {
  background: linear-gradient(134.72deg, #232538 0%, #858dda 100%);
  border-radius: 18px;
  border: none;
  box-shadow: 0 0 10px gray;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 14px;
  outline: none;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  width: 265px;
}

.login-button {
  margin: 60px auto 0;
}

.signup-button {
  margin: 30px auto 60px;
}

.submit-button {
  margin: 40px auto 0;
}

@media screen and (max-width: 820px) {
  .left,
  .right {
    width: 100%;
    float: none;
  }
}

@media screen and (max-width: 550px) {
  .confirm-text {
    padding: 4vh 0 0;
  }

  .login-button {
    margin: 40px auto 0;
  }

  .signup-button {
    margin: 20px auto 40px;
  }

  .submit-button {
    margin: 40px auto 0;
  }
}

@media screen and (max-width: 320px) {
  .for-submitted-user {
    margin: 40px 0 0;
  }

  .login-button,
  .signup-button,
  .submit-button {
    width: 220px;
    margin: 12px auto;
  }
}
</style>
