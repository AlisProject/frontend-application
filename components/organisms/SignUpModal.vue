<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper" @click.self="closeModalAndResetStates">
        <div class="modal-container">
          <div class="modal-header">
            <span class="modal-header-default-button" @click="closeModalAndResetStates">
              ✕
            </span>
          </div>
          <div class="modal-body">
            <h2 class="title">
              SIGN UP
            </h2>
          </div>
          <sign-up-modal-form v-if="beforeSendMail" />
          <sign-up-modal-sent-mail v-else />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SignUpModalForm from '../molecules/SignUpModalForm'
import SignUpModalSentMail from '../molecules/SignUpModalSentMail'

export default {
  components: {
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
    closeModalAndResetStates() {
      this.$v.signUp.$reset()
      this.hideSignUpErrors()
      this.setSignUpModal({ showSignUpModal: false })
      setTimeout(() => {
        this.setSentMail({ sentMail: false })
      }, 1000)
    },
    ...mapActions('user', ['setSignUpModal', 'setSentMail', 'hideSignUpErrors'])
  },
  validations: {
    signUp: {}
  }
}
</script>

<style lang="scss" scoped>
.modal {
  &-mask {
    background-color: rgba(0, 0, 0, 0.8);
    display: table;
    height: 100%;
    left: 0;
    position: fixed;
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
      font-family: Times;
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 0.2em;
      line-height: 24px;
      margin: 50px 20px 0;
      text-align: center;
    }
  }

  &-header {
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
</style>
