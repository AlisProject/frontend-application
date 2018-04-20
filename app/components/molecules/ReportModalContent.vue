<template>
  <div class="report-modal-content">
    <p class="confirm-text">
      本当に通報しますか？
    </p>
    <button class="report-button" @click="report">
      通報する
    </button>
    <button class="close-button" @click="closeModal">
      閉じる
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  computed: {
    ...mapGetters('article', ['article'])
  },
  methods: {
    async report() {
      try {
        await this.postFraud({ articleId: this.article.article_id })
        this.sendNotification({ text: '通報しました' })
      } catch (error) {
        let text = 'エラーが発生しました。しばらく時間を置いて再度お試しください'
        if (error.response.data.message === 'Already exists') {
          text = 'すでに通報済みです'
        }
        this.sendNotification({ text, type: 'warning' })
      }
      this.setReportModal({ showReportModal: false })
      document.querySelector('html,body').style.overflow = ''
    },
    closeModal() {
      this.setReportModal({ showReportModal: false })
      document.querySelector('html,body').style.overflow = ''
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('user', ['setReportModal']),
    ...mapActions('article', ['postFraud'])
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
  background: linear-gradient(134.72deg, #232538 0%, #858dda 100%);
  border-radius: 18px;
  border: none;
  box-shadow: 0 0 10px gray;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 14px;
  margin: 60px auto 0;
  outline: none;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  width: 265px;
}

.close-button {
  background-color: #fff;
  border-radius: 30px;
  border: 1px solid #858dda;
  color: #858dda;
  cursor: pointer;
  display: block;
  height: 37px;
  margin: 20px auto 100px;
  width: 265px;
}

@media screen and (max-width: 550px) {
  .confirm-text {
    padding: 30vh 0 0;
  }
}
</style>
