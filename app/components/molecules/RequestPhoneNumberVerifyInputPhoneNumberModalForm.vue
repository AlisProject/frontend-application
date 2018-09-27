<template>
  <div>
    <div class="modal-body">
      <p class="announce">
        {{ confirmText }}
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
            ref="phoneNumber"
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
    confirmText() {
      const text = '電話番号の認証が必要です'
      switch (this.requestPhoneNumberVerifyModal.requestType) {
        case 'articleLike':
          return `記事の作成・評価には${text}`
        case 'articleComment':
          return `記事へのコメントには${text}`
        case 'articleCommentLike':
          return `コメントの評価には${text}`
        case 'articleTip':
          return `トークンを贈るには${text}`
        case 'viewPublicArticles':
          return `自分の公開済み記事一覧を閲覧するためには${text}`
        default:
          return text
      }
    },
    showErrorInvalidPhoneNember() {
      return (
        this.requestPhoneNumberVerifyModal.inputPhoneNumber.formError.phoneNumber &&
        (!this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData.phoneNumber.minLength ||
          !this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData.phoneNumber.maxLength)
      )
    },
    showErrorPhoneNumberNumeric() {
      return (
        this.requestPhoneNumberVerifyModal.inputPhoneNumber.formError.phoneNumber &&
        !this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData.phoneNumber.numeric
      )
    },
    showErrorPhoneNumberJapanesePhoneNumber() {
      return (
        this.requestPhoneNumberVerifyModal.inputPhoneNumber.formError.phoneNumber &&
        !this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData.phoneNumber
          .japanesePhoneNumber
      )
    },
    invalidSubmit() {
      return this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData.$invalid
    },
    hasUserIdOrEmailError() {
      return (
        this.requestPhoneNumberVerifyModal.inputPhoneNumber.formError.userIdOrEmail &&
        this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData.userIdOrEmail.$error
      )
    },
    hasPhoneNumberError() {
      return (
        this.requestPhoneNumberVerifyModal.inputPhoneNumber.formError.phoneNumber &&
        this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData.phoneNumber.$error
      )
    },
    ...mapGetters('user', ['requestPhoneNumberVerifyModal', 'requestPhoneNumberVerifyModal'])
  },
  validations: {
    requestPhoneNumberVerifyModal: {
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
      this.setRequestPhoneNumberVerifyInputPhoneNumberPhoneNumber({ phoneNumber: e.target.value })
    },
    showError(type) {
      this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData[type].$touch()
      this.showRequestPhoneNumberVerifyInputPhoneNumberError({ type })
    },
    resetError(type) {
      this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData[type].$reset()
      this.hideRequestPhoneNumberVerifyInputPhoneNumberError({ type })
    },
    async onSubmit() {
      if (this.invalidSubmit) return
      const { phoneNumber } = this.requestPhoneNumberVerifyModal.inputPhoneNumber.formData

      try {
        await this.updatePhoneNumber({ phoneNumber: `+81${phoneNumber.slice(1)}` })
        await this.sendConfirm()

        this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: false })
        this.setRequestPhoneNumberVerifyInputAuthCodeModal({ isShow: true })
        this.$refs.phoneNumber.value = ''
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
      'setRequestPhoneNumberVerifyInputPhoneNumberModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberPhoneNumber',
      'showRequestPhoneNumberVerifyInputPhoneNumberError',
      'hideRequestPhoneNumberVerifyInputPhoneNumberError',
      'setRequestPhoneNumberVerifyInputAuthCodeModal',
      'updatePhoneNumber',
      'sendConfirm'
    ])
  }
}
</script>

<style lang="scss" scoped>
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
