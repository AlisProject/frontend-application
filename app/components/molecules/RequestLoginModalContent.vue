<template>
  <div class="report-modal-content">
    <p class="confirm-text">
      {{ confirmText }}<br>
      新規登録・ログインが必要です
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
      switch (this.requestLoginModal.requestType) {
        case 'articleLike':
          return '記事へいいねを行うには'
        case 'articleComment':
          return '記事へのコメントを行うには'
        case 'articleCommentLike':
          return 'コメントへいいねを行うには'
        case 'articleTip':
          return 'ALISを贈るには'
        case 'articleReport':
          return '記事を報告するには'
        case 'articleCreate':
          return '記事の作成を行うには'
        default:
          return ''
      }
    },
    ...mapGetters('user', ['requestLoginModal'])
  },
  methods: {
    showSignUpModal() {
      this.setRequestLoginModal({ isShow: false })
      this.setSignUpModal({ showSignUpModal: true })
    },
    showLoginModal() {
      this.setRequestLoginModal({ isShow: false })
      this.setLoginModal({ showLoginModal: true })
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
  line-height: 1.5;
  padding: 30px 0 0;
  text-align: center;
}

.description {
  @include default-text();
  color: #6e6e6e;
  letter-spacing: 0.8px;
  margin: 20px auto 0;
  max-width: 256px;
}

.login-button {
  margin: 50px auto 0;
}

.signup-button {
  margin: 20px auto 60px;
}

@media screen and (max-width: 550px) {
  .confirm-text {
    padding: calc(50vh - 180px) 0 0;
  }

  .login-button {
    margin: 40px auto 0;
  }
}
</style>
