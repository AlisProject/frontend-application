<template>
  <div class="withdrawal-detail-modal-content-container">
    <h1 class="title">
      入出金履歴詳細
    </h1>
    <div class="label">
      日時
    </div>
    <div class="confirm-input">
      {{ withdrawalDetail.timestamp | formatDateWithJapaneseStyle }}
    </div>
    <div class="label">
      ステータス
    </div>
    <div class="confirm-input">
      {{ withdrawalDetail.isDeposit | showPaymentType
      }}{{ withdrawalDetail.finished | showProcessType }}
    </div>
    <div class="label">
      宛先
    </div>
    <div class="confirm-input">
      {{ withdrawalDetail.recipient }}
    </div>
    <div class="label">
      {{ withdrawalDetail.isDeposit | showPaymentType }}額
    </div>
    <div class="confirm-input">
      {{ withdrawalDetail.amount | showFormattedAmount }}
      <span class="unit">ALIS</span>
    </div>
    <template v-if="!withdrawalDetail.isDeposit">
      <div class="label">
        手数料
      </div>
      <div class="confirm-input">
        {{ withdrawalDetail.fee | showFormattedAmount }}
        <span class="unit">ALIS</span>
      </div>
    </template>
    <div v-if="!withdrawalDetail.finished" class="not-finished-description">
      {{ withdrawalDetail.isDeposit | showPaymentType }}の処理が24時間経過後も完了しない場合は<br>
      <!-- TODO: リンクを追加 -->
      <a href="#" target="_blank" rel="noopener noreferrer" class="link">こちら</a>からお問い合わせください
    </div>
    <button class="close-button" @click="closeModal">
      もどる
    </button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { formatDateWithJapaneseStyle } from '~/utils/format'
import { showPaymentType, showProcessType, showFormattedAmount } from '~/utils/wallet'

export default {
  computed: {
    withdrawalDetail() {
      return this.withdrawalDetailModal.withdrawalDetail
    },
    ...mapGetters('user', ['withdrawalDetailModal'])
  },
  methods: {
    closeModal() {
      this.setWithdrawalDetailModal({ isShow: false })
    },
    ...mapActions('user', ['setWithdrawalDetailModal'])
  },
  filters: {
    formatDateWithJapaneseStyle,
    showPaymentType,
    showProcessType,
    showFormattedAmount
  }
}
</script>

<style lang="scss" scoped>
.withdrawal-detail-modal-content-container {
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  width: 400px;
  margin: 0 auto;
}

.title {
  color: #030303;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.8px;
}

.label {
  color: #030303;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.8px;
  margin: 20px 0 10px;
  width: 100%;
}

.confirm-input {
  border-radius: 4px;
  background-color: rgba(0, 134, 204, 0.05);
  padding: 12px;
  color: #030303;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  width: 100%;
  box-sizing: border-box;

  .unit {
    float: right;
  }
}

.not-finished-description {
  color: #000;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.8px;
  line-height: 1.5;
  text-align: center;
  margin: 40px 0 0;

  .link {
    color: #0086cc;
    font-size: 12px;
    text-decoration: none;
  }
}

.close-button {
  background-color: #fff;
  border-radius: 30px;
  border: 1px solid #0086cc;
  color: #0086cc;
  cursor: pointer;
  display: block;
  height: 37px;
  margin: 40px auto;
  width: 256px;
  outline: none;
}
</style>
