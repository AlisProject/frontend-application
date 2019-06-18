<template>
  <div>
    <h1 v-if="isSelectedEmailAuth" class="title">
      新規登録
    </h1>
    <div class="modal-body">
      <div v-show="isSelectedEmailAuth" class="email-auth" :class="{ isSelectedEmailAuth }">
        <form class="signup-form" @keypress.enter.prevent="onSubmit">
          <form-group
            label="ユーザーID※半角英数字3文字以上"
            class="user-id-form"
            :inputAttrs="{ ref: 'userId', type: 'text', placeholder: 'taro', maxlength: '30' }"
            :hasError="hasUserIdError"
            :errorMessage="
              showErrorUserId
                ? '半角英数字と-（ハイフン）のみご利用下さい'
                : showErrorUserIdMinLength
                  ? '3文字以上の英数字で入力してください'
                  : ''
            "
            @input="setUserId"
            @blur="showError('userId')"
            @focus="resetError('userId')"
          />
          <span class="warning">
            ※一度登録されたIDは変更できません
          </span>
          <form-group
            label="メールアドレス"
            :inputAttrs="{
              ref: 'email',
              type: 'email',
              placeholder: 'alis@example.com',
              maxlength: '256'
            }"
            :hasError="hasEmailError"
            :errorMessage="showErrorInvalidEmail ? 'メールアドレスの形式が正しくありません' : ''"
            @input="setEmail"
            @blur="showError('email')"
            @focus="resetError('email')"
          />
          <form-group
            label="パスワード※半角英数字8文字以上 "
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
          <p class="agreement-confirmation">
            <nuxt-link to="/terms" target="_blank">
              利用規約
            </nuxt-link>・
            <nuxt-link to="/privacy" target="_blank">
              プライバシーポリシー
            </nuxt-link>に同意して
          </p>
          <app-button
            class="registration-button"
            :disabled="isProcessing || invalidSubmit"
            @click="onSubmit"
          >
            登録する
          </app-button>
        </div>
      </div>
      <div v-show="!isSelectedEmailAuth" class="external-provider-auth">
        <a class="line-button" :href="lineSignUpAuthorizeURL">
          LINEではじめる
        </a>
        <a class="twitter-button" :href="twitterSignUpAuthorizeURL">
          Twitterではじめる
        </a>
        <a class="facebook-button" :href="facebookSignUpAuthorizeURL">
          Facebookではじめる
        </a>
        <a class="yahoo-button" :href="yahooSignUpAuthorizeURL">
          Yahoo!ではじめる
        </a>
        <p class="for-email-signup" @click="showEmailAuth">
          メールではじめる
        </p>
        <p class="agreement-confirmation">
          上記を押した場合、<nuxt-link to="/terms" target="_blank">
            利用規約
          </nuxt-link>・<nuxt-link to="/privacy" target="_blank">
            プライバシーポリシー
          </nuxt-link>に同意したものとみなします
        </p>
        <p class="external-provider-confirmation">
          ※外部サービス上でALISを使っていることは表示されません
        </p>
      </div>
    </div>
    <div v-if="!isSelectedEmailAuth" class="for-login-user" @click="transitToLogin">
      ログインされる方は<span class="link-sp">こちら</span>
    </div>
    <div v-else class="for-login-user-sp">
      ログインの方は<span class="for-login-user-link" @click="transitToLogin">こちら</span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, minLength, email } from 'vuelidate/lib/validators'
import AppButton from '../atoms/AppButton'
import FormGroup from '../organisms/FormGroup'
import { removeOAuthParams } from '~/utils/oauth'

function userId(value) {
  return Boolean(value.match(/^(?!.*--)[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]$/))
}

export default {
  components: {
    AppButton,
    FormGroup
  },
  data() {
    return {
      errorMessage: '',
      lineSignUpAuthorizeURL: null,
      twitterSignUpAuthorizeURL: null,
      facebookSignUpAuthorizeURL: null,
      yahooSignUpAuthorizeURL: null,
      isSelectedEmailAuth: false,
      isProcessing: false
    }
  },
  async mounted() {
    ;[
      this.lineSignUpAuthorizeURL,
      this.twitterSignUpAuthorizeURL,
      this.facebookSignUpAuthorizeURL,
      this.yahooSignUpAuthorizeURL
    ] = await Promise.all([
      this.getLineSignUpAuthorizeURL(),
      this.getTwitterSignUpAuthorizeURL(),
      this.getFacebookSignUpAuthorizeURL(),
      this.getYahooSignUpAuthorizeURL()
    ])
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
      removeOAuthParams()
    },
    showEmailAuth() {
      this.isSelectedEmailAuth = true
    },
    async onSubmit() {
      try {
        if (this.isProcessing || this.invalidSubmit) return
        this.isProcessing = true
        const { userId, email, password } = this.signUpModal.formData
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
      } finally {
        this.isProcessing = false
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
      'getTwitterSignUpAuthorizeURL',
      'getFacebookSignUpAuthorizeURL',
      'getYahooSignUpAuthorizeURL'
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
  position: relative;

  .warning {
    position: absolute;
    color: #6e6e6e;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    top: 80px;
    right: 0;
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
    margin-top: 258px;
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
