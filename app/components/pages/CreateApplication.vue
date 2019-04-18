<template>
  <div class="create-application-container">
    <app-header />
    <div class="area-application">
      <h1 class="title">
        アプリケーションを登録する
      </h1>
      <form class="signup-form" @keypress.enter.prevent="onSubmit">
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
        <div class="select-client-box">
          <div class="client-input-box">
            <input
              id="serverside"
              v-model="clientType"
              class="client-input"
              type="radio"
              value="serverside"
            >
            <label class="client-input-label" for="serverside">
              サーバーサイドアプリ
            </label>
          </div>
          <div class="client-input-box">
            <input
              id="native"
              v-model="clientType"
              class="client-input"
              type="radio"
              value="native"
            >
            <label class="client-input-label" for="native">
              ネイティブアプリ
            </label>
          </div>
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
    </div>
    <app-footer />
  </div>
</template>

<script>
import AppHeader from '../organisms/AppHeader'
import AppButton from '../atoms/AppButton'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    AppButton,
    AppFooter
  },
  data() {
    return {
      clientType: 'serverside',
      url: '',
      urls: []
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
