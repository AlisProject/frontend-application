<template>
  <div>
    <div class="modal-body">
      <div class="wallet-password">
        <form class="wallet-password-form" @keypress.enter.prevent="onSubmit">
          <form-group
            label="パスワード※半角英数字8文字以上 "
            :inputAttrs="{ ref: 'walletPassword', type: 'password', placeholder: '●●●●●●●●' }"
            :hasError="hasPasswordError"
            :errorMessage="
              showErrorInvalidPassword ? 'パスワードは8文字以上で入力してください' : ''
            "
            @input="setWalletPassword"
            @blur="showError('walletPassword')"
            @focus="resetError('walletPassword')"
          />
          <form-group
            label="確認用"
            :inputAttrs="{ ref: 'repeatPassword', type: 'password', placeholder: '●●●●●●●●' }"
            :hasError="hasRepeatPasswordError"
            :errorMessage="showErrorInvalidRepeatPassword ? 'パスワードが異なります。' : ''"
            @input="setRepeatPassword"
            @blur="showRepeatPasswordError"
            @focus="resetRepeatPasswordError"
          />
          <span class="warning">
            ※
            パスワードの再発行は行なえません。忘れた場合出金すること等ができなくなりますので十分注意してください。
          </span>
        </form>
        <div class="modal-footer">
          <p class="error-message">
            {{ errorMessage }}
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
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, sameAs, minLength } from 'vuelidate/lib/validators'
import AppButton from '../atoms/AppButton'
import FormGroup from '../organisms/FormGroup'
import { createAccount, generateSignatureWeb3 } from '~/utils/web3'
import { passwordToPbkdf2, encryptSecretKey, setLocalStoragePbkdf2Key } from '~/utils/wallet'

export default {
  components: {
    AppButton,
    FormGroup
  },
  data() {
    return {
      repeatPassword: '',
      errorMessage: '',
      isProcessing: false
    }
  },
  computed: {
    showErrorInvalidPassword() {
      return (
        this.signUpAuthFlowModal.inputWalletPassword.formError.walletPassword &&
        !this.$v.signUpAuthFlowModal.inputWalletPassword.formData.walletPassword.minLength
      )
    },
    showErrorInvalidRepeatPassword() {
      return (
        this.signUpAuthFlowModal.inputWalletPassword.formError.repeatPassword &&
        !this.$v.repeatPassword.sameAsPassword
      )
    },
    invalidSubmit() {
      return this.$v.$invalid
    },
    hasPasswordError() {
      return (
        this.signUpAuthFlowModal.inputWalletPassword.formError.walletPassword &&
        this.$v.signUpAuthFlowModal.inputWalletPassword.formData.walletPassword.$error
      )
    },
    hasRepeatPasswordError() {
      return (
        this.signUpAuthFlowModal.inputWalletPassword.formError.repeatPassword &&
        this.$v.repeatPassword.$error
      )
    },
    ...mapGetters('user', ['signUpAuthFlowModal', 'currentUser'])
  },
  validations: {
    signUpAuthFlowModal: {
      inputWalletPassword: {
        formData: {
          walletPassword: {
            required,
            minLength: minLength(8)
          }
        }
      }
    },
    repeatPassword: {
      required,
      // sameAs の引数には比較元とは異なる階層のデータ取得に対応していないため、
      // 関数経由で該当データを取得している。詳細は下記ページを参照している。
      // https://github.com/vuelidate/vuelidate/issues/252
      sameAsPassword: sameAs(function() {
        return this.signUpAuthFlowModal.inputWalletPassword.formData.walletPassword
      })
    }
  },
  methods: {
    setWalletPassword(e) {
      this.setSignUpAuthFlowInputWalletPassword({ password: e.target.value })
    },
    setRepeatPassword(e) {
      this.repeatPassword = e.target.value
    },
    showError(type) {
      this.$v.signUpAuthFlowModal.inputWalletPassword.formData[type].$touch()
      this.showSignUpAuthFlowInputWalletPasswordError({ type })
    },
    resetError(type) {
      this.$v.signUpAuthFlowModal.inputWalletPassword.formData[type].$reset()
      this.hideSignUpAuthFlowInputWalletPasswordError({ type })
    },
    showRepeatPasswordError() {
      this.$v.repeatPassword.$touch()
      this.showSignUpAuthFlowInputWalletPasswordError({ type: 'repeatPassword' })
    },
    resetRepeatPasswordError() {
      this.$v.repeatPassword.$reset()
      this.hideSignUpAuthFlowInputWalletPasswordError({ type: 'repeatPassword' })
    },
    async onSubmit() {
      try {
        if (this.isProcessing || this.invalidSubmit) return
        this.isProcessing = true
        const { walletPassword } = this.signUpAuthFlowModal.inputWalletPassword.formData
        // ウォレット情報作成
        const accountInfo = await createAccount()
        const pbkdf2Info = passwordToPbkdf2(walletPassword)
        const encryptedSecretKey = encryptSecretKey(accountInfo.privateKey, pbkdf2Info.key)
        const signedData = await generateSignatureWeb3(
          this.currentUser.userId,
          accountInfo.privateKey
        )
        // ウォレット情報登録
        await this.postWalletInfo({
          walletAddress: accountInfo.address,
          salt: pbkdf2Info.salt,
          encryptedSecretKey,
          signature: signedData.signature
        })
        setLocalStoragePbkdf2Key(pbkdf2Info.key)
        this.resetPassword()
        this.setSignUpAuthFlowInputWalletPasswordModal({
          isSignUpAuthFlowInputWalletPasswordModal: false
        })
        this.setSignUpAuthFlowProfileSettingsModal({
          isSignUpAuthFlowProfileSettingsModal: true
        })

        // すぐに投げ銭など使えるようにするため
        await this.refreshUserSession()
      } catch (error) {
        this.errorMessage = 'エラーが発生しました。入力内容を確認してください'
      } finally {
        this.isProcessing = false
      }
    },
    ...mapActions('user', [
      'setSignUpAuthFlowInputWalletPasswordModal',
      'setSignUpAuthFlowInputWalletPassword',
      'showSignUpAuthFlowInputWalletPasswordError',
      'hideSignUpAuthFlowInputWalletPasswordError',
      'refreshUserSession',
      'resetPassword',
      'postWalletInfo'
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

.wallet-password {
  /*max-width: 520px;*/
  width: 100%;
  max-width: 100%;
}

.wallet-password-form {
  margin: 20px auto 0;
  max-width: 400px;

  .warning {
    margin-top: 60px;
    color: #6e6e6e;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
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
    color: #f06273;
    font-size: 12px;
    width: 100%;
  }

  .link {
    @include default-link();
  }
}

.agreement-confirmation {
  @include default-text();
  color: #6e6e6e;
  max-width: 320px;
  text-align: center;
  margin: 20px 0 0;
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
  .wallet-password-auth {
    .signup-form {
      max-width: 256px;
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
}
</style>
