<template>
  <div class="modal-body">
    <div class="wrapper">
      <p class="description">
        {{ confirmText }}<br>
        新規登録・ログイン<span class="br" />しましょう
      </p>
      <app-button class="signup-button" @click="showSignUpModal">
        新規登録する
      </app-button>
      <app-button class="login-button" @click="showLoginModal">
        ログインする
      </app-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppButton from '../atoms/AppButton'
import { removeOAuthParams } from '~/utils/oauth'

export default {
  components: {
    AppButton
  },
  computed: {
    confirmText() {
      switch (this.requestLoginModal.requestType) {
        case 'articleCreate':
          return '記事の作成を行うために'
        case 'articleLike':
          return '記事へいいねを行うために'
        case 'articleComment':
          return '記事へのコメントを行うために'
        case 'articleCommentLike':
          return 'コメントへいいねを行うために'
        case 'articleTip':
          return 'ALISを贈るために'
        case 'articleReport':
          return '記事を報告するために'
        case 'purchaseArticle':
          return '記事を購入するために'
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
      removeOAuthParams()
    },
    ...mapActions('user', ['setSignUpModal', 'setLoginModal', 'setRequestLoginModal'])
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
  background: url('~assets/images/pc/bg/request-login.png') no-repeat;
  background-size: auto 280px;
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
  margin: 310px 0 0;
}

.signup-button {
  margin: 40px auto 0;
}

.login-button {
  margin: 20px auto 60px;
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
    font-size: 20px;
    margin: 340px 0 0;
  }

  .signup-button {
    margin: 30px auto 0;
  }
}

@media screen and (max-width: 320px) {
  .wrapper {
    background-size: auto 240px;
  }

  .description {
    font-size: 18px;
    margin: 260px 0 0;
  }
}
</style>
