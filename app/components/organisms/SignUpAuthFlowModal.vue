<template>
  <app-modal :title="title" :showModalContent="showSignUpAuthFlowModal" :isShowCloseModalButton="isShowCloseModalButton">
    <div slot="modal-content">
      <sign-up-auth-flow-login-modal-form v-if="isLoginModal" />
      <sign-up-auth-flow-input-phone-number-modal-form v-if="isInputPhoneNumberModal" />
      <sign-up-auth-flow-input-auth-code-modal-form v-if="isInputAuthCodeModal" />
      <sign-up-auth-flow-completed-phone-number-auth-modal v-if="isCompletedPhoneNumberAuthModal" />
      <profile-settings-modal-form v-if="isProfileSettingsModal" />
      <sign-up-auth-flow-input-user-id-form v-if="isInputUserIdModal" />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import SignUpAuthFlowLoginModalForm from '../molecules/SignUpAuthFlowLoginModalForm'
import SignUpAuthFlowInputPhoneNumberModalForm from '../molecules/SignUpAuthFlowInputPhoneNumberModalForm'
import SignUpAuthFlowInputAuthCodeModalForm from '../molecules/SignUpAuthFlowInputAuthCodeModalForm'
import ProfileSettingsModalForm from '../molecules/ProfileSettingsModalForm'
import SignUpAuthFlowInputUserIdForm from '../molecules/SignUpAuthFlowInputUserIdForm'

export default {
  components: {
    AppModal,
    SignUpAuthFlowLoginModalForm,
    SignUpAuthFlowInputPhoneNumberModalForm,
    SignUpAuthFlowInputAuthCodeModalForm,
    ProfileSettingsModalForm,
    SignUpAuthFlowInputUserIdForm
  },
  computed: {
    title() {
      if (this.isInputUserIdModal) {
        return 'SNS認証完了'
      } else if (this.isInputPhoneNumberModal || this.isInputAuthCodeModal) {
        return 'アカウント認証'
      } else if (this.isProfileSettingsModal) {
        return 'プロフィール'
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
    isCompletedPhoneNumberAuthModal() {
      return this.signUpAuthFlowModal.isCompletedPhoneNumberAuthModal
    },
    isProfileSettingsModal() {
      return this.signUpAuthFlowModal.isProfileSettingsModal
    },
    isInputUserIdModal() {
      return this.signUpAuthFlowModal.isInputUserIdModal
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
  background: #858dda;
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
