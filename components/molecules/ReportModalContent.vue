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
import { mapActions } from 'vuex'

export default {
  methods: {
    report() {
      this.setAlertText({ alertText: '通報しました' })
      this.setAlert({ showAlert: true })
      this.setReportModal({ showReportModal: false })
      document.querySelector('html,body').style.overflow = ''
    },
    closeModal() {
      this.setReportModal({ showReportModal: false })
      document.querySelector('html,body').style.overflow = ''
    },
    ...mapActions('user', ['setReportModal', 'setAlert', 'setAlertText'])
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
  width: 256px;
}
</style>
