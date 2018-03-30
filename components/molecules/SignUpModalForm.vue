<template>
  <div>
    <div class="modal-body">
      <form class="signup-form">
        <div class="signup-form-group" :class="{ 'error': hasUserIdError }">
          <label class="signup-form-label">ALIS ID</label>
          <input
            class="signup-form-input"
            type="text"
            placeholder="alis"
            autofocus
            @input="setUserId"
            @blur="showError('userId')"
            @focus="resetError('userId')">
          <p class="error-message" v-if="showErrorUserIdMinLength">ユーザーIDは４文字以上の英数字で入力してください</p>
        </div>
        <div class="signup-form-group" :class="{ 'error': hasEmailError }">
          <label class="signup-form-label">メールアドレス</label>
          <input
            class="signup-form-input"
            type="email"
            placeholder="yamada@alismedia.com"
            @input="setEmail"
            @blur="showError('email')"
            @focus="resetError('email')">
          <p class="error-message" v-if="showErrorInvalidEmail">メールアドレスの形式が正しくありません</p>
        </div>
        <div class="signup-form-group" :class="{ 'error': hasPasswordError }">
          <label class="signup-form-label">パスワード</label>
          <input
            class="signup-form-input"
            type="password"
            placeholder="●●●●●●●●"
            @input="setPassword"
            @blur="showError('password')"
            @focus="resetError('password')">
          <p class="error-message" v-if="showErrorInvalidPassword">パスワードは8文字以上です</p>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <p class="error-message">{{ errorMessage }}</p>

      <p class="agreement-confirmation">
        <nuxt-link to="#">利用規約</nuxt-link>、<nuxt-link to="#">プライバシーポリシー</nuxt-link>に同意して
      </p>
      <button class="registration-button" :class="{ disabled: invalidSubmit }" @click="onSubmit">
        登録する
      </button>
      <p class="for-login-user">
        ログインされる方は<nuxt-link to="#">こちら</nuxt-link>
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      errorMessage: ''
    }
  },
  computed: {
    showErrorUserIdMinLength() {
      return this.signUpModal.formError.userId && !this.$v.signUpModal.formData.userId.minLength
    },
    showErrorInvalidEmail() {
      return this.signUpModal.formError.email && !this.$v.signUpModal.formData.email.email
    },
    showErrorInvalidPassword() {
      return this.signUpModal.formError.password && !this.$v.signUpModal.formData.password.minLength
    },
    invalidSubmit() {
      return this.$v.signUpModal.formData.$invalid
    },
    hasUserIdError() {
      return this.signUpModal.formError.userId && this.$v.signUpModal.formData.userId.$error
    },
    hasEmailError() {
      return this.signUpModal.formError.email && this.$v.signUpModal.formData.email.$error
    },
    hasPasswordError() {
      return this.signUpModal.formError.password && this.$v.signUpModal.formData.password.$error
    },
    ...mapGetters('user', ['signUpModal'])
  },
  validations: {
    signUpModal: {
      formData: {
        userId: {
          required,
          minLength: minLength(4)
        },
        email: {
          required,
          email
        },
        password: {
          required,
          minLength: minLength(8)
        }
      }
    }
  },
  methods: {
    setUserId(e) {
      this.setSignUpUserId({ userId: e.target.value })
    },
    setEmail(e) {
      this.setSignUpEmail({ email: e.target.value })
    },
    setPassword(e) {
      this.setSignUpPassword({ password: e.target.value })
    },
    showError(type) {
      this.$v.signUpModal.formData[type].$touch()
      this.showSignUpError({ type })
    },
    resetError(type) {
      this.$v.signUpModal.formData[type].$reset()
      this.hideSignUpError({ type })
    },
    async onSubmit() {
      if (this.invalidSubmit) return
      const { userId, email, password } = this.signUpModal.formData
      const result = await this.register({ userId, email, password })
      if (!result) {
        this.setSentMail({ sentMail: true })
      } else {
        this.errorMessage = result.message
      }
    },
    ...mapActions('user', [
      'setSentMail',
      'setSignUpUserId',
      'setSignUpEmail',
      'setSignUpPassword',
      'showSignUpError',
      'hideSignUpError',
      'register'
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

  .registration-button {
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
    bottom: 0;
    color: #f06273;
    font-size: 12px;
    width: 100%;
  }

  .for-login-user {
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
