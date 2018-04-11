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
            @input="setPassword"
            @blur="showError('password')"
            @focus="resetError('password')">
          <p class="error-message" v-if="showErrorInvalidPassword">パスワードは8文字以上でご入力ください</p>
        </div>
        <div class="remember-login">
          <input class="checkbox" type="checkbox">
          <span class="text">ログイン情報を記憶する</span>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <p class="error-message">{{ errorMessage }}</p>

      <p class="agreement-confirmation">
        <nuxt-link to="#">利用規約</nuxt-link>、<nuxt-link to="#">プライバシーポリシー</nuxt-link>に同意して
      </p>
      <button class="login-button" :class="{ disabled: invalidSubmit }" @click="onSubmit">
        ログインする
      </button>
      <p class="for-signup-user">
        新規登録をされる方は<nuxt-link to="#">こちら</nuxt-link>
      </p>
      <p class="for-password-forgot-user">
        パスワードを忘れた方は<nuxt-link to="#">こちら</nuxt-link>
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      errorMessage: ''
    }
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
    async onSubmit() {
      if (this.invalidSubmit) return
      const { userIdOrEmail, password } = this.loginModal.formData
      try {
        await this.login({ userId: userIdOrEmail, password })
        this.setLoginModal({ showLoginModal: false })
        document.querySelector('html,body').style.overflow = ''
      } catch (error) {
        this.errorMessage = error.message
      }
    },
    ...mapActions('user', [
      'login',
      'setLoginModal',
      'setLoginUserIdOrEmail',
      'setLoginPassword',
      'showLoginError',
      'hideLoginError'
    ])
  }
}
</script>

<style lang="scss" scoped>
@mixin default-text {
  height: 14px;
  color: #6e6e6e;
  font-size: 12px;
  line-height: 18px;

  a {
    border-bottom: solid 1px transparent;
    color: #858dda;
    text-decoration: none;
    transition: all 400ms ease;

    &:hover {
      border-bottom: solid 1px #858dda;
    }
  }
}

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

  .remember-login {
    text-align: right;

    .checkbox {
      background-color: #fff;
      border-radius: 4px;
      border: 1px solid #858dda;
      height: 15.5px;
      width: 20px;
    }

    .text {
      color: #6e6e6e;
      font-size: 14px;
      font-weight: 500;
      line-height: 21px;
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
    background: linear-gradient(134.72deg, #232538 0%, #858dda 100%);
    border-radius: 18px;
    border: none;
    box-shadow: 0 0 10px gray;
    color: #fff;
    cursor: pointer;
    display: block;
    font-size: 14px;
    margin: 20px auto 0;
    outline: none;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    width: 265px;

    &:focus {
      opacity: 0.8;
    }

    &:target {
      display: block;
    }

    &.disabled {
      background: white;
      color: #6e6e6e;
      cursor: default;
    }
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
