<template>
  <div>
    <div class="modal-body">
      <form class="signup-form" @keypress.enter.prevent="onSubmit">
        <div class="signup-form-group" :class="{ 'error': hasUserIdError }">
          <label class="signup-form-label">ユーザーID</label>
          <input
            class="signup-form-input"
            type="text"
            placeholder="半角英数字3文字以上"
            maxlength="30"
            autofocus
            ref="userId"
            @input="setUserId"
            @blur="showError('userId')"
            @focus="resetError('userId')">
          <p class="error-message" v-if="showErrorUserId && !showErrorUserIdMinLength">ユーザーIDは半角英数字と-（ハイフン）のみご利用下さい</p>
          <p class="error-message" v-if="showErrorUserIdMinLength && showErrorUserId">ユーザーIDは3文字以上の英数字で入力してください</p>
        </div>
        <div class="signup-form-group" :class="{ 'error': hasEmailError }">
          <label class="signup-form-label">メールアドレス</label>
          <input
            class="signup-form-input"
            type="email"
            placeholder="alis@example.com"
            maxlength="256"
            ref="email"
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
            placeholder="半角英数字8文字以上"
            ref="password"
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
        <nuxt-link to="/terms" target="_blank">利用規約</nuxt-link>、
        <nuxt-link to="/privacy" target="_blank">プライバシーポリシー</nuxt-link>に同意して
      </p>
      <app-button class="registration-button" :disabled="invalidSubmit" @click="onSubmit">
        登録する
      </app-button>
      <p class="for-login-user">
        ログインされる方は<span class="link" @click="transitToLogin">こちら</span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, minLength, email } from 'vuelidate/lib/validators'
import AppButton from '../atoms/AppButton'

function userId(value) {
  return Boolean(value.match(/^(?!.*--)[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]$/))
}

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
    showErrorUserIdMinLength() {
      return this.signUpModal.formError.userId && !this.$v.signUpModal.formData.userId.minLength
    },
    showErrorUserId() {
      return this.signUpModal.formError.userId && !this.$v.signUpModal.formData.userId.userId
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
          minLength: minLength(3),
          userId
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
    transitToLogin() {
      this.setSignUpModal({ showSignUpModal: false })
      this.setLoginModal({ showLoginModal: true })
    },
    async onSubmit() {
      if (this.invalidSubmit) return
      const { userId, email, password } = this.signUpModal.formData
      try {
        await this.register({ userId, email, password })
        this.setSentMail({ sentMail: true })
        this.$refs.userId.value = ''
        this.$refs.email.value = ''
        this.$refs.password.value = ''
        this.resetPassword()
      } catch (error) {
        let errorMessage = ''
        switch (error.code) {
          case 'UsernameExistsException':
            errorMessage = 'ユーザーIDはすでに存在します'
            break
          default:
            errorMessage =
              'エラーが発生しました。入力内容をご確認ください。※ 現在、事前登録が完了していないユーザは登録できません。'
            break
        }
        this.errorMessage = errorMessage
      }
    },
    ...mapActions('user', [
      'setSentMail',
      'setSignUpUserId',
      'setSignUpEmail',
      'setSignUpPassword',
      'showSignUpError',
      'hideSignUpError',
      'register',
      'setSignUpModal',
      'setLoginModal',
      'resetPassword'
    ])
  }
}
</script>

<style lang="scss" scoped>
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
      border-radius: 0;
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
    margin: 20px auto 0;
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
