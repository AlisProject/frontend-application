<template>
  <header class="area-app-header-container">
    <nuxt-link to="/" class="logo-link" @click.native="resetData">
      <img class="logo" src="~assets/images/pc/common/header_logo_original.svg" alt="logo">
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
    <request-wallet-password-modal v-if="requestWalletPasswordModal.isShow" />
    <user-report-modal v-if="userReportModal.isShow" />
    <article-report-modal v-if="articleReportModal.isShow" />
    <first-process-modal v-if="firstProcessModal.isShow" />
    <confirm-purchase-article-modal v-if="confirmPurchaseArticleModal.isShow" />
    <withdrawal-detail-modal v-if="withdrawalDetailModal.isShow" />
    <input-withdraw-auth-code-modal v-if="inputWithdrawAuthCodeModal.isShow" />
    <badge-description-modal v-if="badgeDescriptionModal.isShow" />
    <article-delete-modal v-if="articleDeleteModal.isShow" />
    <toast position="n" />
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Toast } from 'vuex-toast'

const HeaderSessionLinks = () => import('../atoms/HeaderSessionLinks')
const HeaderUserLoggedInItems = () => import('../atoms/HeaderUserLoggedInItems')
const SignUpModal = () => import('../organisms/SignUpModal')
const SignUpAuthFlowModal = () => import('../organisms/SignUpAuthFlowModal')
const LoginModal = () => import('../organisms/LoginModal')
const RestrictEditArticleModal = () => import('../organisms/RestrictEditArticleModal')
const ProfileSettingsModal = () => import('../organisms/ProfileSettingsModal')
const RequestLoginModal = () => import('../organisms/RequestLoginModal')
const TipModal = () => import('../organisms/TipModal')
const RequestPhoneNumberVerifyModal = () => import('../organisms/RequestPhoneNumberVerifyModal')
const RequestWalletPasswordModal = () => import('../organisms/RequestWalletPasswordModal')
const UserReportModal = () => import('../organisms/UserReportModal')
const ArticleReportModal = () => import('../organisms/ArticleReportModal')
const FirstProcessModal = () => import('../organisms/FirstProcessModal')
const ConfirmPurchaseArticleModal = () => import('../organisms/ConfirmPurchaseArticleModal')
const WithdrawalDetailModal = () => import('../organisms/WithdrawalDetailModal')
const InputWithdrawAuthCodeModal = () => import('../organisms/InputWithdrawAuthCodeModal')
const BadgeDescriptionModal = () => import('../organisms/BadgeDescriptionModal')
const ArticleDeleteModal = () => import('../organisms/ArticleDeleteModal')

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
    FirstProcessModal,
    ConfirmPurchaseArticleModal,
    WithdrawalDetailModal,
    InputWithdrawAuthCodeModal,
    BadgeDescriptionModal,
    RequestWalletPasswordModal,
    ArticleDeleteModal
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
      'requestWalletPasswordModal',
      'firstProcessModal',
      'confirmPurchaseArticleModal',
      'withdrawalDetailModal',
      'inputWithdrawAuthCodeModal'
    ]),
    ...mapGetters('report', ['userReportModal', 'articleReportModal']),
    ...mapGetters('badge', ['badgeDescriptionModal']),
    ...mapGetters('articleModals', ['articleDeleteModal'])
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
  left: 0px;
  position: absolute;

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
    width: 100%;
    max-width: calc(100% - 68px);
  }
}

@mixin spStyles() {
  .area-app-header-container {
    width: 100%;
    max-width: calc(100% - 24px);
    background: #fff;
  }

  .logo-link {
    left: 0;
    padding: 12px 0;
    position: absolute;

    .logo {
      width: 66.09px;
      height: 26px;
    }
  }

  .session-items {
    position: absolute;
    right: 0;
  }
}

@media screen and (max-width: 920px) and (min-width: 551px) {
  @include spStyles();
}

@media screen and (max-width: 550px) {
  @include spStyles();
}
</style>
