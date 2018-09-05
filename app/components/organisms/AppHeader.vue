<template>
  <header class="area-app-header-container">
    <nuxt-link to="/articles/popular?topic=crypto" class="area-logo" @click.native="resetData"/>
    <!-- <default-header-nav
      v-if="showDefaultHeaderNav"
      :showOnlyLogo="showOnlyLogo"
      :showOnlySessionLinks="showOnlySessionLinks"
      :showOnlySessionLinksOnPc="showOnlySessionLinksOnPc"/>
    <article-type-select-box
      v-if="showDefaultHeaderNav"
      :showOnlyLogo="showOnlyLogo"
      :showOnlySessionLinks="showOnlySessionLinks"
      :showOnlySessionLinksOnPc="showOnlySessionLinksOnPc"/>
    <no-ssr>
      <edit-header-nav
        v-if="showEditHeaderNav"
        :showPostArticleLink="showPostArticleLink"
        :showEditArticleLink="showEditArticleLink"/>
    </no-ssr> -->
    <template v-if="!showOnlyLogo">
      <no-ssr>
        <header-session-links v-if="!loggedIn"/>
        <header-user-logged-in-items v-else />
      </no-ssr>
    </template>
    <sign-up-modal v-show="showSignUpModal"/>
    <sign-up-auth-flow-modal v-show="showSignUpAuthFlowModal"/>
    <login-modal v-show="showLoginModal"/>
    <report-modal v-if="showReportModal"/>
    <profile-settings-modal v-if="showProfileSettingsModal"/>
    <restrict-edit-article-modal v-if="showRestrictEditArticleModal"/>
    <request-login-modal v-if="requestLoginModal.isShow"/>
    <toast position="n"/>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Toast } from 'vuex-toast'
import EditHeaderNav from '../molecules/EditHeaderNav'
import HeaderSessionLinks from '../atoms/HeaderSessionLinks'
import HeaderUserLoggedInItems from '../atoms/HeaderUserLoggedInItems'
import SignUpModal from '../organisms/SignUpModal'
import SignUpAuthFlowModal from '../organisms/SignUpAuthFlowModal'
import LoginModal from '../organisms/LoginModal'
import ReportModal from '../organisms/ReportModal'
import RestrictEditArticleModal from '../organisms/RestrictEditArticleModal'
import ProfileSettingsModal from '../organisms/ProfileSettingsModal'
import RequestLoginModal from '../organisms/RequestLoginModal'

export default {
  props: {
    showDefaultHeaderNav: {
      type: Boolean,
      default: false
    },
    showEditHeaderNav: {
      type: Boolean,
      default: false
    },
    showOnlyLogo: {
      type: Boolean,
      default: false
    },
    showOnlySessionLinks: {
      type: Boolean,
      default: false
    },
    showPostArticleLink: {
      type: Boolean,
      default: false
    },
    showEditArticleLink: {
      type: Boolean,
      default: false
    },
    showOnlySessionLinksOnPc: {
      type: Boolean,
      default: false
    }
  },
  components: {
    EditHeaderNav,
    HeaderSessionLinks,
    HeaderUserLoggedInItems,
    SignUpModal,
    SignUpAuthFlowModal,
    LoginModal,
    ReportModal,
    RestrictEditArticleModal,
    ProfileSettingsModal,
    RequestLoginModal,
    Toast
  },
  computed: {
    ...mapGetters('user', [
      'loggedIn',
      'showSignUpModal',
      'showSignUpAuthFlowModal',
      'showLoginModal',
      'showReportModal',
      'showProfileSettingsModal',
      'showRestrictEditArticleModal',
      'requestLoginModal'
    ])
  },
  methods: {
    resetData() {
      // 同一のページの場合は記事情報をリセットしない
      if (this.$route.fullPath === '/articles/popular?topic=crypto') return
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
  display: grid;
  grid-area: app-header;
  grid-template-rows: 100px;
  max-width: 1080px;
  grid-template-columns: 150px 1fr auto;
  /* prettier-ignore */
  grid-template-areas:
    "logo ... session";
  z-index: 2;
  padding-left: calc(50vw - 540px);
}

.area-logo {
  grid-area: logo;
  background: url('~assets/images/pc/common/header_logo_original.png') no-repeat;
  background-position: center;
  background-size: 150px 40px;
}

@media screen and (max-width: 1080px) {
  .area-app-header-container {
    max-width: calc(100% - 68px);
    padding-left: 34px;
  }
}

@media screen and (max-width: 920px) and (min-width: 551px) {
  .article-container {
    .area-app-header-container {
      max-width: 100%;
      background: white;
      grid-template-columns: 94px 1fr auto;
      grid-template-rows: 66px;
      padding: 0 22px 0 18px;
    }

    .area-logo {
      background-size: 94px 25px;
    }
  }
}

@media screen and (max-width: 550px) {
  .area-app-header-container {
    max-width: 100%;
    background: white;
    grid-template-columns: 94px 1fr auto;
    grid-template-rows: 66px;
    padding: 0 22px 0 18px;
  }

  .area-logo {
    background-size: 94px 25px;
  }
}
</style>
