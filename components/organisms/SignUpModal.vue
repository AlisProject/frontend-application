<template>
  <app-modal title="SIGN UP" @close="resetStates">
    <div slot="modal-content">
      <sign-up-modal-form v-if="beforeSendMail" />
      <sign-up-modal-sent-mail v-else />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppModal from '../atoms/AppModal'
import SignUpModalForm from '../molecules/SignUpModalForm'
import SignUpModalSentMail from '../molecules/SignUpModalSentMail'

export default {
  components: {
    AppModal,
    SignUpModalForm,
    SignUpModalSentMail
  },
  computed: {
    beforeSendMail() {
      return !this.sentMail
    },
    ...mapGetters('user', ['sentMail'])
  },
  methods: {
    resetStates() {
      this.$v.signUp.$reset()
      this.hideSignUpErrors()
      setTimeout(() => {
        this.setSentMail({ sentMail: false })
      }, 1000)
    },
    ...mapActions('user', ['setSentMail', 'hideSignUpErrors'])
  },
  validations: {
    signUp: {}
  }
}
</script>
