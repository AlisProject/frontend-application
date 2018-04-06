<template>
  <div class="area-article-sub-infos-container">
    <div class="article-sub-info">
      公開日：<span class="created-at">{{ createdAt }}</span>
    </div>
    <div class="article-sub-info">
      獲得トークン：<span class="token-amount">{{ tokenAmount }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    createdAt: {
      type: String,
      required: true
    },
    tokenAmount: {
      type: String,
      required: true
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

    .created-at,
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
