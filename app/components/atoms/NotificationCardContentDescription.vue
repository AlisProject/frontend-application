<template>
  <p v-if="notification.type === 'like'" class="area-description">
    <span class="gray-darker">{{ notification.liked_count }}人</span>があなたの記事にいいねしました。"{{ decodedArticleTitle }}"
  </p>
  <p v-else-if="notification.type === 'comment'" class="area-description">
    <span class="gray-darker">{{ decodedUserDisplayName }}</span>があなたの記事に<span class="gray-darker">コメント</span>しました。
  </p>
  <p v-else-if="notification.type === 'tip'" class="area-description">
    <span class="gray-darker">{{ decodedUserDisplayName }}</span>
    から
    <span class="gray-darker">{{ tipTokenAmountForUser }}ALIS</span>
    受け取りました。"{{ decodedArticleTitle }}"
  </p>
  <p v-else-if="notification.type === 'tip_error'" class="area-description">
    <span class="gray-darker">{{ decodedUserDisplayName }}</span>
    にALISを贈れませんでした。"{{ decodedArticleTitle }}"
  </p>
  <p v-else-if="notification.type === 'reply'" class="area-description">
    <span class="gray-darker">{{ decodedUserDisplayName }}</span>があなたの<span class="gray-darker">コメントに返信</span>しました。
  </p>
  <p v-else-if="notification.type === 'thread'" class="area-description">
    <span class="gray-darker">{{ decodedUserDisplayName }}</span>が<span class="gray-darker">コメント</span>しました。
  </p>
  <p
    v-else-if="notification.type === 'announce' || notification.type === 'csvdownload'"
    class="area-description"
  >
    {{ notification.announce_body }}
  </p>
  <p v-else-if="notification.type === 'purchase'" class="area-description">
    <span class="gray-darker">{{ articlePriceForUser }}ALIS</span>で<span
      class="gray-darker"
    >記事を購入</span>しました。"{{ decodedArticleTitle }}"
  </p>
  <p v-else-if="notification.type === 'purchased'" class="area-description">
    <span class="gray-darker">{{ decodedUserDisplayName }}</span>が<span class="gray-darker">あなたの記事を購入</span>しました。"{{ decodedArticleTitle }}"
  </p>
  <p v-else-if="notification.type === 'purchase_error'" class="area-description">
    <span class="gray-darker">記事の購入</span>に<span class="gray-darker">失敗</span>しました。<span class="gray-darker">再度購入</span>してください。"{{ decodedArticleTitle }}"
  </p>
  <p v-else-if="notification.type === 'fraud'" class="area-description">
    <span class="gray-darker">{{ notification.fraud_body }}</span>
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
    articlePriceForUser() {
      const formatNumber = 10 ** 18
      return new BigNumber(this.notification.price).div(formatNumber).toString(10)
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
  color: #7f7f7f;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  overflow: hidden;
}

.gray-darker {
  color: #040404;
}
</style>
