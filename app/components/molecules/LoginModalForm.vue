<template>
  <div>
    <div class="modal-body">
      <form class="signup-form" @keypress.enter="onSubmit">
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
            ref="password"
            placeholder="半角英数字8文字以上"
            @input="setPassword"
            @blur="showError('password')"
            @focus="resetError('password')">
          <p class="error-message" v-if="showErrorInvalidPassword">パスワードは8文字以上でご入力ください</p>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <p class="error-message">{{ errorMessage }}</p>

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
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
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
  computed: {
    showErrorInvalidPassword() {
      return this.loginModal.formError.password && !this.$v.loginModal.formData.password.minLength
    },
    invalidSubmit() {
      return this.$v.loginModal.formData.$invalid
    },
    hasUserIdOrEmailError() {
      return (
        this.loginModal.formError.userIdOrEmail && this.$v.loginModal.formData.userIdOrEmail.$error
      )
    },
    hasPasswordError() {
      return this.loginModal.formError.password && this.$v.loginModal.formData.password.$error
    },
    ...mapGetters('user', ['loginModal'])
  },
  validations: {
    loginModal: {
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
  },
  methods: {
    setUserIdOrEmail(e) {
      this.setLoginUserIdOrEmail({ userIdOrEmail: e.target.value })
    },
    setPassword(e) {
      this.setLoginPassword({ password: e.target.value })
    },
    showError(type) {
      this.$v.loginModal.formData[type].$touch()
      this.showLoginError({ type })
    },
    resetError(type) {
      this.$v.loginModal.formData[type].$reset()
      this.hideLoginError({ type })
    },
    transitToSignup() {
      this.setLoginModal({ showLoginModal: false })
      this.setSignUpModal({ showSignUpModal: true })
    },
    async onSubmit() {
      if (this.invalidSubmit) return
      const { userIdOrEmail, password } = this.loginModal.formData
      try {
        const result = await this.login({ userId: userIdOrEmail, password })
        await this.setCurrentUserInfo()
        this.setLoginModal({ showLoginModal: false })

        if (!result.phoneNumberVerified) {
          this.setSignUpAuthFlowModal({ showSignUpAuthFlowModal: true })
          this.setSignUpAuthFlowInputPhoneNumberModal({
            isSignUpAuthFlowInputPhoneNumberModal: true
          })
        } else {
          this.sendNotification({ text: 'ログインしました' })
        }

        document.querySelector('html,body').style.overflow = ''
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
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('user', [
      'login',
      'setLoginModal',
      'setSignUpModal',
      'setLoginUserIdOrEmail',
      'setLoginPassword',
      'showLoginError',
      'hideLoginError',
      'setCurrentUserInfo',
      'resetPassword',
      'forgotPassword',
      'setSignUpAuthFlowModal',
      'setSignUpAuthFlowInputPhoneNumberModal'
    ])
  }
}
</script>

<style lang="scss" scoped>
.modal-body {
  margin: 0 auto;

  .signup-form {
    margin: 80px auto 0;
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

  .login-button {
    margin: 20px auto 0;
  }

  .error-message {
    color: #f06273;
    font-size: 12px;
    width: 100%;
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
