<template>
  <div class="report-modal-content">
    <p class="confirm-text">
      {{ confirmText }}
    </p>
    <p class="description">
      以下のボタンよりログイン画面または新規登録画面へお進みください
    </p>
    <app-button
      @click="showLoginModal"
      class="login-button">
      ログインする
    </app-button>
    <app-button
      @click="showSignUpModal"
      class="signup-button">
      新規登録する
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
    confirmText() {
      const text = 'ログインが必要です'
      switch (this.requestLoginModal.requestType) {
        case 'articleLike':
          return `記事の作成・評価には${text}`
        case 'articleComment':
          return `記事へのコメントには${text}`
        case 'articleCommentLike':
          return `コメントの評価には${text}`
        case 'articleTip':
          return `トークンを贈るには${text}`
        default:
          return text
      }
    },
    ...mapGetters('user', ['requestLoginModal'])
  },
  methods: {
    showSignUpModal() {
      this.setRequestLoginModal({ isShow: false })
      this.setSignUpModal({ showSignUpModal: true })
      document.documentElement.scrollTop = 0
      if (window.innerWidth > 550) {
        document.querySelector('html,body').style.overflow = 'hidden'
      }
    },
    showLoginModal() {
      this.setRequestLoginModal({ isShow: false })
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
  font-size: 14px;
  letter-spacing: 0.8px;
  text-align: center;
  padding: 30px 0 0;
}

.description {
  @include default-text();
  max-width: 394px;
  margin: 20px auto 0;
}

.login-button {
  margin: 60px auto 0;
}

.signup-button {
  margin: 20px auto 60px;
}

@media screen and (max-width: 550px) {
  .confirm-text {
    padding: calc(50vh - 160px) 0 0;
  }

  .description {
    max-width: 300px;
  }

  .login-button {
    margin: 40px auto 0;
  }
}

@media screen and (max-width: 320px) {
  .login-button,
  .signup-button {
    width: 220px;
    margin: 12px auto;
  }
}
</style>
