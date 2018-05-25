<template>
  <div>
    <div class="modal-body">
      <p class="announce">
        電話番号を入力してください
      </p>
      <p class="description">
        ご入力いただいた電話番号にSMSで認証コードを送らせていただきます
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
            @input="setPhoneNumber"
            @blur="showError('phoneNumber')"
            @focus="resetError('phoneNumber')">
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <p class="error-message">{{errorMessage}}</p>
      <p class="error-message" v-if="showErrorInvalidPhoneNember">電話番号は11文字でご入力ください</p>
      <p class="error-message" v-if="showErrorPhoneNumberNumeric">電話番号は数字でご入力ください</p>
      <p class="error-message" v-if="showErrorPhoneNumberJapanesePhoneNumber">現在日本国内の電話番号のみご利用可能です</p>
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
      } catch (error) {
        let errorMessage = ''
        switch (error.code) {
          default:
            errorMessage = 'エラーが発生しました。入力内容をご確認ください'
            break
        }
        this.errorMessage = errorMessage
      }
    },
    ...mapActions('user', [
      'setSignUpAuthFlowInputPhoneNumberModal',
      'setSignUpAuthFlowInputPhoneNumberPhoneNumber',
      'showSignUpAuthFlowInputPhoneNumberError',
      'hideSignUpAuthFlowInputPhoneNumberError',
      'setSignUpAuthFlowInputAuthCodeModal',
      'updatePhoneNumber',
      'sendConfirm'
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
    border-bottom: solid 1px transparent;
    color: #858dda;
    text-decoration: none;
    transition: all 400ms ease;

    &:hover {
      border-bottom: solid 1px #858dda;
    }
  }
}

.modal-body {
  margin: 0 auto;

  .announce {
    @include default-text();
    font-size: 14px;
    margin: 60px 0 0;
    text-align: center;
  }

  .description {
    @include default-text();
    margin: 20px 0 0;
    text-align: center;
  }

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
      border-radius: 0;
      border-bottom: 1px dotted #232538;
      font-family: YuGothic;
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

  .to-next-step-button {
    margin: 20px auto 0;
  }

  .error-message {
    color: #f06273;
    font-size: 12px;
    width: 100%;
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
