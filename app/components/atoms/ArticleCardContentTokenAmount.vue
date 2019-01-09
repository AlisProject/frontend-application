<template>
  <p class="token-amount" :class="{ nonDisplay: tokenAmount === undefined }">{{ formattedTokenAmount }}</p>
</template>

<script>
import { BigNumber } from 'bignumber.js'

export default {
  props: {
    tokenAmount: {
      type: Number
    }
  },
  computed: {
    formattedTokenAmount() {
      if (this.tokenAmount === undefined) return
      const stringTokenAmount = this.tokenAmount.toString()
      const formatNumber = 10 ** 18
      const alisToken = new BigNumber(stringTokenAmount).div(formatNumber)
      return alisToken > 999 ? (alisToken / 1000).toFixed(2, 1) + 'k' : alisToken.toFixed(2, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.token-amount {
  align-items: center;
  background: url('~assets/images/pc/common/icon_token_cassette.png') no-repeat;
  background-size: 18px;
  bottom: 0;
  color: #717171;
  display: flex;
  font-size: 12px;
  font-weight: bold;
  height: 18px;
  margin: 0;
  letter-spacing: 0.8px;
  padding: 0 0 0 22px;
  position: absolute;
  right: 0;

  &.nonDisplay {
    background: none;
  }
}
</style>
