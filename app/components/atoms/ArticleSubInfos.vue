<template>
  <div class="area-article-sub-infos-container">
    <div class="article-sub-info">
      公開日：<span class="published-at">{{ formattedPublishedAt }}</span>
    </div>
    <div class="article-sub-info">
      獲得ALIS：<span class="token-amount">{{ tokenAmount | formatTokenAmount }}</span>
    </div>
  </div>
</template>

<script>
import { formatDate } from '~/utils/format'
import { formatTokenAmount } from '~/utils/article'

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
    formattedPublishedAt() {
      return formatDate(this.publishedAt)
    }
  },
  filters: {
    formatTokenAmount
  }
}
</script>

<style lang="scss" scoped>
.area-article-sub-infos-container {
  grid-area: article-sub-infos;
  margin-bottom: 40px;

  .article-sub-info {
    color: #6e6e6e;
    font-size: 16px;
    line-height: 28px;
    display: inline;

    &:nth-child(1) {
      margin-right: 40px;
    }

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
    margin-bottom: 0;

    .article-sub-info {
      font-size: 14px;
    }
  }
}
</style>
