<template>
  <div class="withdrawal-details-container">
    <app-header />
    <wallet-nav selected="history" />
    <div class="area-history">
      <div v-if="hasWithdrawalDetails" class="history">
        <p class="description">
          入出金履歴では直近の入金と出金の履歴をご覧いただけます
        </p>
        <div class="withdrawal-details">
          <div
            v-for="(withdrawalDetail, i) in withdrawalDetails"
            class="withdrawal-detail"
            @click="showWithdrawalDetailModal(i)"
          >
            <div class="timestamp">
              {{ withdrawalDetail.timestamp | formatDateWithTime }}
            </div>
            <div class="payment-type">
              {{ withdrawalDetail.isDeposit | showPaymentType
              }}{{ withdrawalDetail.finished | showProcessType }}
            </div>
            <div class="amount" :class="{ 'is-deposit': withdrawalDetail.isDeposit }">
              {{ withdrawalDetail.isDeposit ? '+' : '-'
              }}{{ withdrawalDetail.amount | showFormattedAmount }}
            </div>
            <div class="unit">
              ALIS
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-withdrawal-details">
        直近の入出金履歴はありません
      </div>
    </div>
    <app-footer />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import WalletNav from '../organisms/WalletNav'
import AppFooter from '../organisms/AppFooter'
import { formatDateWithTime } from '~/utils/format'
import { showPaymentType, showProcessType, showFormattedAmount } from '~/utils/wallet'

export default {
  components: {
    AppHeader,
    WalletNav,
    AppFooter
  },
  data() {
    return {
      // TODO: mounted時に withdrawalDetails から値の更新を行う
      hasWithdrawalDetails: true
    }
  },
  computed: {
    ...mapGetters('user', ['withdrawalDetails'])
  },
  methods: {
    showWithdrawalDetailModal(index) {
      this.setWithdrawalDetailModal({ isShow: true, index })
    },
    ...mapActions('user', ['setWithdrawalDetailModal'])
  },
  filters: {
    formatDateWithTime,
    showPaymentType,
    showProcessType,
    showFormattedAmount
  }
}
</script>

<style lang="scss" scoped>
.withdrawal-details-container {
  display: grid;
  grid-row-gap: 30px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header app-header app-header"
    "...        nav        ...       "
    "...        history    ...       "
    "app-footer app-footer app-footer";
  grid-template-columns: 1fr 400px 1fr;
  grid-template-rows: 100px 22px auto 75px;
  min-height: 100vh;
}

.area-history {
  grid-area: history;
}

.history {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.description {
  color: #000;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.8px;
  text-align: center;
  margin: 0 0 40px;
}

.withdrawal-detail {
  height: 56px;
  width: 400px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(192, 192, 192, 0.5);
  margin-bottom: 8px;
  position: relative;
  cursor: pointer;

  .timestamp,
  .payment-type,
  .amount,
  .unit {
    position: absolute;
  }

  .timestamp {
    top: 8px;
    left: 12px;
    color: #6e6e6e;
    font-size: 14px;
    font-weight: 500;
  }

  .payment-type {
    bottom: 8px;
    left: 12px;
    color: #000;
    font-size: 14px;
    font-weight: 500;
  }

  .amount {
    bottom: 8px;
    right: 38px;
    color: #f06273;
    font-size: 14px;
    font-weight: bold;

    &.is-deposit {
      color: #0086cc;
    }
  }

  .unit {
    bottom: 10px;
    right: 12px;
    color: #6e6e6e;
    font-size: 10px;
    font-weight: 500;
  }
}

.no-withdrawal-details {
  color: #030303;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin-top: 50px;
}
</style>
