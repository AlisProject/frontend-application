<template>
  <div>
    <div class="modal-body">
      <p class="announce">
        ALISへの登録が完了しました！
      </p>
      <p class="description">
        引き続き電話番号の登録が完了すると、自分で作成した記事へいいねをもらったり、誰かの記事にいいねを行うとALISトークンがゲットできます！
        ぜひたくさん使ってALISトークンをゲットしてください！
      </p>
      <img
        class="completed-auth-img"
        src="~/assets/images/pc/common/image_certification.jpg"
        alt="completed-auth-image">
    </div>
    <div class="modal-footer">
      <app-button class="to-next-step-button" @click="transitToNextStep">
        次へ
      </app-button>
      <button class="to-top-button" @click="transitToTop">
        TOPに戻る
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  },
  async mounted() {
    await this.getUserSession()
  },
  computed: {
    phoneNumberVerified() {
      return this.currentUser.phoneNumberVerified
    },
    ...mapGetters('user', ['currentUser'])
  },
  methods: {
    transitToNextStep() {
      this.setSignUpAuthFlowCompletedAuthModal({ isShow: false })
      if (this.phoneNumberVerified) {
        this.setSignUpAuthFlowProfileSettingsModal({
          isSignUpAuthFlowProfileSettingsModal: true
        })
      } else {
        this.setSignUpAuthFlowInputPhoneNumberModal({
          isSignUpAuthFlowInputPhoneNumberModal: true
        })
      }
    },
    transitToTop() {
      document.querySelector('html,body').style.overflow = ''
      this.setSignUpAuthFlowModal({
        showSignUpAuthFlowModal: false
      })
    },
    ...mapActions('user', [
      'setSignUpAuthFlowModal',
      'setSignUpAuthFlowCompletedAuthModal',
      'setSignUpAuthFlowProfileSettingsModal',
      'getUserSession',
      'setSignUpAuthFlowInputPhoneNumberModal'
    ])
  }
}
</script>

<style lang="scss" scoped>
.modal-body {
  margin: 0 auto;

  .announce {
    color: #030303;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 1.14px;
    line-height: 1.5px;
    margin: 60px 0 0;
    text-align: center;
  }

  .description {
    @include default-text();
    margin: 20px auto 0;
    max-width: 400px;
  }

  .completed-auth-img {
    width: 280px;
    margin: 24px auto 0;
    display: block;
  }
}

.modal-footer {
  width: 270px;
  margin: 40px auto 40px;

  .to-next-step-button {
    margin: 20px auto 0;
  }

  .to-top-button {
    background: #fff;
    border-radius: 18px;
    border: 1px solid #858dda;
    color: #858dda;
    cursor: pointer;
    display: block;
    font-size: 14px;
    margin: 20px auto 0;
    outline: none;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    width: 265px;

    &:focus {
      opacity: 0.8;
    }

    &:target {
      display: block;
    }
  }
}
</style>
