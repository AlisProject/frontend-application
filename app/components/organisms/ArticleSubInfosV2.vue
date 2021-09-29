<template>
  <div class="area-article-sub-infos-container">
    <span class="title">獲得ALIS:</span>
    <img class="icon" src="~assets/images/pc/article/icon_article_like_v2.png" alt="Article like">
    <span class="value">{{ article.alisToken | formatTokenAmount }} ALIS</span>
    <img class="icon" src="~assets/images/pc/article/icon_article_tip.png" alt="Article tip">
    <span class="value">{{ article.tip_value | formatTokenAmount }} ALIS</span>
  </div>
</template>

<script>
import { formatTokenAmount } from '~/utils/article'

export default {
  props: {
    article: {
      type: Object,
      required: true
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
  margin-top: -15px;
}

.icons,
.titles {
  height: 106px;
}

.icon {
  width: 20px;
  vertical-align: bottom;
}

.title {
  color: #6e6e6e;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  margin-right: 5px;
}

.value {
  color: #030303;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  text-align: right;
}

@media screen and (max-width: 640px) {
  .area-article-sub-infos-container {
    margin: 6px 0 15px;
  }
}
</style>
