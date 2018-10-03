<template>
  <div>
    <img class="logo" src="~assets/images/pc/common/header_logo_original.png">
    <div class="modal-body">
      <div class="email-auth" v-show="isShowEmailAuth">
        <h2 class="email-auth-title" v-show="isShowEmailAuth && isShowSNSAuth">メールアドレスで登録する</h2>
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
      <div class="divider" v-show="isShowEmailAuth && isShowSNSAuth"/>
      <div class="sns-auth" v-show="isShowSNSAuth">
        <h2 class="sns-auth-title" v-show="isShowEmailAuth && isShowSNSAuth">外部サイトで登録する</h2>
        <template v-if="isShowOnlySNSAuth">
          <p class="brand-message">
            ALISは、記事を読む人こそ主役になれるメディアです。
          </p>
          <p class="brand-message">
            記事を書くことだけでなく、読むことも大切な役割なので、報酬を受け取ることができます。
          </p>
          <p class="brand-message">
            書く人と読む人が、一緒に読む価値のある情報を作り出しすべての人に公開できるメディアになります。
          </p>
        </template>
        <a class="line-button" :href="lineAuthorizeURL">
          LINEではじめる
        </a>
        <button class="twitter-button">
          twitterではじめる
        </button>
        <p
          class="for-email-signup"
          @click="showEmailAuth"
          v-show="isShowOnlySNSAuth">
          メールではじめる
        </p>
        <p class="agreement-confirmation text-align-left">
          上記を押した場合、
          <nuxt-link to="/terms" target="_blank">利用規約</nuxt-link>・
          <nuxt-link to="/privacy" target="_blank">プライバシーポリシー</nuxt-link>に
          同意したものとみなします
        </p>
      </div>
    </div>
    <div class="for-login-user" @click="transitToLogin">
      ログインされる方はこちら
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
      isShowEmailAuth: true,
      isShowSNSAuth: true,
      errorMessage: '',
      lineAuthorizeURL: null
    }
  },
  async mounted() {
    this.switchAuthType()
    this.lineAuthorizeURL = await this.getLineAuthorizeURL()
    document.querySelector('.modal-container').style.maxWidth = '1034px'
    window.addEventListener('resize', this.handleResize)
    this.listen(window, 'click', (event) => {
      if (!document.querySelector('.modal-container').contains(event.target)) {
        window.removeEventListener('resize', this.handleResize)
      }
    })
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
      return this.isShowEmailAuth && !this.isShowSNSAuth
    },
    isShowOnlySNSAuth() {
      return !this.isShowEmailAuth && this.isShowSNSAuth
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
    handleResize() {
      this.switchAuthType()
    },
    switchAuthType() {
      this.isShowEmailAuth = window.innerWidth > 920
      this.isShowSNSAuth = true
    },
    showEmailAuth() {
      this.isShowEmailAuth = true
      this.isShowSNSAuth = false
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
    listen(target, eventType, callback) {
      if (!this._eventRemovers) {
        this._eventRemovers = []
      }
      target.addEventListener(eventType, callback)
      this._eventRemovers.push({
        remove() {
          target.removeEventListener(eventType, callback)
        }
      })
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
      'getLineAuthorizeURL'
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

.email-auth-title,
.sns-auth-title {
  color: #030303;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  margin: 0;
}

.email-auth {
  max-width: 520px;
  width: 100%;
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

.modal-footer {
  width: 270px;
  margin: 40px auto 60px;
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

.sns-auth {
  max-width: 520px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

@mixin sns-button {
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
  background-color: #00c300;
  @include sns-button();
}

.twitter-button {
  margin: 30px 0 60px;
  background-color: #1da1f3;
  @include sns-button();
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

@media screen and (max-width: 920px) {
  .email-auth,
  .sns-auth {
    max-width: 100%;
  }

  .signup-form {
    margin: 30px auto 0;
    max-width: 400px;
    width: 100%;
  }

  .brand-message {
    color: #4e4e4e;
    font-size: 12px;
    font-weight: bold;
    line-height: 1.5;
    margin: 0;
    max-width: 324px;
    width: 100%;
  }

  .twitter-button {
    margin: 30px 0;
  }

  .for-email-signup {
    margin: 0 0 30px 0;
    color: #4e4e4e;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
  }

  .for-login-user {
    margin: 30px -30px -30px;
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
