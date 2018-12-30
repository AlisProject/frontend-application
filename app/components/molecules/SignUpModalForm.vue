<template>
  <div>
    <h1 class="title" v-if="isSelectedEmailAuth">新規登録</h1>
    <div class="modal-body">
      <div class="email-auth" v-show="isSelectedEmailAuth" :class="{ isSelectedEmailAuth }">
        <form class="signup-form" @keypress.enter.prevent="onSubmit">
          <div class="signup-form-group" :class="{ 'error': hasUserIdError }">
            <label class="signup-form-label">ユーザーID※半角英数字3文字以上</label>
            <input
              class="signup-form-input"
              type="text"
              placeholder="taro"
              maxlength="30"
              ref="userId"
              @input="setUserId"
              @blur="showError('userId')"
              @focus="resetError('userId')">
            <p class="error-message" v-if="showErrorUserId && !showErrorUserIdMinLength">半角英数字と-（ハイフン）のみご利用下さい</p>
            <p class="error-message" v-if="showErrorUserIdMinLength && showErrorUserId">3文字以上の英数字で入力してください</p>
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
            <label class="signup-form-label">パスワード※半角英数字8文字以上</label>
            <input
              class="signup-form-input"
              type="password"
              placeholder="●●●●●●●●"
              ref="password"
              @input="setPassword"
              @blur="showError('password')"
              @focus="resetError('password')">
            <p class="error-message" v-if="showErrorInvalidPassword">パスワードは8文字以上で入力してください</p>
          </div>
        </form>
        <div class="modal-footer">
          <p class="error-message">{{ errorMessage }}</p>
          <p class="agreement-confirmation">
            <nuxt-link to="/terms" target="_blank">利用規約</nuxt-link>・
            <nuxt-link to="/privacy" target="_blank">プライバシーポリシー</nuxt-link>に同意して
          </p>
          <app-button class="registration-button" :disabled="invalidSubmit" @click="onSubmit">
            登録する
          </app-button>
        </div>
      </div>
      <div class="external-provider-auth" v-show="!isSelectedEmailAuth">
        <a class="line-button" :href="lineSignUpAuthorizeURL">
          LINEではじめる
        </a>
        <a class="twitter-button" :href="twitterSignUpAuthorizeURL">
          twitterではじめる
        </a>
        <p
          class="for-email-signup"
          @click="showEmailAuth">
          メールではじめる
        </p>
        <p class="agreement-confirmation">
          上記を押した場合、<nuxt-link to="/terms" target="_blank">利用規約</nuxt-link>・<nuxt-link to="/privacy" target="_blank">プライバシーポリシー</nuxt-link>に同意したものとみなします
        </p>
        <p class="external-provider-confirmation">
          ※外部サービス上でALISを使っていることは表示されません
        </p>
      </div>
    </div>
    <div
      class="for-login-user"
      @click="transitToLogin"
      v-if="!isSelectedEmailAuth">
      ログインされる方は<span class="link-sp">こちら</span>
    </div>
    <div class="for-login-user-sp" v-else>
      ログインの方は<span class="for-login-user-link" @click="transitToLogin">こちら</span>
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
      errorMessage: '',
      lineSignUpAuthorizeURL: null,
      twitterSignUpAuthorizeURL: null,
      isSelectedEmailAuth: false
    }
  },
  async mounted() {
    this.lineSignUpAuthorizeURL = await this.getLineSignUpAuthorizeURL()
    this.twitterSignUpAuthorizeURL = await this.getTwitterSignUpAuthorizeURL()
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
    isShowOnlyEmailAuth() {
      return this.isShowEmailAuth && !this.isShowExternalProviderAuth
    },
    isShowOnlyExternalProviderAuth() {
      return !this.isShowEmailAuth && this.isShowExternalProviderAuth
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
    showEmailAuth() {
      this.isSelectedEmailAuth = true
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
            errorMessage = 'エラーが発生しました。入力内容を確認してください'
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
      'resetPassword',
      'getLineSignUpAuthorizeURL',
      'getTwitterSignUpAuthorizeURL'
    ])
  }
}
</script>

<style lang="scss" scoped>
.modal-body {
  margin: 0 auto;
  display: flex;
}

