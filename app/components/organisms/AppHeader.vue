<template>
  <header class="area-app-header-container">
    <nuxt-link to="/" class="logo-link" @click.native="resetData">
      <img class="logo" src="~assets/images/pc/common/header_logo_original.png" alt="logo">
    </nuxt-link>
    <no-ssr>
      <div class="session-items">
        <header-session-links v-if="!loggedIn" />
        <header-user-logged-in-items v-else />
      </div>
    </no-ssr>
    <sign-up-modal v-if="showSignUpModal" />
    <sign-up-auth-flow-modal v-if="showSignUpAuthFlowModal" />
    <login-modal v-if="showLoginModal" />
    <profile-settings-modal v-if="showProfileSettingsModal" />
    <restrict-edit-article-modal v-if="showRestrictEditArticleModal" />
    <request-login-modal v-if="requestLoginModal.isShow" />
    <tip-modal v-if="showTipModal" />
    <request-phone-number-verify-modal v-if="requestPhoneNumberVerifyModal.isShow" />
    <user-report-modal v-if="userReportModal.isShow" />
    <article-report-modal v-if="articleReportModal.isShow" />
    <first-process-modal v-if="firstProcessModal.isShow" />
    <confirm-purchase-article-modal v-if="confirmPurchaseArticleModal.isShow" />
    <withdrawal-detail-modal v-if="withdrawalDetailModal.isShow" />
    <toast position="n" />
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Toast } from 'vuex-toast'

export default {
  components: {
    HeaderSessionLinks: () => import('../atoms/HeaderSessionLinks'),
    HeaderUserLoggedInItems: () => import('../atoms/HeaderUserLoggedInItems'),
    SignUpModal: () => import('../organisms/SignUpModal'),
    SignUpAuthFlowModal: () => import('../organisms/SignUpAuthFlowModal'),
    LoginModal: () => import('../organisms/LoginModal'),
    RestrictEditArticleModal: () => import('../organisms/RestrictEditArticleModal'),
    ProfileSettingsModal: () => import('../organisms/ProfileSettingsModal'),
    RequestLoginModal: () => import('../organisms/RequestLoginModal'),
    TipModal: () => import('../organisms/TipModal'),
    RequestPhoneNumberVerifyModal: () => import('../organisms/RequestPhoneNumberVerifyModal'),
    UserReportModal: () => import('../organisms/UserReportModal'),
    ArticleReportModal: () => import('../organisms/ArticleReportModal'),
    FirstProcessModal: () => import('../organisms/FirstProcessModal'),
    ConfirmPurchaseArticleModal: () => import('../organisms/ConfirmPurchaseArticleModal'),
    WithdrawalDetailModal: () => import('../organisms/WithdrawalDetailModal'),
    Toast
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
      'firstProcessModal',
      'confirmPurchaseArticleModal',
      'withdrawalDetailModal'
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
.area-app-header-container {
  grid-area: app-header;
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

@media screen and (max-width: 1080px) {
  .area-app-header-container {
    max-width: calc(100% - 68px);
  }
}

@mixin spStyles() {
  .area-app-header-container {
    max-width: calc(100% - 24px);
    background: #fff;
  }

  .logo-link {
    left: 0;
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

@media screen and (max-width: 920px) and (min-width: 551px) {
  .article-container {
    @include spStyles();
  }
}

@media screen and (max-width: 550px) {
  @include spStyles();
}
</style>
