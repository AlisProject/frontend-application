<template>
  <app-modal title="" :show-modal-content="showLoginModal" :max-width="1034" @close="resetStates">
    <div slot="modal-content">
      <login-modal-form />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppModal from '../atoms/AppModal'
import LoginModalForm from '../molecules/LoginModalForm'

export default {
  components: {
    AppModal,
    LoginModalForm
  },
  computed: {
    ...mapGetters('user', ['sentMail', 'showLoginModal'])
  },
  methods: {
    resetStates() {
      this.$v.loginModal.$reset()
      this.hideLoginErrors()
    },
    ...mapActions('user', ['setSentMail', 'hideLoginErrors'])
  },
  validations: {
    loginModal: {}
  }
}
</script>
