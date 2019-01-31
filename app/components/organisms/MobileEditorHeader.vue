<template>
  <header class="area-mobile-editor-header-container">
    <nuxt-link to="/" class="logo-link" @click.native="resetData">
      <img class="logo" src="~assets/images/pc/common/header_logo_original.png" alt="logo">
    </nuxt-link>
    <no-ssr>
      <div class="session-items">
        <header-session-links v-if="!loggedIn"/>
        <header-user-logged-in-items v-else />
      </div>
    </no-ssr>
    <sign-up-modal v-if="showSignUpModal"/>
    <sign-up-auth-flow-modal v-if="showSignUpAuthFlowModal"/>
    <login-modal v-if="showLoginModal"/>
    <profile-settings-modal v-if="showProfileSettingsModal"/>
    <restrict-edit-article-modal v-if="showRestrictEditArticleModal"/>
    <request-login-modal v-if="requestLoginModal.isShow"/>
    <tip-modal v-if="showTipModal"/>
    <request-phone-number-verify-modal v-if="requestPhoneNumberVerifyModal.isShow"/>
    <user-report-modal v-if="userReportModal.isShow"/>
    <article-report-modal v-if="articleReportModal.isShow"/>
    <first-process-modal v-if="firstProcessModal.isShow"/>
    <toast position="n"/>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Toast } from 'vuex-toast'
import HeaderSessionLinks from '../atoms/HeaderSessionLinks'
import HeaderUserLoggedInItems from '../atoms/HeaderUserLoggedInItems'
import SignUpModal from '../organisms/SignUpModal'
import SignUpAuthFlowModal from '../organisms/SignUpAuthFlowModal'
import LoginModal from '../organisms/LoginModal'
import RestrictEditArticleModal from '../organisms/RestrictEditArticleModal'
import ProfileSettingsModal from '../organisms/ProfileSettingsModal'
import RequestLoginModal from '../organisms/RequestLoginModal'
import TipModal from '../organisms/TipModal'
import RequestPhoneNumberVerifyModal from '../organisms/RequestPhoneNumberVerifyModal'
import UserReportModal from '../organisms/UserReportModal'
import ArticleReportModal from '../organisms/ArticleReportModal'
import FirstProcessModal from '../organisms/FirstProcessModal'
import { isIOS, isAndroid } from '~/utils/device'

export default {
  components: {
    HeaderSessionLinks,
    HeaderUserLoggedInItems,
    SignUpModal,
    SignUpAuthFlowModal,
    LoginModal,
    RestrictEditArticleModal,
    ProfileSettingsModal,
    RequestLoginModal,
    TipModal,
    Toast,
    RequestPhoneNumberVerifyModal,
    UserReportModal,
    ArticleReportModal,
    FirstProcessModal
  },
  data() {
    return {
      deviceType: 'pc'
    }
  },
  mounted() {
    if (isIOS()) {
      this.deviceType = 'ios'
    } else if (isAndroid()) {
      this.deviceType = 'android'
    }
  },
  computed: {
    ...mapGetters('user', [
      'loggedIn',
      'showSignUpModal',
      'showSignUpAuthFlowModal',
      'showLoginModal',
      'showProfileSettingsModal',
      'showRestrictEditArticleModal',
      'requestLoginModal',
      'showTipModal',
      'requestPhoneNumberVerifyModal',
      'firstProcessModal'
    ]),
    ...mapGetters('report', ['userReportModal', 'articleReportModal'])
  },
  methods: {
    resetData() {
      // 同一のページの場合は記事情報をリセットしない
      if (this.$route.fullPath === '/') return
      this.resetArticleData()
      this.setArticleListScrollHeight({ scroll: 0 })
    },
    ...mapActions('presentation', ['setArticleListScrollHeight']),
    ...mapActions('article', ['getPopularArticles', 'resetArticleData'])
  }
}
</script>

<style lang="scss" scoped>
.pc,
.ios,
.android {
  .area-mobile-editor-header-container {
    grid-area: mobile-editor-header;
    z-index: 2002;
    display: flex;
    align-items: center;
    position: relative;
    width: 1080px;
    margin: 0 auto;
  }

  .logo-link {
    margin: 0 auto;

    .logo {
      width: 102px;
      height: auto;
    }
  }

  .session-items {
    position: absolute;
    right: 0;
  }
}

@media screen and (max-width: 1080px) {
  .pc .area-mobile-editor-header-container {
    max-width: calc(100% - 68px);
  }
}

.ios .area-mobile-editor-header-container {
  position: absolute;
}

.android .area-mobile-editor-header-container {
  position: fixed;
}

.ios,
.android {
  .area-mobile-editor-header-container {
    max-width: 100%;
    background: #fff;
    top: 0;
    right: 0;
    left: 0;
    height: 56px;
    width: 100%;
  }

  .logo-link {
    left: 12px;
    padding: 12px 0;
    position: absolute;

    .logo {
      width: auto;
      height: 26px;
    }
  }

  .session-items {
    position: absolute;
    right: 0;
  }
}
</style>
