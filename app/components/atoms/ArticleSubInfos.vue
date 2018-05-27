<template>
  <div class="area-article-sub-infos-container">
    <div class="article-sub-info">
      公開日：<span class="published-at">{{ formettedPublishedAt }}</span>
    </div>
    <div class="article-sub-info">
      獲得トークン：<span class="token-amount">{{ formattedTokenAmount }}</span>
    </div>
  </div>
</template>

<script>
import { BigNumber } from 'bignumber.js'
import moment from 'moment'

export default {
  props: {
    publishedAt: {
      type: Number,
      required: true
    },
    tokenAmount: {
      type: Number,
      required: true
    }
  },
  computed: {
    formettedPublishedAt() {
      return moment(this.createdAt, 'X')
        .locale('ja')
        .format('L')
    },
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
.area-article-sub-infos-container {
  grid-area: article-sub-infos;

  .article-sub-info {
    color: #6e6e6e;
    font-size: 16px;
    line-height: 28px;
    display: inline;
    margin-right: 40px;

    .published-at,
    .token-amount {
      letter-spacing: 0.05em;
      color: #030303;
    }
  }
}

@media screen and (max-width: 640px) {
  .area-article-sub-infos-container {
    grid-area: article-sub-infos;
    margin-bottom: 40px;

    .article-sub-info {
      font-size: 14px;
    }
  }
}
</style>
