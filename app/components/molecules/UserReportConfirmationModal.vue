<template>
  <div class="modal-body">
    <div class="report-modal-content">
      <p class="confirm-text">
        本当に報告しますか？
      </p>
      <app-button class="report-button" @click="report">
        報告する
      </app-button>
      <app-button class="close-button" type="secondary" @click="closeModal">
        閉じる
      </app-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  },
  computed: {
    ...mapGetters('report', ['userReportModal'])
  },
  methods: {
    async report() {
      try {
        const { userId } = this.$route.params
        const { reason } = this.userReportModal.selectReason.formData
        const { originURL, freeText } = this.userReportModal.inputFreeText.formData
        await this.postUserFraud({ userId, reason, originURL, freeText })
        this.sendNotification({ text: 'ユーザーを報告しました' })
      } catch (error) {
        let text = 'エラーが発生しました。しばらく時間を置いて再度お試しください'
        if (error.response.data.message === 'Already exists') {
          text = 'すでに報告済みです'
        }
        this.sendNotification({ text, type: 'warning' })
      }
      this.setUserReportConfirmationModal({ isShow: false })
      this.setUserReportModal({ isShow: false })
      this.resetUserReportData()
    },
    closeModal() {
      this.setUserReportConfirmationModal({ isShow: false })
      this.setUserReportModal({ isShow: false })
      this.resetUserReportData()
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('report', [
      'setUserReportModal',
      'postUserFraud',
      'setUserReportConfirmationModal',
      'resetUserReportData'
    ])
  }
}
</script>

<style lang="scss" scoped>
.confirm-text {
  color: #030303;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  text-align: center;
  padding: 50px 0 0;
  display: block;
}

.report-button {
  margin: 60px auto 0;
}

.close-button {
  margin: 20px auto 100px;
}

@media screen and (max-width: 550px) {
  .confirm-text {
    padding: 20vh 0 0;
  }

  .close-button {
    margin: 20px auto 30vh;
  }
}
</style>
