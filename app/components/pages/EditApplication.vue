<template>
  <div class="edit-application-container">
    <app-header />
    <div class="area-application">
      <h1 class="title">
        アプリケーションを編集する
      </h1>
      <form class="signup-form" @keypress.enter.prevent="onSubmit">
        <div class="label">
          Client ID
        </div>
        <div class="not-editable-input">
          {{ application.clientId }}
        </div>
        <template v-if="application.clientSecret">
          <div class="label">
            Client Secret
          </div>
          <div class="not-editable-input">
            {{ application.clientSecret }}
          </div>
        </template>
        <div class="signup-form-group" :class="{ error: false }">
          <label class="signup-form-label">クライアント名</label>
          <input class="signup-form-input" type="text" placeholder="">
          <p class="error-message" />
        </div>
        <div class="signup-form-group" :class="{ error: false }">
          <label class="signup-form-label">クライアントの説明※任意</label>
          <input class="signup-form-input" type="text" placeholder="">
          <p class="error-message" />
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
        <div class="tags-input-form">
          <no-ssr>
            <vue-tags-input
              v-model="url"
              :tags="urls"
              :max-tags="5"
              placeholder=""
              :autocomplete-always-open="true"
              :separators="['　']"
            />
          </no-ssr>
        </div>
      </form>
      <app-button class="save-button">
        保存する
      </app-button>
      <app-button type="secondary" class="delete-button">
        削除する
      </app-button>
    </div>
    <app-footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import AppButton from '../atoms/AppButton'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    AppButton,
    AppFooter
  },
  computed: {
    ...mapGetters('user', ['application'])
  },
  filters: {
    showApplicationType(type) {
      return type === 'WEB' ? 'サーバーサイドアプリ' : 'ネイティブアプリ'
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
}

.save-button {
  margin: 60px 0 0;
}

.delete-button {
  margin: 20px 0 60px;
}
</style>

<style lang="scss">
.tags-input-form {
  .vue-tags-input {
    box-shadow: 0 0 8px 0 rgba(192, 192, 192, 0.5);

    .ti-input {
      border: none;
    }

    &.invalid-tag .ti-new-tag-input-wrapper input {
      color: #f06273;
    }

    &.hide-autocomplete-items .ti-autocomplete {
      display: none;
    }

    .ti-autocomplete {
      border: none;
    }
  }

  .ti-tags {
    .ti-new-tag-input-wrapper {
      font-size: 12px;
      margin: 4px;

      input {
        &::-webkit-input-placeholder {
          color: #cecece;
        }

        &::-moz-placeholder {
          color: #cecece;
        }
      }
    }

    .ti-tag {
      border-radius: 4px;
      font-size: 12px;
      margin: 4px;
      padding: 6px 5px 6px 8px;
      word-break: break-word;

      .ti-content {
        color: #030303;
      }

      &.ti-valid {
        background-color: #f0f0f0;
      }

      &.ti-tag.ti-deletion-mark {
        background-color: #e0e0e0;
      }

      .ti-icon-close {
        color: #030303;
      }
    }
  }
}
</style>
