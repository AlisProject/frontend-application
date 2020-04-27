<template>
  <app-modal
    :title="title"
    :show-modal-content="showSignUpAuthFlowModal"
    :is-show-close-modal-button="isShowCloseModalButton"
  >
    <div slot="modal-content">
      <sign-up-auth-flow-login-modal-form v-if="isLoginModal" />
      <sign-up-auth-flow-input-phone-number-modal-form v-if="isInputPhoneNumberModal" />
      <sign-up-auth-flow-input-auth-code-modal-form v-if="isInputAuthCodeModal" />
      <sign-up-auth-flow-input-wallet-password-modal-form v-if="isInputWalletPasswordModal" />
      <profile-settings-modal-form v-if="isProfileSettingsModal" />
      <sign-up-auth-flow-input-user-id-form v-if="isInputUserIdModal" />
      <sign-up-auth-flow-completed-phone-number-auth-modal v-if="isCompletedPhoneNumberAuthModal" />
      <sign-up-auth-flow-not-completed-phone-number-auth-modal
        v-if="isNotCompletedPhoneNumberAuthModal"
      />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import SignUpAuthFlowLoginModalForm from '../molecules/SignUpAuthFlowLoginModalForm'
import SignUpAuthFlowInputPhoneNumberModalForm from '../molecules/SignUpAuthFlowInputPhoneNumberModalForm'
import SignUpAuthFlowInputAuthCodeModalForm from '../molecules/SignUpAuthFlowInputAuthCodeModalForm'
import SignUpAuthFlowInputWalletPasswordModalForm from '../molecules/SignUpAuthFlowInputWalletPasswordModalForm'
import ProfileSettingsModalForm from '../molecules/ProfileSettingsModalForm'
import SignUpAuthFlowInputUserIdForm from '../molecules/SignUpAuthFlowInputUserIdForm'
import SignUpAuthFlowCompletedPhoneNumberAuthModal from '../molecules/SignUpAuthFlowCompletedPhoneNumberAuthModal'
import SignUpAuthFlowNotCompletedPhoneNumberAuthModal from '../molecules/SignUpAuthFlowNotCompletedPhoneNumberAuthModal'

export default {
  components: {
    AppModal,
    SignUpAuthFlowLoginModalForm,
    SignUpAuthFlowInputPhoneNumberModalForm,
    SignUpAuthFlowInputAuthCodeModalForm,
    SignUpAuthFlowInputWalletPasswordModalForm,
    ProfileSettingsModalForm,
    SignUpAuthFlowInputUserIdForm,
    SignUpAuthFlowCompletedPhoneNumberAuthModal,
    SignUpAuthFlowNotCompletedPhoneNumberAuthModal
  },
  computed: {
    title() {
      if (this.isInputUserIdModal) {
        return 'SNS認証完了'
      } else if (this.isInputPhoneNumberModal || this.isInputAuthCodeModal) {
        return 'アカウント認証'
      } else if (this.isInputWalletPasswordModal) {
        return 'ウォレットパスワード設定'
      } else if (this.isProfileSettingsModal) {
        return 'プロフィール'
      } else if (this.isCompletedPhoneNumberAuthModal || this.isNotCompletedPhoneNumberAuthModal) {
        return ''
      } else {
        return '新規登録'
      }
    },
    isLoginModal() {
      return this.signUpAuthFlowModal.isLoginModal
    },
    isInputPhoneNumberModal() {
      return this.signUpAuthFlowModal.isInputPhoneNumberModal
    },
    isInputAuthCodeModal() {
      return this.signUpAuthFlowModal.isInputAuthCodeModal
    },
    isInputWalletPasswordModal() {
      return this.signUpAuthFlowModal.isInputWalletPasswordModal
    },
    isProfileSettingsModal() {
      return this.signUpAuthFlowModal.isProfileSettingsModal
    },
    isInputUserIdModal() {
      return this.signUpAuthFlowModal.isInputUserIdModal
    },
    isCompletedPhoneNumberAuthModal() {
      return this.signUpAuthFlowModal.isCompletedPhoneNumberAuthModal
    },
    isNotCompletedPhoneNumberAuthModal() {
      return this.signUpAuthFlowModal.isNotCompletedPhoneNumberAuthModal
    },
    isShowCloseModalButton() {
      return !this.isInputPhoneNumberModal
    },
    ...mapGetters('user', ['signUpAuthFlowModal', 'showSignUpAuthFlowModal'])
  }
}
</script>

<style lang="scss" scoped>
.modal-header-warning {
  background: #0086cc;
  color: #fff;
  font-size: 14px;
  line-height: 21px;
  padding: 20px;

  a {
    color: #fff;
  }
}

@media screen and (max-width: 550px) {
  .modal-header-warning {
    font-size: 12px;
    line-height: 16px;
  }
}
</style>
