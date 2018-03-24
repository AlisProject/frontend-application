<template>
  <app-modal title="SIGN UP">
    <div slot="modal-content">
      <sign-up-auth-flow-login-modal-form v-if="isLoginModal" />
      <sign-up-auth-flow-input-phone-number-modal-form v-if="isInputPhoneNumberModal" />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import SignUpAuthFlowLoginModalForm from '../molecules/SignUpAuthFlowLoginModalForm'
import SignUpAuthFlowInputPhoneNumberModalForm from '../molecules/SignUpAuthFlowInputPhoneNumberModalForm'

export default {
  components: {
    AppModal,
    SignUpAuthFlowLoginModalForm,
    SignUpAuthFlowInputPhoneNumberModalForm
  },
  computed: {
    isLoginModal() {
      return this.signUpAuthFlowModal.isLoginModal
    },
    isInputPhoneNumberModal() {
      return this.signUpAuthFlowModal.isInputPhoneNumberModal
    },
    ...mapGetters('user', ['signUpAuthFlowModal'])
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
