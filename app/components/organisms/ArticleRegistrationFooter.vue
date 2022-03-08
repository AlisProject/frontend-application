<template>
  <div class="area-article-registration-footer" :class="{ 'is-show': isShow }">
    <div class="registration-footer">
      <img class="area-logo" src="~assets/images/pc/common/logo_white.svg" alt="logo">
      <div class="area-message">
        <div class="title">
          アカウント作成をおすすめします
        </div>
        <div class="detail">
          いいね、記事投稿でトークンを獲得できます
        </div>
      </div>
      <div class="area-button">
        <app-button class="registration-footer-close" @click="closeRegistrationFooter">
          今はしない
        </app-button>
        <app-button class="registration-footer-sign-up" @click="showSignUpModal">
          アカウント作成(無料)
        </app-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  },
  data() {
    return {
      isShow: false
    }
  },
  props: {
    tags: {
      type: Array,
      required: false,
      default: []
    },
    topic: {
      type: String,
      required: false
    }
  },
  mounted() {
    this.isShow = this.isShowRegistrationFooter()
    // google optimize
    window.dataLayer.push({
      event: 'optimize.activate',
      tags: this.tags,
      topic: this.topic
    })
  },
  methods: {
    closeRegistrationFooter() {
      // 一度閉じた場合は 24h 表示しない
      this.isShow = false
      const now = new Date()
      const item = {
        expire: now.getTime() + 86400000
      }
      localStorage.setItem('alis.to.article.closeRegistrationFooter', JSON.stringify(item))
    },
    isShowRegistrationFooter() {
      // SSR で実行された場合
      if (typeof localStorage === 'undefined') {
        return false
      }
      // localStorage に値が設定されていない場合
      const item = localStorage.getItem('alis.to.article.closeRegistrationFooter')
      if (!item) {
        return true
      }
      // 設定された時刻内かを確認
      const now = new Date()
      if (now.getTime() < JSON.parse(item).expire) {
        return false
      } else {
        localStorage.removeItem('alis.to.article.closeRegistrationFooter')
        return true
      }
    },
    showSignUpModal() {
      this.setSignUpModal({ showSignUpModal: true })
    },
    ...mapActions('user', ['setSignUpModal'])
  }
}
</script>

<style lang="scss" scoped>
.area-article-registration-footer {
  background-color: #0086cc;
  grid-area: article-registration-footer;
  max-width: 100%;
  width: 100%;
  position: fixed;
  bottom: 0;
  transition: 0.5s;
  transform: translateY(100%);
  z-index: 3;
  display: none;
  &.is-show {
    display: block;
  }
  .registration-footer {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 340px 290px;
    grid-gap: 10px;
    /* prettier-ignore */
    grid-template-areas:
      'message  button';
    width: 640px;
    margin: 12px auto 12px auto;
    align-items: center;
    justify-content: center;
    .area-logo {
      display: none;
      width: 40px;
    }
    .area-message {
      grid-area: message;
      color: #ffffff;
      .title {
        font-size: 18px;
        font-weight: bold;
      }
      .detail {
        margin-top: 5px;
        font-size: 14px;
      }
    }
    .area-button {
      grid-area: button;
      margin-left: auto;
      .registration-footer-close {
        display: inline-block;
        box-shadow: none;
        font-size: 14px;
        width: 105px;
        border: 1px solid;
        height: 34px;
        line-height: 34px;
        &:hover,
        &:focus {
          background: #0086cc;
        }
      }
      .registration-footer-sign-up {
        display: inline-block;
        box-shadow: none;
        font-size: 14px;
        font-weight: bold;
        height: 34px;
        line-height: 34px;
        width: 170px;
        background-color: #ffffff;
        color: #000000;
        margin-left: 10px;
        &:hover,
        &:focus {
          background: #ffffff;
        }
      }
    }
  }
}

@media screen and (max-width: 640px) {
  .area-article-registration-footer {
    .registration-footer {
      grid-template-rows: auto;
      grid-template-columns: 100%;
      width: calc(100% - 40px);
      /* prettier-ignore */
      grid-template-areas:
        'logo   '
        'message'
        'button ';
      margin: 15px 20px;
      align-items: left;
      justify-content: left;
      .area-logo {
        display: block;
        width: 50px;
      }
      .area-message {
        grid-area: message;
        color: #ffffff;
        margin-top: 15px;
        .title {
          font-size: 16px;
          font-weight: bold;
        }
        .detail {
          margin-top: 5px;
          font-size: 14px;
        }
      }
      .area-button {
        margin-left: 0;
        margin-top: 15px;
        height: 36px;
        .registration-footer-close {
          position: absolute;
          left: 20px;
        }
        .registration-footer-sign-up {
          position: absolute;
          right: 20px;
        }
      }
    }
  }
}
</style>
