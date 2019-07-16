<template>
  <div>
    <h1 v-if="isSelectedEmailAuth" class="title">
      ログイン
    </h1>
    <div class="modal-body">
      <div v-show="isSelectedEmailAuth" class="email-auth" :class="{ isSelectedEmailAuth }">
        <form class="signup-form" @keypress.enter="onSubmit">
          <form-group
            ref="userIdOrEmail"
            label="ユーザーID または メールアドレス"
            :inputAttrs="{ type: 'text', placeholder: 'alis@example.com' }"
            :hasError="hasUserIdOrEmailError"
            @input="setUserIdOrEmail"
            @blur="showError('userIdOrEmail')"
            @focus="resetError('userIdOrEmail')"
          />
          <form-group
            ref="password"
            label="パスワード※半角英数字8文字以上"
            :inputAttrs="{ ref: 'password', type: 'password', placeholder: '●●●●●●●●' }"
            :hasError="hasPasswordError"
            :errorMessage="
              showErrorInvalidPassword ? 'パスワードは8文字以上で入力してください' : ''
            "
            @input="setPassword"
            @blur="showError('password')"
            @focus="resetError('password')"
          />
        </form>
        <div class="modal-footer">
          <p class="error-message">
            {{ errorMessage }}
          </p>

          <p class="agreement-confirmation" :class="{ isSelectedEmailAuth }">
            <nuxt-link to="/terms" target="_blank">
              利用規約
            </nuxt-link>、
            <nuxt-link to="/privacy" target="_blank">
              プライバシーポリシー
            </nuxt-link>に同意して
          </p>
          <app-button class="login-button" :disabled="invalidSubmit" @click="onSubmit">
            ログインする
          </app-button>
          <p class="for-password-forgot-user">
            パスワードを忘れた方は<span class="link" @click="forgotPassword">こちら</span>
          </p>
        </div>
      </div>
      <div v-show="!isSelectedEmailAuth" class="external-provider-auth">
        <a class="line-button" :href="lineLoginAuthorizeURL">
          LINEでログイン
        </a>
        <a class="twitter-button" :href="twitterLoginAuthorizeURL">
          Twitterでログイン
        </a>
        <a class="facebook-button" :href="facebookLoginAuthorizeURL">
          Facebookでログイン
        </a>
        <a class="yahoo-button" :href="yahooLoginAuthorizeURL">
          Yahoo!でログイン
        </a>
        <p class="for-email-login" @click="showEmailAuth">
          メールでログイン
        </p>
        <p class="agreement-confirmation">
          上記を押した場合、<nuxt-link to="/terms" target="_blank">
            利用規約
          </nuxt-link>・<nuxt-link to="/privacy" target="_blank">
            プライバシーポリシー
          </nuxt-link>に同意したものとみなします
        </p>
      </div>
    </div>
    <div v-if="!isSelectedEmailAuth" class="for-signup-user" @click="transitToSignup">
      新規登録をされる方は<span class="link-sp">こちら</span>
    </div>
    <div v-else class="for-signup-user-sp">
      新規登録をされる方は<span class="for-signup-user-link" @click="transitToSignup">こちら</span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import AppButton from '../atoms/AppButton'
import FormGroup from '../organisms/FormGroup'
import { getOAuthParams, removeOAuthParams } from '~/utils/oauth'

export default {
  components: {
    AppButton,
    FormGroup
  },
  data() {
    return {
      errorMessage: '',
      lineLoginAuthorizeURL: null,
      twitterLoginAuthorizeURL: null,
      facebookLoginAuthorizeURL: null,
      yahooLoginAuthorizeURL: null,
      isSelectedEmailAuth: false,
      isProcessing: false
    }
  },
  async mounted() {
    ;[
      this.lineLoginAuthorizeURL,
      this.twitterLoginAuthorizeURL,
      this.facebookLoginAuthorizeURL,
      this.yahooLoginAuthorizeURL
    ] = await Promise.all([
      this.getLineLoginAuthorizeURL(),
      this.getTwitterLoginAuthorizeURL(),
      this.getFacebookLoginAuthorizeURL(),
      this.getYahooLoginAuthorizeURL()
    ])
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
    showEmailAuth() {
      this.isSelectedEmailAuth = true
    },
    async onSubmit() {
      if (this.invalidSubmit || this.isProcessing) return
      const { userIdOrEmail, password } = this.loginModal.formData
      try {
        this.isProcessing = true
        await this.login({ userId: userIdOrEmail, password })
        await this.setCurrentUserInfo()
        this.setLoginModal({ showLoginModal: false })

        this.sendNotification({ text: 'ログインしました' })

        document.querySelector('html,body').style.overflow = ''
        this.$refs.userIdOrEmail.value = ''
        this.$refs.password.value = ''
        this.resetPassword()

        const oauthParams = getOAuthParams()
        if (oauthParams) {
          this.$router.push({ path: 'oauth-authenticate', query: { ...oauthParams } })
          removeOAuthParams()
        }
      } catch (error) {
        let errorMessage = ''
        switch (error.code) {
          case 'NotAuthorizedException':
            errorMessage = 'ユーザーID・メールアドレスまたはパスワードが正しくありません'
            break
          default:
            errorMessage = 'エラーが発生しました。入力内容を確認してください'
            break
        }
        this.errorMessage = errorMessage
      } finally {
        this.isProcessing = false
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
      'getTwitterLoginAuthorizeURL',
      'getFacebookLoginAuthorizeURL',
      'getYahooLoginAuthorizeURL'
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
}

.modal-footer {
  width: 270px;
  margin: 20px auto 0;
  position: relative;

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

.external-provider-auth {
  width: 100vw;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: url('~assets/images/pc/bg/login.png') no-repeat;
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
  margin-top: 158px;
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

.facebook-button {
  margin: 20px 0 0;
  background: url('~assets/images/pc/common/icon_btn_facebook.png') no-repeat;
  background-color: #425eac;
  background-size: 22px;
  background-position: 25px 7px;
  @include external-provider-button();
}

.yahoo-button {
  margin: 20px 0 0;
  background: url('~assets/images/pc/common/icon_btn_yahoo.png') no-repeat;
  background-color: #fff;
  background-size: 22px;
  background-position: 26px 8px;
  @include external-provider-button();
  color: #030303;
}

.for-email-login {
  margin: 24px 0 0;
  color: #4e4e4e;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
}

.agreement-confirmation {
  @include default-text();
  text-align: center;
  margin: 20px 0 60px;

  &.isSelectedEmailAuth {
    margin: 20px 0 0;
  }
}

.for-signup-user {
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

.for-signup-user-sp {
  font-size: 12px;
  margin: 0 auto 30px;
  text-align: right;
  width: 270px;

  .for-signup-user-link {
    @include default-link();
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
    background-size: auto 400px;
    margin: -60px -30px 0;
  }

  .line-button {
    margin-top: 258px;
  }

  .for-signup-user {
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
