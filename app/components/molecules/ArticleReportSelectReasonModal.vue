<template>
  <div>
    <div class="modal-body">
      <div class="select-reason-box">
        <div class="reason-input-box" v-for="reportReason in orderedReportReasons">
          <input
            class="reason-input"
            type="radio"
            :id="reportReason.reason"
            :value="reportReason.reason"
            :checked="articleReportModal.selectReason.formData.reason === reportReason.reason"
            @change="setReason(reportReason.reason)">
            <label class="reason-input-label" :for="reportReason.reason">
              {{ reportReason.reasonName }}
            </label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <app-button class="to-next-step-button" :disabled="invalidSubmit" @click="onSubmit">
        次へ
      </app-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import AppButton from '../atoms/AppButton'

export default {
  data() {
    return {
      errorMessage: '',
      reportReasons: [
        {
          order: 1,
          reasonName: '公序良俗に反する(ポルノ・暴力など)',
          reason: 'anything_contrary_to_public_order'
        },
        {
          order: 2,
          reasonName: '迷惑行為(スパム)',
          reason: 'nuisance'
        },
        {
          order: 3,
          reasonName: '著作権違反・盗作',
          reason: 'copyright_violation'
        },
        {
          order: 4,
          reasonName: '誹謗中傷',
          reason: 'slander'
        },
        {
          order: 5,
          reasonName: 'トークンの不正獲得',
          reason: 'illegal_token_usage'
        },
        {
          order: 6,
          reasonName: '違法行為',
          reason: 'illegal_act'
        },
        {
          order: 7,
          reasonName: 'その他',
          reason: 'other'
        }
      ]
    }
  },
  components: {
    AppButton
  },
  computed: {
    orderedReportReasons() {
      return this.reportReasons.sort((a, b) => a.order > b.order)
    },
    invalidSubmit() {
      return this.$v.articleReportModal.selectReason.formData.$invalid
    },
    hasReasonError() {
      return (
        this.articleReportModal.selectReason.formError.reason &&
        this.$v.articleReportModal.selectReason.formData.reason.$error
      )
    },
    ...mapGetters('report', ['articleReportModal'])
  },
  validations: {
    articleReportModal: {
      selectReason: {
        formData: {
          reason: {
            required
          }
        }
      }
    }
  },
  methods: {
    setReason(value) {
      this.setArticleReportSelectReasonReason({ reason: value })
      document.querySelector('.modal-container').scrollTo({
        top: document.querySelector('.modal-container').clientHeight,
        behavior: 'smooth'
      })
    },
    showError(type) {
      this.$v.requestPhoneNumberVerifyModal.inputAuthCode.formData[type].$touch()
      this.showRequestPhoneNumberVerifyInputAuthCodeError({ type })
    },
    resetError(type) {
      this.$v.requestPhoneNumberVerifyModal.inputAuthCode.formData[type].$reset()
      this.hideRequestPhoneNumberVerifyInputAuthCodeError({ type })
    },
    async onSubmit() {
      if (this.invalidSubmit) return
      this.setArticleReportSelectReasonModal({ isShow: false })
      this.setArticleReportInputFreeTextModal({ isShow: true })
    },
    ...mapActions('report', [
      'setArticleReportSelectReasonReason',
      'showArticleReportSelectReasonError',
      'hideArticleReportSelectReasonError',
      'setArticleReportSelectReasonModal',
      'setArticleReportInputFreeTextModal'
    ])
  }
}
</script>

<style lang="scss" scoped>
.modal-body {
  margin: 0 auto;

  .select-reason-box {
    margin: 60px auto 0;
    max-width: 280px;
    width: 80%;
  }

  .reason-input-box {
    color: #030303;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 30px;
    min-height: 20px;

    .reason-input {
      opacity: 0;
      position: absolute;

      & + .reason-input-label {
        cursor: pointer;
        padding-left: 30px;
        position: relative;
        min-height: 20px;
        line-height: 20px;
        display: block;

        &::before {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 20px;
          height: 20px;
          border: 1px solid #0086cc;
          border-radius: 50%;
          box-sizing: border-box;
        }
      }

      &:checked + .reason-input-label {
        &::after {
          content: '';
          display: block;
          position: absolute;
          top: 4px;
          left: 4px;
          width: 12px;
          height: 12px;
          background: #0086cc;
          border-radius: 50%;
        }
      }
    }
  }
}

.modal-footer {
  width: 270px;
  margin: 70px auto 40px;

  .to-next-step-button {
    margin: 20px auto 0;
  }
}

@media screen and (max-width: 550px) {
  .modal-body {
    .select-reason-box {
      width: 100%;
    }
  }
}

@media screen and (max-width: 320px) {
  .modal-footer {
    .to-next-step-button {
      margin: 20px auto 100px;
    }
  }
}
</style>
