<template>
  <div class="wrapper">
    <span class="skip" @click="skip">スキップ</span>
    <div class="modal-body">
      <p class="announce">
        電話番号を入力してアカウント認証を完了してください
      </p>
      <p class="description">
        ご入力いただいた電話番号にSMSで認証コードを送らせていただきます※アカウントの不正利用を防ぐため、電話番号での認証を行ってください
      </p>
      <form class="signup-form" @keypress.enter.prevent="onSubmit">
        <div class="signup-form-group" :class="{ 'error': hasPhoneNumberError }">
          <label class="signup-form-label">電話番号</label>
          <input
            class="signup-form-input"
            type="tel"
            placeholder="08012345678"
            maxlength="11"
            autofocus
            ref="phoneNumber"
            @input="setPhoneNumber"
            @blur="showError('phoneNumber')"
            @focus="resetError('phoneNumber')">
          <p class="error-message" v-if="showErrorPhoneNumberNumeric">電話番号は数字で入力してください</p>
          <p class="error-message" v-else-if="showErrorInvalidPhoneNember">電話番号は11文字で入力してください</p>
          <p class="error-message" v-else-if="showErrorPhoneNumberJapanesePhoneNumber">現在日本国内の電話番号のみ利用できます</p>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <p class="error-message">{{errorMessage}}</p>
      <app-button class="to-next-step-button" :disabled="invalidSubmit" @click="onSubmit">
        次へ
      </app-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, minLength, maxLength, numeric } from 'vuelidate/lib/validators'
import AppButton from '../atoms/AppButton'

function japanesePhoneNumber(value) {
  return Boolean(value.match(/^0[789]0/))
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
    showErrorInvalidPhoneNember() {
      return (
        this.signUpAuthFlowModal.inputPhoneNumber.formError.phoneNumber &&
        (!this.$v.signUpAuthFlowModal.inputPhoneNumber.formData.phoneNumber.minLength ||
          !this.$v.signUpAuthFlowModal.inputPhoneNumber.formData.phoneNumber.maxLength)
      )
    },
    showErrorPhoneNumberNumeric() {
      return (
        this.signUpAuthFlowModal.inputPhoneNumber.formError.phoneNumber &&
        !this.$v.signUpAuthFlowModal.inputPhoneNumber.formData.phoneNumber.numeric
      )
    },
    showErrorPhoneNumberJapanesePhoneNumber() {
      return (
        this.signUpAuthFlowModal.inputPhoneNumber.formError.phoneNumber &&
        !this.$v.signUpAuthFlowModal.inputPhoneNumber.formData.phoneNumber.japanesePhoneNumber
      )
    },
    invalidSubmit() {
      return this.$v.signUpAuthFlowModal.inputPhoneNumber.formData.$invalid
    },
    hasUserIdOrEmailError() {
      return (
        this.signUpAuthFlowModal.inputPhoneNumber.formError.userIdOrEmail &&
        this.$v.signUpAuthFlowModal.inputPhoneNumber.formData.userIdOrEmail.$error
      )
    },
    hasPhoneNumberError() {
      return (
        this.signUpAuthFlowModal.inputPhoneNumber.formError.phoneNumber &&
        this.$v.signUpAuthFlowModal.inputPhoneNumber.formData.phoneNumber.$error
      )
    },
    ...mapGetters('user', ['signUpAuthFlowModal'])
  },
  validations: {
    signUpAuthFlowModal: {
      inputPhoneNumber: {
        formData: {
          phoneNumber: {
            required,
            minLength: minLength(11),
            maxLength: maxLength(11),
            numeric,
            japanesePhoneNumber
          }
        }
      }
    }
  },
  methods: {
    setPhoneNumber(e) {
      this.setSignUpAuthFlowInputPhoneNumberPhoneNumber({ phoneNumber: e.target.value })
    },
    showError(type) {
      this.$v.signUpAuthFlowModal.inputPhoneNumber.formData[type].$touch()
      this.showSignUpAuthFlowInputPhoneNumberError({ type })
    },
    resetError(type) {
      this.$v.signUpAuthFlowModal.inputPhoneNumber.formData[type].$reset()
      this.hideSignUpAuthFlowInputPhoneNumberError({ type })
    },
    async onSubmit() {
      if (this.invalidSubmit) return
      const { userIdOrEmail } = this.signUpAuthFlowModal.login.formData
      const { phoneNumber } = this.signUpAuthFlowModal.inputPhoneNumber.formData

      try {
        await this.updatePhoneNumber({
          userId: userIdOrEmail,
          phoneNumber: `+81${phoneNumber.slice(1)}`
        })
        await this.sendConfirm()

        this.setSignUpAuthFlowInputPhoneNumberModal({
          isSignUpAuthFlowInputPhoneNumberModal: false
        })
        this.setSignUpAuthFlowInputAuthCodeModal({
          isSignUpAuthFlowInputAuthCodeModal: true
        })
        this.$refs.phoneNumber.value = ''
      } catch (error) {
        let errorMessage = ''
        switch (error.code) {
          default:
            errorMessage = 'エラーが発生しました。入力内容を確認してください'
            break
        }
        this.errorMessage = errorMessage
      }
    },
    skip() {
      this.setSignUpAuthFlowInputPhoneNumberModal({
        isSignUpAuthFlowInputPhoneNumberModal: false
      })
      this.setSignUpAuthFlowProfileSettingsModal({
        isSignUpAuthFlowProfileSettingsModal: true
      })
    },
    ...mapActions('user', [
      'setSignUpAuthFlowInputPhoneNumberModal',
      'setSignUpAuthFlowInputPhoneNumberPhoneNumber',
      'showSignUpAuthFlowInputPhoneNumberError',
      'hideSignUpAuthFlowInputPhoneNumberError',
      'setSignUpAuthFlowInputAuthCodeModal',
      'updatePhoneNumber',
      'sendConfirm',
      'setSignUpAuthFlowProfileSettingsModal'
    ])
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
}

.skip {
  color: #0086cc;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.93px;
  position: absolute;
  right: -14px;
  top: -120px;
}

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

  .to-next-step-button {
    margin: 20px auto 0;
  }

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

    .signup-form {
      width: 256px;
    }
  }
}

@media screen and (max-width: 320px) {
  .modal-footer {
    width: 250px;
  }
}
</style>
