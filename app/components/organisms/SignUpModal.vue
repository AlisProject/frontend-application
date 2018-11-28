<template>
  <app-modal
    :title="title"
    @close="resetStates"
    :showModalContent="showSignUpModal">
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
    title() {
      return this.sentMail ? '新規登録' : ''
    },
    beforeSendMail() {
      return !this.sentMail
    },
    ...mapGetters('user', ['sentMail', 'showSignUpModal'])
  },
  methods: {
    resetStates() {
      this.$v.signUpModal.$reset()
      this.hideSignUpErrors()
      setTimeout(() => {
        this.setSentMail({ sentMail: false })
      }, 1000)
    },
    ...mapActions('user', ['setSentMail', 'hideSignUpErrors'])
  },
  validations: {
    signUpModal: {}
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
