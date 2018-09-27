<template>
  <app-modal :title="title" :showModalContent="showSignUpAuthFlowModal">
    <div slot="modal-content">
      <sign-up-auth-flow-login-modal-form v-if="isLoginModal" />
      <sign-up-auth-flow-input-phone-number-modal-form v-if="isInputPhoneNumberModal" />
      <sign-up-auth-flow-input-auth-code-modal-form v-if="isInputAuthCodeModal" />
      <sign-up-auth-flow-completed-phone-number-auth-modal v-if="isCompletedPhoneNumberAuthModal" />
      <profile-settings-modal-form v-if="isProfileSettingsModal" />
      <sign-up-auth-flow-input-alias-user-id-form v-if="isInputAliasUserIdModal" />
      <sign-up-auth-flow-completed-auth-modal v-if="isCompletedAuthModal" />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import SignUpAuthFlowLoginModalForm from '../molecules/SignUpAuthFlowLoginModalForm'
import SignUpAuthFlowInputPhoneNumberModalForm from '../molecules/SignUpAuthFlowInputPhoneNumberModalForm'
import SignUpAuthFlowInputAuthCodeModalForm from '../molecules/SignUpAuthFlowInputAuthCodeModalForm'
import SignUpAuthFlowCompletedPhoneNumberAuthModal from '../molecules/SignUpAuthFlowCompletedPhoneNumberAuthModal'
import ProfileSettingsModalForm from '../molecules/ProfileSettingsModalForm'
import SignUpAuthFlowInputAliasUserIdForm from '../molecules/SignUpAuthFlowInputAliasUserIdForm'
import SignUpAuthFlowCompletedAuthModal from '../molecules/SignUpAuthFlowCompletedAuthModal'

export default {
  components: {
    AppModal,
    SignUpAuthFlowLoginModalForm,
    SignUpAuthFlowInputPhoneNumberModalForm,
    SignUpAuthFlowInputAuthCodeModalForm,
    SignUpAuthFlowCompletedPhoneNumberAuthModal,
    ProfileSettingsModalForm,
    SignUpAuthFlowInputAliasUserIdForm,
    SignUpAuthFlowCompletedAuthModal
  },
  computed: {
    title() {
      if (this.isCompletedPhoneNumberAuthModal) {
        return 'CONGRATULATIONS!!'
      } else if (this.isProfileSettingsModal) {
        return 'PROFILE'
      } else {
        return 'SIGN UP'
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
    isInputAliasUserIdModal() {
      return this.signUpAuthFlowModal.isInputAliasUserIdModal
    },
    isCompletedAuthModal() {
      return this.signUpAuthFlowModal.isCompletedAuthModal
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
