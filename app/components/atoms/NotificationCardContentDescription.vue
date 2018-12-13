<template>
  <p class="area-description" v-if="notification.type === 'like'">
    <span class="gray-darker">{{ notification.liked_count }}人</span>があなたの記事にいいねしました。"{{ decodedArticleTitle }}"
  </p>
  <p class="area-description" v-else-if="notification.type === 'comment'">
    <span class="gray-darker">{{ decodedUserDisplayName }}</span>があなたの記事に<span class="gray-darker">コメント</span>しました。
  </p>
  <p class="area-description" v-else-if="notification.type === 'tip'">
    <span class="gray-darker">{{ decodedUserDisplayName }}</span>
    から
    <span class="gray-darker">{{ tipTokenAmountForUser }}ALIS</span>
    受け取りました。"{{ decodedArticleTitle }}"
  </p>
  <p class="area-description" v-else-if="notification.type === 'tip_error'">
    <span class="gray-darker">{{ decodedUserDisplayName }}</span>
    にALISを贈れませんでした。"{{ decodedArticleTitle }}"
  </p>
  <p class="area-description" v-else-if="notification.type === 'reply'">
    <span class="gray-darker">{{ decodedUserDisplayName }}</span>があなたの<span class="gray-darker">コメントに返信</span>しました。
  </p>
  <p class="area-description" v-else-if="notification.type === 'thread'">
    <span class="gray-darker">{{ decodedUserDisplayName }}</span>が<span class="gray-darker">コメント</span>しました。
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

.gray-darker {
  color: #040404;
}
</style>
