<template>
  <div>
    <img class="logo" src="~assets/images/pc/common/header_logo_original.png" v-if="isShowEmailAuth && isShowExternalProviderAuth">
    <h1 class="title" v-if="isSelectedEmailAuth">ログイン</h1>
    <div class="modal-body">
      <div class="email-auth" v-show="isShowEmailAuth" :class="{ isSelectedEmailAuth }">
        <h2 class="email-auth-title" v-show="isShowEmailAuth && isShowExternalProviderAuth">メールアドレスでログインする</h2>
        <form class="signup-form" @keypress.enter="onSubmit">
          <div class="signup-form-group" :class="{ 'error': hasUserIdOrEmailError }">
            <label class="signup-form-label">ユーザーID または メールアドレス</label>
            <input
              class="signup-form-input"
              type="text"
              placeholder="alis@example.com"
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
        <div class="modal-footer">
          <p class="error-message">{{ errorMessage }}</p>

          <p class="agreement-confirmation">
            <nuxt-link to="/terms" target="_blank">利用規約</nuxt-link>、
            <nuxt-link to="/privacy" target="_blank">プライバシーポリシー</nuxt-link>に同意して
          </p>
          <app-button class="login-button" :disabled="invalidSubmit" @click="onSubmit">
            ログインする
          </app-button>
          <p class="for-password-forgot-user">
            パスワードを忘れた方は<span class="link" @click="forgotPassword">こちら</span>
          </p>
        </div>
      </div>
      <div class="divider" v-show="isShowEmailAuth && isShowExternalProviderAuth"/>
      <div class="external-provider-auth" v-show="isShowExternalProviderAuth">
        <h2 class="external-provider-auth-title" v-show="isShowEmailAuth && isShowExternalProviderAuth">外部サイトでログインする</h2>
        <a class="line-button" :href="lineLoginAuthorizeURL">
          LINEでログイン
        </a>
        <a class="twitter-button" :href="twitterLoginAuthorizeURL">
          twitterでログイン
        </a>
        <p
          class="for-email-signup"
          @click="showEmailAuth"
          v-show="isShowOnlyExternalProviderAuth">
          メールでログイン
        </p>
        <p class="agreement-confirmation text-align-left">
          上記を押した場合、
          <nuxt-link to="/terms" target="_blank">利用規約</nuxt-link>・
          <nuxt-link to="/privacy" target="_blank">プライバシーポリシー</nuxt-link>に
          同意したものとみなします
        </p>
      </div>
    </div>
    <div
      class="for-login-user"
      @click="transitToSignup"
      v-if="isShowEmailAuth && isShowExternalProviderAuth">
      新規登録の方はこちら
    </div>
    <div class="for-login-user-sp" :class="{ isSelectedEmailAuth }" v-else>
      新規登録の方は<span class="for-login-user-link" @click="transitToSignup">こちら</span>
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
      isShowEmailAuth: true,
      isShowExternalProviderAuth: true,
      errorMessage: '',
      lineLoginAuthorizeURL: null,
      twitterLoginAuthorizeURL: null,
      isSelectedEmailAuth: false
    }
  },
  async mounted() {
    this.switchAuthType()
    window.addEventListener('resize', this.handleResize)
    this.lineLoginAuthorizeURL = await this.getLineLoginAuthorizeURL()
    this.twitterLoginAuthorizeURL = await this.getTwitterLoginAuthorizeURL()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
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
    isShowOnlyEmailAuth() {
      return this.isShowEmailAuth && !this.isShowExternalProviderAuth
    },
    isShowOnlyExternalProviderAuth() {
      return !this.isShowEmailAuth && this.isShowExternalProviderAuth
    },
    ...mapGetters('user', ['loginModal', 'showLoginModal'])
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
    handleResize() {
      this.switchAuthType()
    },
    switchAuthType() {
      if (this.isSelectedEmailAuth) return
      this.isShowEmailAuth = window.innerWidth > 920
      this.isShowExternalProviderAuth = true
    },
    showEmailAuth() {
      this.isShowEmailAuth = true
      this.isShowExternalProviderAuth = false
      this.isSelectedEmailAuth = true
    },
    async onSubmit() {
      if (this.invalidSubmit) return
      const { userIdOrEmail, password } = this.loginModal.formData
      try {
        await this.login({ userId: userIdOrEmail, password })
        await this.setCurrentUserInfo()
        this.setLoginModal({ showLoginModal: false })

        this.sendNotification({ text: 'ログインしました' })

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
      'setSignUpAuthFlowInputPhoneNumberModal',
      'getLineLoginAuthorizeURL',
      'getTwitterLoginAuthorizeURL'
    ])
  }
}
</script>

<style lang="scss" scoped>
.logo {
  margin: 0 auto 40px;
  display: block;
}

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
}

.email-auth-title,
.external-provider-auth-title {
  color: #030303;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  margin: 0;
}

.email-auth {
  max-width: 520px;
  width: 100%;

  &.isSelectedEmailAuth {
    max-width: 100%;

    .signup-form {
      margin: 30px auto 0;
      max-width: 400px;
    }
  }
}

.signup-form {
  margin: 60px auto 0;
  max-width: 250px;
  width: 100%;

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

  .for-password-forgot-user {
    @include default-text();
    text-align: right;
  }

  .link {
    @include default-link();
  }
}

.agreement-confirmation {
  @include default-text();
  max-width: 320px;
  text-align: center;
}

.text-align-left {
  text-align: left;
}

.divider {
  background-color: #858dda;
  width: 2px;
  height: 454px;
}

.external-provider-auth {
  max-width: 520px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

@mixin external-provider-button {
  border-radius: 18px;
  border: none;
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
  margin-top: 60px;
  background: url('~assets/images/pc/common/icon_line.png') no-repeat;
  background-color: #00c300;
  background-size: 24px;
  background-position: 24px 7px;
  @include external-provider-button();
}

.twitter-button {
  margin: 30px 0 60px;
  background: url('~assets/images/pc/common/icon_twitter.png') no-repeat;
  background-color: #1da1f3;
  background-size: 20px;
  background-position: 26px 10px;
  @include external-provider-button();
}

.for-login-user {
  display: flex;
  background-color: #05051e;
  color: #fff;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  height: 34px;
  align-items: center;
  justify-content: center;
  margin: 0 -30px -20px;
}

.for-login-user-sp {
  color: #6e6e6e;
  font-size: 12px;
  margin: 30px auto 0;
  max-width: 320px;
  text-align: right;

  &.isSelectedEmailAuth {
    display: none;
  }
}

@media screen and (max-width: 920px) {
  .email-auth,
  .external-provider-auth {
    max-width: 100%;
  }

  .signup-form {
    margin: 30px auto 0;
    max-width: 400px;
    width: 100%;
  }

  .line-button {
    margin-top: 10px;
  }

  .twitter-button {
    margin: 30px 0;
  }

  .for-email-signup {
    margin: 10px 0 30px 0;
    color: #4e4e4e;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
  }

  .for-login-user-link {
    color: #858dda;
    cursor: pointer;
  }
}

@media screen and (max-width: 550px) {
  .logo {
    margin: 0 auto 80px;
    display: block;
    padding-top: 40px;
  }
}
</style>
