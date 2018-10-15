<template>
  <div>
    <div class="modal-body">
      <p class="announce">
        ユーザーIDを入力して<span class="br"/>登録を完了してください
      </p>
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
      </form>
    </div>
    <div class="modal-footer">
      <p class="error-message">{{ errorMessage }}</p>
      <app-button class="to-next-step-button" :disabled="invalidSubmit" @click="onSubmit">
        登録を完了する
      </app-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'
import AppButton from '../atoms/AppButton'

function userId(value) {
  return Boolean(value.match(/^(?!.*--)[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]$/))
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
    showErrorUserIdMinLength() {
      return (
        this.signUpAuthFlowModal.inputUserId.formError.userId &&
        !this.$v.signUpAuthFlowModal.inputUserId.formData.userId.minLength
      )
    },
    showErrorUserId() {
      return (
        this.signUpAuthFlowModal.inputUserId.formError.userId &&
        !this.$v.signUpAuthFlowModal.inputUserId.formData.userId.userId
      )
    },
    invalidSubmit() {
      return this.$v.signUpAuthFlowModal.inputUserId.formData.$invalid
    },
    hasUserIdError() {
      return (
        this.signUpAuthFlowModal.inputUserId.formError.userId &&
        this.$v.signUpAuthFlowModal.inputUserId.formData.userId.$error
      )
    },
    ...mapGetters('user', ['signUpAuthFlowModal'])
  },
  validations: {
    signUpAuthFlowModal: {
      inputUserId: {
        formData: {
          userId: {
            required,
            minLength: minLength(3),
            userId
          }
        }
      }
    }
  },
  methods: {
    setUserId(e) {
      this.setSignUpAuthFlowUserId({ userId: e.target.value })
    },
    showError(type) {
      this.$v.signUpAuthFlowModal.inputUserId.formData[type].$touch()
      this.showSignUpAuthFlowInputUserIdError({ type })
    },
    resetError(type) {
      this.$v.signUpAuthFlowModal.inputUserId.formData[type].$reset()
      this.hideSignUpAuthFlowInputUserIdError({ type })
    },
    async onSubmit() {
      if (this.invalidSubmit) return
      const { userId } = this.signUpAuthFlowModal.inputUserId.formData

      try {
        await this.postUserId({ userId })
        await this.getUserSession()
        this.setSignUpAuthFlowInputUserIdModal({ isShow: false })
        this.setSignUpAuthFlowCompletedAuthModal({ isShow: true })
      } catch (error) {
        const { message } = error.response.data
        let errorMessage = ''
        switch (message) {
          case 'Invalid parameter: This id is already in use.':
            errorMessage = 'ユーザーIDはすでに存在します'
            break
          default:
            errorMessage = 'エラーが発生しました。入力内容をご確認ください'
            break
        }
        this.errorMessage = errorMessage
      }
    },
    ...mapActions('user', [
      'setSignUpAuthFlowUserId',
      'showSignUpAuthFlowInputUserIdError',
      'hideSignUpAuthFlowInputUserIdError',
      'postUserId',
      'setSignUpAuthFlowInputUserIdModal',
      'setSignUpAuthFlowCompletedAuthModal',
      'getUserSession'
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

    .error-message {
      top: 40px;
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
}

.modal-footer {
  width: 278px;
  margin: 90px auto 40px;

  .to-next-step-button {
    margin: 20px auto 0;
  }

  .error-message {
    color: #f06273;
    font-size: 12px;
    width: 100%;
    text-align: center;
  }
}

@media screen and (max-width: 550px) {
  .br {
    &:before {
      content: '\A';
      white-space: pre;
    }
  }

  .modal-footer {
    margin: 100px auto 50px;
  }
}

@media screen and (max-width: 320px) {
  .modal-footer {
    width: 250px;
  }
}
</style>
