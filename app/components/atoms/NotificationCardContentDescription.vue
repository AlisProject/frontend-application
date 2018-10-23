<template>
  <p class="area-description" v-if="notification.type === 'like'">
    <span class="liked_count">{{ notification.liked_count }}人</span>があなたの記事にいいねしました。"{{ decodedArticleTitle }}"
  </p>
  <p class="area-description" v-else-if="notification.type === 'comment'">
    <span class="liked_count">{{ decodedUserDisplayName }}</span>があなたの記事にコメントしました。"{{ decodedArticleTitle }}"
  </p>
  <p class="area-description" v-else-if="notification.type === 'tip'">
    <span class="liked_count">{{ decodedUserDisplayName }}</span>
    から
    <span class="liked_count">{{ tipTokenAmountForUser }}ALIS</span>
    受け取りました。"{{ decodedArticleTitle }}"
  </p>
  <p class="area-description" v-else-if="notification.type === 'tip_error'">
    <span class="liked_count">{{ decodedUserDisplayName }}</span>
    にトークンを贈れませんでした。"{{ decodedArticleTitle }}"
  </p>
</template>

<script>
import { BigNumber } from 'bignumber.js'
import { htmlDecode } from '~/utils/article'

export default {
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  computed: {
    tipTokenAmountForUser() {
      const formatNumber = 10 ** 18
      return new BigNumber(this.notification.tip_value).div(formatNumber).toString(10)
    },
    decodedArticleTitle() {
      return htmlDecode(this.notification.article_title)
    },
    decodedUserDisplayName() {
      return htmlDecode(this.notification.userInfo.user_display_name)
    }
  }
}
</script>

<style lang="scss" scoped>
.area-description {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #7f7f7f;
  display: -webkit-box;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  overflow: hidden;
}

.liked_count {
  color: #040404;
}
</style>
