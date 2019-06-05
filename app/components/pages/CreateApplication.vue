<template>
  <div class="create-application-container">
    <app-header />
    <div class="area-application">
      <h1 class="title">
        アプリケーションを登録する
      </h1>
      <form class="signup-form" @keypress.enter.prevent>
        <div class="signup-form-group" :class="{ error: hasClientName }">
          <label class="signup-form-label">クライアント名</label>
          <input
            v-model="clientName"
            class="signup-form-input"
            type="text"
            placeholder=""
            @blur="showError('clientName')"
            @focus="resetError('clientName')"
          >
          <p v-if="showErrorClientNameMaxLength" class="error-message">
            クライアント名は80文字以内で入力してください
          </p>
        </div>
        <div class="signup-form-group" :class="{ error: hasDescription }">
          <label class="signup-form-label">クライアントの説明※任意</label>
          <input
            v-model="description"
            class="signup-form-input"
            type="text"
            placeholder=""
            @blur="showError('description')"
            @focus="resetError('description')"
          >
          <p v-if="showErrorDescriptionMaxLength" class="error-message">
            クライアントの説明は180文字以内で入力してください
          </p>
        </div>
        <div class="label">
          クライアントタイプ
        </div>
        <div class="select-client-box">
          <div class="client-input-box">
            <input id="WEB" v-model="clientType" class="client-input" type="radio" value="WEB">
            <label class="client-input-label" for="WEB">
              サーバーサイドアプリ
            </label>
          </div>
          <div class="client-input-box">
            <input
              id="NATIVE"
              v-model="clientType"
              class="client-input"
              type="radio"
              value="NATIVE"
            >
            <label class="client-input-label" for="NATIVE">
              ネイティブアプリ
            </label>
          </div>
        </div>
        <div class="label">
          リダイレクトURI
        </div>
        <urls-input-form :initialUrls="urls" @handle-change-urls="handleChangeUrls" />
      </form>
      <app-button class="save-button" :disabled="invalidSubmit || isProcessing" @click="onSubmit">
        保存する
      </app-button>
    </div>
    <app-footer />
  </div>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { mapActions } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import UrlsInputForm from '../organisms/UrlsInputForm'
import AppButton from '../atoms/AppButton'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    UrlsInputForm,
    AppButton,
    AppFooter
  },
  data() {
    return {
      clientType: 'WEB',
      clientName: '',
      description: '',
      formError: {
        clientName: false,
        description: false
      },
      isProcessing: false,
      errorMessage: '',
      urls: []
    }
  },
  computed: {
    showErrorClientNameMaxLength() {
      return this.formError.clientName && !this.$v.clientName.maxLength
    },
    showErrorDescriptionMaxLength() {
      return this.formError.description && !this.$v.description.maxLength
    },
    invalidSubmit() {
      return this.$v.$invalid || this.urls.length === 0
    },
    hasClientName() {
      return this.formError.clientName && this.$v.clientName.$error
    },
    hasDescription() {
      return this.formError.description && this.$v.description.$error
    }
  },
  methods: {
    handleChangeUrls(urls) {
      this.urls = urls
    },
    async onSubmit() {
      try {
        if (this.invalidSubmit || this.isProcessing) return
        this.isProcessing = true
        const { clientName: name, description, clientType: applicationType } = this
        const redirectUrls = this.urls.map((url) => url.text)
        await this.postApplication({ name, description, applicationType, redirectUrls })
        this.sendNotification({ text: 'アプリケーションを保存しました' })
        this.$router.push('/me/settings/applications')
      } catch (error) {
        const statusCode = error.response.status
        if (statusCode >= 400 && statusCode < 500) {
          this.sendNotification({
            text: '登録に失敗しました。入力内容をご確認ください',
            type: 'warning'
          })
        } else if (statusCode <= 500) {
          this.sendNotification({
            text: 'エラーが発生しました。しばらく時間を置いて再度お試しください',
            type: 'warning'
          })
        }
      } finally {
        this.isProcessing = false
      }
    },
    showError(type) {
      this.$v[type].$touch()
      this.formError[type] = true
    },
    resetError(type) {
      this.$v[type].$reset()
      this.formError[type] = false
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('user', ['postApplication'])
  },
  validations: {
    clientName: {
      required,
      maxLength: maxLength(80)
    },
    description: {
      maxLength: maxLength(180)
    }
  }
}
</script>

<style lang="scss" scoped>
.create-application-container {
  display: grid;
  grid-row-gap: 20px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header app-header  app-header"
    "...        application ...       "
    "app-footer app-footer  app-footer";
  grid-template-columns: 1fr 400px 1fr;
  grid-template-rows: 100px auto 75px;
  min-height: 100vh;
}

.area-application {
  grid-area: application;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  color: #030303;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 5px;
  text-align: center;
}

.signup-form {
  margin: 60px auto 0;
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
    box-shadow: 0 0 8px 0 rgba(192, 192, 192, 0.5);
    border: none;
    border-radius: 0;
    box-sizing: border-box;
    margin-bottom: 40px;
    padding: 12px;
    width: 100%;

    &::-webkit-input-placeholder {
      padding: 3px;
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
        box-shadow: 0 0 8px 0 rgba(240, 98, 115, 0.5);
      }
    }
  }
}

.label {
  color: #030303;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.8px;
  margin-bottom: 16px;
}

.select-client-box {
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;

  .client-input-box {
    color: #030303;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 14px;
    min-height: 20px;

    .client-input {
      opacity: 0;
      position: absolute;

      & + .client-input-label {
        cursor: pointer;
        padding: 0 20px 0 30px;
        position: relative;
        line-height: 20px;
        display: block;
        width: 140px;

        &::before {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          box-sizing: border-box;
          box-shadow: 0 0 8px 0 rgba(192, 192, 192, 0.7);
        }
      }

      &:checked + .client-input-label {
        &::before {
          box-shadow: 0 0 8px 0 rgba(0, 134, 204, 0.7);
        }

        &::after {
          content: '';
          display: block;
          position: absolute;
          top: 4px;
          left: 4px;
          width: 12px;
          height: 12px;
          background: #0086cc;
          border-radius: 50%;
        }
      }
    }
  }
}

.save-button {
  margin: 60px 0;
}
</style>
