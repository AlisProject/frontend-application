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
  background: url('~assets/images/pc/common/icon_alistoken.png') no-repeat;
  background-size: 15px;
  bottom: 20px;
  color: #717171;
  font-size: 12px;
  height: 22px;
  margin: 0;
  padding: 0 0 0 22px;
  position: absolute;
  right: 24px;

  &.nonDisplay {
    background: none;
  }
}

.long-article-card {
  .token-amount {
    bottom: 25px;
    font-size: 14px;
    position: absolute;
    right: 28px;
  }
}

@media screen and (max-width: 1296px) {
  .long-article-card {
    .token-amount {
      bottom: 10px;
      right: 20px;
    }
  }
}
</style>
