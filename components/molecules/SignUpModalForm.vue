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
            @blur="showError('userId')" >
        </div>
        <div class="signup-form-group" :class="{ 'error': hasEmailError }">
          <label class="signup-form-label">メールアドレス</label>
          <input
            class="signup-form-input"
            type="email"
            placeholder="yamada@alismedia.com"
            @input="setEmail"
            @blur="showError('email')">
        </div>
        <div class="signup-form-group" :class="{ 'error': hasPasswordError }">
          <label class="signup-form-label">パスワード</label>
          <input
            class="signup-form-input"
            type="password"
            placeholder="●●●●●●●●"
            @input="setPassword"
            @blur="showError('password')">
        </div>
      </form>
      <p class="signup-form-description">
        現在、新規の登録はβ版登録ユーザーのみに限らせていただいています。
        登録希望の方は<a href="#">ウェイティングリスト</a>にご登録ください。
      </p>
    </div>
    <div class="modal-footer">
      <p class="error-message" v-if="showErrorUserIdRequired">ユーザーIDは必須です</p>
      <p class="error-message" v-if="showErrorUserIdMinLength">ユーザーIDは４文字以上の英数字で入力してください</p>
      <p class="error-message" v-if="showErrorEmailRequired">メールアドレスは必須です</p>
      <p class="error-message" v-if="showErrorInvalidEmail">メールアドレスの形式が正しくありません</p>
      <p class="error-message" v-if="showErrorPasswordRequired">パスワードは必須です</p>
      <p class="error-message" v-if="showErrorInvalidPassword">パスワードは8文字以上です</p>
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
  computed: {
    showErrorUserIdRequired() {
      return this.signUpError.userId && !this.$v.signUp.userId.required
    },
    showErrorUserIdMinLength() {
      return this.signUpError.userId && !this.$v.signUp.userId.minLength
    },
    showErrorEmailRequired() {
      return this.signUpError.email && !this.$v.signUp.email.required
    },
    showErrorInvalidEmail() {
      return this.signUpError.email && !this.$v.signUp.email.email
    },
    showErrorInvalidPassword() {
      return this.signUpError.password && !this.$v.signUp.password.minLength
    },
    showErrorPasswordRequired() {
      return this.signUpError.password && !this.$v.signUp.password.required
    },
    invalidSubmit() {
      return this.$v.signUp.$invalid
    },
    hasUserIdError() {
      return this.signUpError.userId && this.$v.signUp.userId.$error
    },
    hasEmailError() {
      return this.signUpError.email && this.$v.signUp.email.$error
    },
    hasPasswordError() {
      return this.signUpError.password && this.$v.signUp.password.$error
    },
    ...mapGetters('user', ['signUp', 'signUpError'])
  },
  validations: {
    signUp: {
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
      this.$v.signUp[type].$touch()
      this.showSignUpError({ type })
    },
    onSubmit() {
      if (this.invalidSubmit) return
      this.setSentMail({ sentMail: true })
    },
    ...mapActions('user', [
      'setSentMail',
      'setSignUpUserId',
      'setSignUpEmail',
      'setSignUpPassword',
      'showSignUpError'
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
    color: #858dda;
    text-decoration: none;
  }
}

.modal-body {
  margin: 0 auto;

  .signup-form {
    margin: 60px auto 0;
    max-width: 400px;
    width: 80%;

    &-label {
      color: #030303;
      font-size: 14px;
      line-height: 20px;
    }

    &-input {
      border: none;
      border-bottom: 1px dotted #232538;
      margin-bottom: 30px;
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

    .error {
      .signup-form {
        &-label {
          color: red;
        }

        &-input {
          border-bottom: 1px dotted red;
        }
      }
    }

    &-description {
      @include default-text();
      margin: 0 auto;
      max-width: 400px;
      width: 80%;
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
    font-size: 13px;
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
      color: #cecece;
      cursor: default;
    }
  }

  .for-login-user {
    @include default-text();
    text-align: right;
  }

  .error-message {
    color: red;
    font-size: 12px;
    width: 100%;
  }
}
</style>