.title {
  color: #030303;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 5px;
  margin: 0 0 20px;
  text-align: center;
  padding-top: 20px;
}

.email-auth {
  max-width: 520px;
  width: 100%;

  &.isSelectedEmailAuth {
    max-width: 100%;

    .signup-form {
      margin: 20px auto 0;
      max-width: 400px;
    }
  }
}

.signup-form {
  margin: 60px auto 0;
  width: 100%;

  &-group {
    position: relative;
  }

  &-label {
    color: #030303;
    font-size: 14px;
    line-height: 2.4;
  }

  &-input {
    appearance: none;
    box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.5);
    border: none;
    border-radius: 0;
    box-sizing: border-box;
    margin-bottom: 40px;
    padding: 12px;
    width: 100%;

    &::-webkit-input-placeholder {
      padding: 3px;
      color: #cecece;
      font-size: 14px;
      letter-spacing: 0.05em;
    }

    &:focus {
      outline: 0;
    }
  }

  .error-message {
    bottom: 20px;
    margin: 0;
    color: #f06273;
    font-size: 12px;
    position: absolute;
    width: 100%;
    text-align: right;
  }

  .error {
    .signup-form {
      &-input {
        box-shadow: 0 0 16px 0 rgba(240, 98, 115, 0.5);
      }
    }
  }
}

.modal-footer {
  width: 270px;
  margin: 20px auto 0;
  position: relative;

  .registration-button {
    margin: 20px auto 0;
  }

  .error-message {
    top: -60px;
    color: #f06273;
    font-size: 12px;
    width: 100%;
    position: absolute;
  }

  .link {
    @include default-link();
  }
}

.external-provider-auth {
  width: 100vw;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: url('~assets/images/pc/bg/signup.png') no-repeat;
  background-size: auto 370px;
  background-position-x: center;
  margin: -50px -30px 0;
}

@mixin external-provider-button {
  border-radius: 18px;
  border: none;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 14px;
  outline: none;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  width: 255px;
}

.line-button {
  margin-top: 270px;
  background: url('~assets/images/pc/common/icon_line.png') no-repeat;
  background-color: #00c300;
  background-size: 24px;
  background-position: 24px 7px;
  @include external-provider-button();
}

.twitter-button {
  margin: 20px 0 0;
  background: url('~assets/images/pc/common/icon_twitter.png') no-repeat;
  background-color: #1da1f3;
  background-size: 20px;
  background-position: 26px 10px;
  @include external-provider-button();
}

.for-email-signup {
  margin: 24px 0 0;
  color: #4e4e4e;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
}

.agreement-confirmation {
  @include default-text();
  color: #6e6e6e;
  max-width: 320px;
  text-align: center;
  margin: 20px 0 0;
}

.external-provider-confirmation {
  color: #6e6e6e;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
  margin: 40px 0 60px;
}

.for-login-user {
  display: flex;
  color: #333;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  height: 36px;
  align-items: center;
  justify-content: center;
  margin: 0 -30px -20px;
  box-shadow: 0 0 8px 0 rgba(192, 192, 192, 0.5);
}

.for-login-user-sp {
  color: #6e6e6e;
  font-size: 12px;
  margin: 20px auto 30px;
  max-width: 256px;
  text-align: right;

  .for-login-user-link {
    color: #0086cc;
    cursor: pointer;
  }
}

@media screen and (max-width: 550px) {
  .email-auth {
    &.isSelectedEmailAuth {
      .signup-form {
        max-width: 256px;
      }
    }
  }

  .external-provider-auth {
    background-size: auto 450px;
    margin: -60px -30px 0;
  }

  .line-button {
    margin-top: 370px;
  }

  .for-login-user {
    color: #6e6e6e;
    font-size: 12px;
    margin: 10px auto 20px;
    max-width: 320px;
    text-align: right;
    box-shadow: none;
    display: block;

    .link-sp {
      color: #0086cc;
    }
  }
}

@media screen and (max-width: 320px) {
  .title {
    padding-top: 0;
  }

  .agreement-confirmation {
    margin: 10px 0 0;
    padding: 0 10px;
  }

  .external-provider-confirmation {
    margin: 10px 0;
    padding: 0 10px;
  }
}
</style>
