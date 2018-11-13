<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper" @click.self="closeModal">
        <div class="modal-container" :style="{ maxWidth: `${maxWidth}px` }">
          <div class="modal-header">
            <div class="modal-header-content">
              <slot name="modal-header-content" />
            </div>
            <span class="modal-header-default-button" @click="closeModal" v-if="isShowCloseModalButton">
              ✕
            </span>
          </div>
          <div class="modal-body">
            <slot name="modal-title">
              <h2 class="title">
                {{title}}
              </h2>
            </slot>
          </div>
          <div class="modal-content">
            <slot v-if="showModalContentLately" name="modal-content" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    title: {
      type: String,
      required: false
    },
    showModalContent: {
      type: Boolean,
      default: true,
      required: false
    },
    isShowCloseModalButton: {
      type: Boolean,
      default: true,
      required: false
    },
    maxWidth: {
      type: Number,
      default: 800,
      required: false
    }
  },
  data() {
    return {
      showModalContentLately: true
    }
  },
  computed: {
    ...mapGetters('user', [
      'signUpAuthFlowModal',
      'showSignUpModal',
      'showSignUpAuthFlowModal',
      'showLoginModal',
      'showProfileSettingsModal',
      'showRestrictEditArticleModal',
      'requestLoginModal',
      'showTipModal',
      'requestPhoneNumberVerifyModal'
    ]),
    ...mapGetters('report', ['userReportModal', 'articleReportModal'])
  },
  methods: {
    async closeModal() {
      if (this.showSignUpModal) {
        this.setSignUpModal({ showSignUpModal: false })
        if (this.$route.path.startsWith('/signup')) {
          this.replaceUrlToTop()
        }
      }
      if (this.showSignUpAuthFlowModal) {
        this.setSignUpAuthFlowModal({ showSignUpAuthFlowModal: false })
        if (this.$route.path.startsWith('/signup-login')) {
          this.replaceUrlToTop()
        }
        if (this.signUpAuthFlowModal.isLoginModal || this.signUpAuthFlowModal.isInputUserIdModal) {
          await this.logout()
        }
      }
      if (this.showLoginModal) {
        this.setLoginModal({ showLoginModal: false })
        if (this.$route.path.startsWith('/login')) {
          this.replaceUrlToTop()
        }
      }
      if (this.showProfileSettingsModal) {
        if (document.querySelector('[class$=-article-list-container]')) {
          document.querySelector('[class$=-article-list-container]').style.overflowY = 'auto'
        }
        this.setProfileSettingsModal({ showProfileSettingsModal: false })
      }
      if (this.showRestrictEditArticleModal) {
        this.setRestrictEditArticleModal({ showRestrictEditArticleModal: false })
        this.$router.push('/me/articles/public')
      }
      if (this.requestLoginModal.isShow) {
        this.setRequestLoginModal({ isShow: false })
      }
      if (this.showTipModal) {
        this.setTipModal({ showTipModal: false })
        this.hideTipFlowModalContent()
      }
      if (this.requestPhoneNumberVerifyModal.isShow) {
        this.setRequestPhoneNumberVerifyModal({ isShow: false })
      }
      if (this.userReportModal.isShow) {
        this.setUserReportModal({ isShow: false })
        this.setUserReportSelectReasonModal({ isShow: false })
        this.setUserReportInputFreeTextModal({ isShow: false })
        this.setUserReportConfirmationModal({ isShow: false })
        this.resetUserReportData()
      }
      if (this.articleReportModal.isShow) {
        this.setArticleReportModal({ isShow: false })
        this.setArticleReportSelectReasonModal({ isShow: false })
        this.setArticleReportInputFreeTextModal({ isShow: false })
        this.setArticleReportConfirmationModal({ isShow: false })
        this.resetArticleReportData()
      }
      this.$emit('close')
      this.resetPassword()
      document.body.scrollTop = 0
      document.querySelector('html').style.overflow = ''
      document.querySelector('body').style.overflow = ''
    },
    replaceUrlToTop() {
      this.$router.replace('/')
    },
    ...mapActions('user', [
      'setSignUpModal',
      'setSignUpAuthFlowModal',
      'setLoginModal',
      'setProfileSettingsModal',
      'setRestrictEditArticleModal',
      'resetPassword',
      'logout',
      'setRequestLoginModal',
      'setTipModal',
      'hideTipFlowModalContent',
      'setRequestPhoneNumberVerifyModal'
    ]),
    ...mapActions('report', [
      'setUserReportModal',
      'setUserReportSelectReasonModal',
      'setUserReportInputFreeTextModal',
      'setUserReportConfirmationModal',
      'resetUserReportData',
      'setArticleReportModal',
      'setArticleReportSelectReasonModal',
      'setArticleReportInputFreeTextModal',
      'setArticleReportConfirmationModal',
      'resetArticleReportData'
    ])
  },
  watch: {
    showModalContent() {
      // For preventing display collapse when closing a modal
      if (this.showModalContent) {
        this.showModalContentLately = this.showModalContent
      } else {
        setTimeout(() => {
          this.showModalContentLately = this.showModalContent
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  &-mask {
    background-color: rgba(0, 0, 0, 0.8);
    bottom: 0;
    display: table;
    height: 100vh;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: opacity 0.3s ease;
    width: 100%;
    z-index: 9998;
  }

  &-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  &-container {
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    margin: 10px auto;
    max-width: 800px;
    padding: 20px 30px;
    transition: all 0.3s ease;
    width: 80%;
  }

  &-body {
    .title {
      color: #030303;
      font-size: 20px;
      font-weight: 100;
      letter-spacing: 5px;
      line-height: 24px;
      margin: 50px 20px 0;
      text-align: center;
    }
  }

  &-header {
    &-content {
      margin: -20px -30px 20px;
    }

    &-default-button {
      color: #6e6e6e;
      cursor: pointer;
      float: right;
      font-size: 26px;
    }
  }

  &-enter {
    opacity: 0;
  }

  &-leave-active {
    opacity: 0;
  }

  &-enter &-container,
  &-leave-active &-container {
    transform: scale(1.1);
  }
}

@media screen and (max-width: 550px) {
  .modal {
    &-wrapper {
      width: 100%;
      padding-bottom: 4000px;
    }

    &-container {
      height: 100%;
      margin-top: 0;
      max-width: 550px;
      width: calc(100% - 60px);
    }

    &-body {
      .title {
        margin: 60px 20px 0;
      }
    }
  }

  .cover-screen {
    .modal-container {
      height: 100vh;
    }
  }
}
</style>
