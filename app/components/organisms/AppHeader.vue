<template>
  <header class="area-app-header-container">
    <nuxt-link to="/articles/popular?topic=crypto" class="area-logo" @click.native="resetData"/>
    <default-header-nav
      v-if="showDefaultHeaderNav"
      :showOnlyLogo="showOnlyLogo"
      :showOnlySessionLinks="showOnlySessionLinks"
      :showOnlySessionLinksOnPc="showOnlySessionLinksOnPc"/>
    <article-type-select-box
      class="hide-on-pc"
      v-if="showDefaultHeaderNav"
      :showOnlyLogo="showOnlyLogo"
      :showOnlySessionLinks="showOnlySessionLinks"
      :showOnlySessionLinksOnPc="showOnlySessionLinksOnPc"/>
    <no-ssr>
      <edit-header-nav
        v-if="showEditHeaderNav"
        :showPostArticleLink="showPostArticleLink"
        :showEditArticleLink="showEditArticleLink"/>
    </no-ssr>
    <template v-if="!showOnlyLogo">
      <no-ssr>
        <header-session-links v-if="!loggedIn"/>
        <header-user-logged-in-items v-else />
      </no-ssr>
    </template>
    <sign-up-modal v-show="this.showSignUpModal"/>
    <sign-up-auth-flow-modal v-show="this.showSignUpAuthFlowModal"/>
    <login-modal v-show="this.showLoginModal"/>
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
import DefaultHeaderNav from '../molecules/DefaultHeaderNav'
import ArticleTypeSelectBox from '../molecules/ArticleTypeSelectBox'
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
    DefaultHeaderNav,
    EditHeaderNav,
    HeaderSessionLinks,
    ArticleTypeSelectBox,
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
  grid-template-columns: 170px 1fr 78px 190px;
  /* prettier-ignore */
  grid-template-areas:
    "logo nav article-type-select-box ...";
  position: relative;
  z-index: 2;
}

.area-logo {
  grid-area: logo;
  background: url('~assets/images/pc/common/header_logo_original.png') no-repeat;
  background-position: center;
  background-size: 94px 25px;
}

@media screen and (max-width: 920px) and (min-width: 551px) {
  .article-container {
    .area-app-header-container {
      background: white;
      grid-gap: 16px;
      /* prettier-ignore */
      grid-template-areas:
        '... ...  ... ...     ...'
        '... logo ... session ...'
        '... ...  ... ...     ...';
      grid-template-columns: 3px 94px 1fr 145px 3px;
      grid-template-rows: 6px 26px 20px;
    }
  }
}

@media screen and (max-width: 550px) {
  .area-app-header-container {
    background: white;
    grid-gap: 16px;
    /* prettier-ignore */
    grid-template-areas:
      '... ...  ... ...     ...                     ...'
      '... logo ... session session                 ...'
      '... nav  nav nav     article-type-select-box ...';
    grid-template-columns: 3px 94px 1fr 60px 61px 3px;
    grid-template-rows: 6px 26px 20px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.15);

    &.without-shadow {
      box-shadow: none;
    }
  }

  .area-logo {
    margin: 0;
  }
}
</style>
