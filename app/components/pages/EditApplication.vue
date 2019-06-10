<template>
  <div class="edit-application-container">
    <app-header />
    <div class="area-application">
      <h1 class="title">
        アプリケーションを編集する
      </h1>
      <form class="signup-form" @keypress.enter.prevent="onSubmit">
        <div class="label" v-text="'Client ID'" />
        <div class="not-editable-input">
          {{ application.clientId }}
        </div>
        <template v-if="application.applicationType === 'WEB'">
          <div class="label" v-text="'Client Secret'" />
          <div class="not-editable-input">
            {{ application.clientSecret }}
          </div>
        </template>
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
        <div class="not-editable-input">
          {{ application.applicationType | showApplicationType }}
        </div>
        <div class="label">
          リダイレクトURI
        </div>
        <urls-input-form :initialUrls="urls" @handle-change-urls="handleChangeUrls" />
      </form>
      <app-button
        class="save-button"
        :disabled="invalidSubmit || isProcessingSave"
        @click="onSubmitSave"
      >
        保存する
      </app-button>
      <app-button
        type="secondary"
        class="delete-button"
        :disabled="isProcessingDelete"
        @click="onSubmitDelete"
      >
        削除する
      </app-button>
    </div>
    <app-footer />
  </div>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { mapGetters, mapActions } from 'vuex'
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
      clientName: '',
      description: '',
      formError: {
        clientName: false,
        description: false
      },
      isProcessingSave: false,
      isProcessingDelete: false,
      urls: []
    }
  },
  async mounted() {
    const { clientId } = this.$route.params
    await this.getMeApplication({ clientId })
    this.clientName = this.application.clientName
    this.description = this.application.description
    this.urls = this.application.redirectUris.map((url) => {
      return {
        text: url,
        tiClasses: ['ti-valid']
      }
    })
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
    },
    ...mapGetters('user', ['application'])
  },
  methods: {
    handleChangeUrls(urls) {
      this.urls = urls
    },
    async onSubmitSave() {
      try {
        if (this.invalidSubmit || this.isProcessingSave) return
        this.isProcessingSave = true
        const { clientId } = this.$route.params
        const { clientName: name, description, clientType: applicationType } = this
        const redirectUrls = this.urls.map((url) => url.text)
        await this.updateApplication({ clientId, name, description, applicationType, redirectUrls })
        this.sendNotification({ text: 'アプリケーションを更新しました' })
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
        this.isProcessingSave = false
      }
    },
    async onSubmitDelete() {
      const isOk = confirm('削除してもよろしいですか？')
      if (!isOk) return
      try {
        if (this.isProcessingDelete) return
        this.isProcessingDelete = true
        const { clientId } = this.$route.params
        await this.deleteApplication({ clientId })
        this.sendNotification({ text: 'アプリケーションを削除しました' })
        this.$router.push('/me/settings/applications')
      } catch (error) {
        console.error(error)
      } finally {
        this.isProcessingDelete = false
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
    ...mapActions('user', ['getMeApplication', 'updateApplication', 'deleteApplication'])
  },
  filters: {
    showApplicationType(type) {
      return type === 'WEB' ? 'サーバーサイドアプリ' : 'ネイティブアプリ'
    }
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
.edit-application-container {
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
  margin-bottom: 12px;
}

.not-editable-input {
  background-color: #f4f4f5;
  padding: 16px 12px;
  font-size: 14px;
  border-radius: 4px;
  margin-bottom: 40px;
  word-break: break-all;
}

.save-button {
  margin: 60px 0 0;
}

.delete-button {
  margin: 20px 0 60px;
}
</style>
