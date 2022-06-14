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
  <p v-else-if="notification.type === 'get_token_like'" class="area-description">
    「いいね」によって
    <span class="gray-darker">{{ formattedAlisToken(notification.token) }}ALIS</span> 獲得しました！
    <span v-if="isOverNFTToken">
      合計
      <span class="gray-darker">{{ formattedAlisToken(notification.sum_token) }}ALIS</span>
      獲得しています。
    </span>
    <span v-else>
      NFT獲得まで <span class="gray-darker">{{ nftToken }}ALIS</span> です。
    </span>
  </p>
  <p v-else-if="notification.type === 'get_token_article'" class="area-description">
    公開された記事によって
    <span class="gray-darker">{{ formattedAlisToken(notification.token) }}ALIS</span> 獲得しました！
  </p>
</template>

<script>
import { BigNumber } from 'bignumber.js'
import { htmlDecode } from '~/utils/article'
const formatNumber = 10 ** 18

export default {
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  computed: {
    tipTokenAmountForUser() {
      return new BigNumber(this.notification.tip_value).div(formatNumber).toString(10)
    },
    articlePriceForUser() {
      return new BigNumber(this.notification.price).div(formatNumber).toString(10)
    },
    isOverNFTToken() {
      return BigNumber(this.notification.token).gte(BigNumber(100 * 10 ** 18))
    },
    nftToken() {
      return this.formattedAlisToken(
        BigNumber(100 * 10 ** 18).minus(BigNumber(this.notification.sum_token))
      )
    },
    decodedArticleTitle() {
      return htmlDecode(this.notification.article_title)
    },
    decodedUserDisplayName() {
      return htmlDecode(this.notification.userInfo.user_display_name)
    }
  },
  methods: {
    formattedAlisToken(token) {
      const formatToken = new BigNumber(token).div(formatNumber).toString(10)
      return new BigNumber(formatToken).toFixed(3, 1)
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
