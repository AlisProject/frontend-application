<template>
  <app-modal title="SIGN UP" @close="resetStates">
    <div slot="modal-header-content" v-if="beforeSendMail">
      <div class="modal-header-warning">
        現在、新規の登録はβ版登録ユーザーのみに限らせていただいています。
        登録希望の方は
        <a href="http://eepurl.com/drM0Jr" target="_blank" rel="noopener noreferrer nofollow">ウェイティングリスト</a>
        にご登録ください。
      </div>
    </div>
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
