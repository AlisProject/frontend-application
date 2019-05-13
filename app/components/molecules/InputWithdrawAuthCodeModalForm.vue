<template>
  <div>
    <div class="modal-body">
      <p class="announce">
        出金用認証コードを入力してください
      </p>
      <p class="description">
        登録いただいていてる電話番号へSMSを送らせていただきました。SMSに記載の6桁の出金用認証コードを以下に入力し、出金を完了させてください。
      </p>
      <form class="signup-form" @keypress.enter.prevent="onSubmit">
        <div class="signup-form-group" :class="{ error: hasAuthCodeError }">
          <label class="signup-form-label">出金用認証コード</label>
          <input
            class="signup-form-input"
            type="text"
            placeholder="123456"
            maxlength="6"
            autofocus
            @input="setAuthCode"
            @blur="showError('authCode')"
            @focus="resetError('authCode')"
          >
          <p v-if="showErrorAuthCodeNumeric" class="error-message">
            認証コードは数字で入力してください
          </p>
          <p v-else-if="showErrorInvalidAuthCode" class="error-message">
            認証コードは6文字で入力してください
          </p>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <p class="error-message">
        {{ errorMessage }}
      </p>
      <app-button
        class="to-next-step-button"
        :disabled="invalidSubmit"
        :isLoading="isProcessing"
        @click="onSubmit"
      >
        認証コードを送信して出金する
      </app-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { required, minLength, maxLength, numeric } from 'vuelidate/lib/validators'
import { BigNumber } from 'bignumber.js'
import AppButton from '../atoms/AppButton'
import { addDigitSeparator } from '~/utils/wallet'

const formatNumber = 10 ** 18

export default {
  components: {
    AppButton
  },
  data() {
    return {
      authCode: '',
      errorMessage: '',
      formError: {
        authCode: false
      },
      isProcessing: false
    }
  },
  computed: {
    showErrorInvalidAuthCode() {
      return this.formError.authCode && (!this.$v.authCode.minLength || !this.$v.authCode.maxLength)
    },
    showErrorAuthCodeNumeric() {
      return this.formError.authCode && !this.$v.authCode.numeric
    },
    invalidSubmit() {
      return this.$v.$invalid
    },
    hasAuthCodeError() {
      return this.formError.authCode && this.$v.authCode.$error
    },
    ...mapGetters('user', ['inputWithdrawAuthCodeModal'])
  },
  validations: {
    authCode: {
      required,
      minLength: minLength(6),
      maxLength: maxLength(6),
      numeric
    }
  },
  methods: {
    setAuthCode(e) {
      this.authCode = e.target.value
    },
    showError(type) {
      this.$v[type].$touch()
      this.formError[type] = true
    },
    resetError(type) {
      this.$v[type].$reset()
      this.formError[type] = false
    },
    async onSubmit() {
      if (this.invalidSubmit) return
      const { authCode: code } = this
      const { address: recipientEthAddress, totalAmount } = this.inputWithdrawAuthCodeModal
      const accessToken = this.getAccessToken()
      try {
        if (this.isProcessing) return
        this.isProcessing = true
        const sendValue = new BigNumber(totalAmount).multipliedBy(formatNumber).toString(10)
        const hasExceededAmount = await this.checkIsWithdrawable(totalAmount)
        if (!hasExceededAmount) {
          this.errorMessage = 'ALISが不足しています'
          return
        }
        const isCompleted = await this.postTokenSend({
          recipientEthAddress,
          sendValue,
          accessToken,
          code
        })
        if (isCompleted) {
          this.sendNotification({ text: '出金を受け付けました' })
        } else {
          this.sendNotification({
            text: '出金を受け付けました。出金処理の完了までしばらくお待ち下さい'
          })
        }
        this.$root.$emit('resetWithdrawTokenComponentState')
        this.setInputWithdrawAuthCodeModal({ isShow: false })
      } catch (error) {
        const text = this.getNotificationTextFromErrorMessage(error.response.data.message)
        this.sendNotification({ text, type: 'warning' })
      } finally {
        this.isProcessing = false
      }
    },
    async checkIsWithdrawable(amount) {
      const { result } = await this.getBalance()
      const myBalance = new BigNumber(result, 16).div(formatNumber)
      return myBalance.isGreaterThanOrEqualTo(amount)
    },
    getAccessToken() {
      const currentUser = localStorage.getItem(
        `CognitoIdentityServiceProvider.${process.env.CLIENT_ID}.LastAuthUser`
      )
      const accessToken = localStorage.getItem(
        `CognitoIdentityServiceProvider.${process.env.CLIENT_ID}.${currentUser}.accessToken`
      )
      return accessToken
    },
    getNotificationTextFromErrorMessage(errorMessage) {
      switch (errorMessage) {
        case 'Invalid parameter: Token withdrawal limit has been exceeded.':
          const dailyLimit = addDigitSeparator(
            new BigNumber(process.env.DAILY_LIMIT_TOKEN_SEND_VALUE).div(formatNumber).toString(10)
          )
          return `一日の出金上限額である${dailyLimit}ALIS（手数料含む）を超えたため、出金できませんでした`
        case 'Invalid parameter: send_value':
          return 'エラーが発生しました。入力内容を確認してください'
        default:
          return '出金のトランザクション発行に失敗しました'
      }
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('user', [
      'setInputWithdrawAuthCodeModal',
      'setInputWithdrawAuthCodeModalValues',
      'postTokenSend',
      'getBalance'
    ])
  }
}
</script>

<style lang="scss" scoped>
.modal-body {
  margin: 0 auto;

  .announce {
    @include default-text();
    color: #030303;
    font-weight: bold;
    font-size: 14px;
    margin: 60px auto 0;
    text-align: center;
  }

  .description {
    @include default-text();
    color: #6e6e6e;
    font-size: 12px;
    letter-spacing: 0.8px;
    margin: 20px auto 0;
    max-width: 400px;
  }

  .signup-form {
    margin: 30px auto 0;
    max-width: 400px;
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
}

.modal-footer {
  width: 270px;
  margin: 30px auto 40px;

  .error-message {
    color: #f06273;
    font-size: 12px;
    width: 100%;
  }
}

@media screen and (max-width: 550px) {
  .modal-body {
    .announce,
    .description {
      width: 256px;
    }

    .announce {
      letter-spacing: 0;
      margin: 40px auto 0;
    }

    .description {
      text-align: left;
    }

    .signup-form {
      width: 256px;
    }
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
