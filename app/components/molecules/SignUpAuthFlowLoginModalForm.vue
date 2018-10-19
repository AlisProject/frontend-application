<template>
  <div>
    <div class="modal-body">
      <p class="announce">
        メール認証が完了しました。以下からログインしてください
      </p>
      <form class="signup-form" @keypress.enter.prevent="onSubmit">
        <div class="signup-form-group" :class="{ 'error': hasUserIdOrEmailError }">
          <label class="signup-form-label">ユーザーID または メールアドレス</label>
          <input
            class="signup-form-input"
            type="text"
            placeholder="alis@example.com"
            autofocus
            ref="userIdOrEmail"
            @input="setUserIdOrEmail"
            @blur="showError('userIdOrEmail')"
            @focus="resetError('userIdOrEmail')">
        </div>
        <div class="signup-form-group" :class="{ 'error': hasPasswordError }">
          <label class="signup-form-label">パスワード</label>
          <input
            class="signup-form-input"
            type="password"
            placeholder="半角英数字8文字以上"
            ref="password"
            @input="setPassword"
            @blur="showError('password')"
            @focus="resetError('password')">
          <p class="error-message" v-if="showErrorInvalidPassword">パスワードは8文字以上でご入力ください</p>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <p class="error-message">{{errorMessage}}</p>
      <p class="agreement-confirmation">
        <nuxt-link to="/terms" target="_blank">利用規約</nuxt-link>、
        <nuxt-link to="/privacy" target="_blank">プライバシーポリシー</nuxt-link>に同意して
      </p>
      <app-button class="login-button" :disabled="invalidSubmit" @click="onSubmit">
        ログインする
      </app-button>
      <p class="for-signup-user">
        新規登録をされる方は<span class="link" @click="transitToSignup">こちら</span>
      </p>
      <p class="for-password-forgot-user">
        パスワードを忘れた方は<span class="link" @click="forgotPassword">こちら</span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'
import AppButton from '../atoms/AppButton'

export default {
  data() {
    return {
      errorMessage: ''
    }
  },
  components: {
    AppButton
  },
  created() {
    if (process.browser) document.querySelector('html,body').style.overflow = 'hidden'
  },
  computed: {
    showErrorInvalidPassword() {
      return (
        this.signUpAuthFlowModal.login.formError.password &&
        !this.$v.signUpAuthFlowModal.login.formData.password.minLength
      )
    },
    invalidSubmit() {
      return this.$v.signUpAuthFlowModal.login.formData.$invalid
    },
    hasUserIdOrEmailError() {
      return (
        this.signUpAuthFlowModal.login.formError.userIdOrEmail &&
        this.$v.signUpAuthFlowModal.login.formData.userIdOrEmail.$error
      )
    },
    hasPasswordError() {
      return (
        this.signUpAuthFlowModal.login.formError.password &&
        this.$v.signUpAuthFlowModal.login.formData.password.$error
      )
    },
    ...mapGetters('user', ['signUpAuthFlowModal'])
  },
  validations: {
    signUpAuthFlowModal: {
      login: {
        formData: {
          userIdOrEmail: {
            required
          },
          password: {
            required,
            minLength: minLength(8)
          }
        }
      }
    }
  },
  methods: {
    setUserIdOrEmail(e) {
      this.setSignUpAuthFlowLoginUserIdOrEmail({ userIdOrEmail: e.target.value })
    },
    setPassword(e) {
      this.setSignUpAuthFlowLoginPassword({ password: e.target.value })
    },
    showError(type) {
      this.$v.signUpAuthFlowModal.login.formData[type].$touch()
      this.showSignUpAuthFlowLoginError({ type })
    },
    resetError(type) {
      this.$v.signUpAuthFlowModal.login.formData[type].$reset()
      this.hideSignUpAuthFlowLoginError({ type })
    },
    transitToSignup() {
      this.setSignUpAuthFlowModal({ showSignUpAuthFlowModal: false })
      this.setSignUpModal({ showSignUpModal: true })
    },
    async onSubmit() {
      if (this.invalidSubmit) return
      const { userIdOrEmail, password } = this.signUpAuthFlowModal.login.formData
      try {
        await this.signUpLogin({ userId: userIdOrEmail, password })
        this.setSignUpAuthFlowLoginModal({ isSignUpAuthFlowLoginModal: false })
        this.setSignUpAuthFlowCompletedAuthModal({ isShow: true })
        this.$refs.userIdOrEmail.value = ''
        this.$refs.password.value = ''
        this.resetPassword()
      } catch (error) {
        let errorMessage = ''
        switch (error.code) {
          case 'NotAuthorizedException':
            errorMessage = 'ユーザーIDまたはメールアドレス、パスワードを間違えています'
            break
          default:
            errorMessage = 'エラーが発生しました。入力内容をご確認ください'
            break
        }
        this.errorMessage = errorMessage
      }
    },
    ...mapActions('user', [
      'setSignUpAuthFlowLoginModal',
      'setSignUpAuthFlowLoginUserIdOrEmail',
      'setSignUpAuthFlowLoginPassword',
      'showSignUpAuthFlowLoginError',
      'hideSignUpAuthFlowLoginError',
      'setSignUpAuthFlowCompletedAuthModal',
      'signUpLogin',
      'resetPassword',
      'forgotPassword',
      'setSignUpAuthFlowModal',
      'setSignUpModal'
    ])
  }
}
</script>

<style lang="scss" scoped>
.modal-body {
  margin: 0 auto;

  .announce {
    @include default-text();
    font-size: 14px;
    margin: 60px 0 0;
    text-align: center;
  }

  .signup-form {
    margin: 60px auto 0;
    max-width: 400px;
    width: 80%;

    &-group {
      position: relative;
    }

    &-label {
      color: #030303;
      font-size: 14px;
      line-height: 20px;
    }

    &-input {
      border: none;
      border-radius: 0;
      border-bottom: 1px dotted #232538;
      margin-bottom: 40px;
      padding: 5px 0;
      width: 100%;

      &::-webkit-input-placeholder {
        color: #cecece;
        font-size: 14px;
        letter-spacing: 0.05em;
      }

      &:focus {
        outline: 0;
      }
    }

    .error-message {
      bottom: 0;
      color: #f06273;
      font-size: 12px;
      position: absolute;
      width: 100%;
    }

    .error {
      .signup-form {
        &-label {
          color: #f06273;
        }

        &-input {
          border-bottom: 1px dotted #f06273;
        }
      }
    }
  }
}

.modal-footer {
  width: 270px;
  margin: 90px auto 40px;

  .agreement-confirmation {
    @include default-text();
    text-align: center;
  }

  .error-message {
    bottom: 0;
    color: #f06273;
    font-size: 12px;
    width: 100%;
  }

  .login-button {
    margin: 20px auto 0;
  }

  .for-signup-user,
  .for-password-forgot-user {
    @include default-text();
    text-align: right;
  }

  .link {
    @include default-link();
  }
}

@media screen and (max-width: 320px) {
  .modal-body {
    .signup-form {
      margin-top: 30px;

      &-input {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
