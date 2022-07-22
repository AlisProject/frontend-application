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
    <span v-if="isGetNFT">
      今回のALIS獲得でNFT獲得条件を達成しました！NFTの準備が完了次第、受け取りのお知らせが通知されるのでしばらくお待ちください。
      ※ 10日程度かかる場合があります。
    </span>
    <span v-else-if="isOverSilverNFTToken">
      GOLD NFT獲得まで <span class="gray-darker">{{ nextNftToken }}ALIS</span> です。
    </span>
    <span v-else-if="isOverBronzeNFTToken">
      SILVER NFT獲得まで <span class="gray-darker">{{ nextNftToken }}ALIS</span> です。
    </span>
    <span v-else>
      NFT獲得まで <span class="gray-darker">{{ nextNftToken }}ALIS</span> です。
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
  data() {
    return {
      likedBronzeToken: 100 * formatNumber,
      likedSilverToken: 3000 * formatNumber,
      likedGoldToken: 7000 * formatNumber
    }
  },
  computed: {
    tipTokenAmountForUser() {
      return new BigNumber(this.notification.tip_value).div(formatNumber).toString(10)
    },
    articlePriceForUser() {
      return new BigNumber(this.notification.price).div(formatNumber).toString(10)
    },
    isOverGoldFTToken() {
      return BigNumber(this.notification.sum_token).gte(BigNumber(this.likedGoldToken))
    },
    isOverSilverNFTToken() {
      return BigNumber(this.notification.sum_token).gte(BigNumber(this.likedSilverToken))
    },
    isOverBronzeNFTToken() {
      return BigNumber(this.notification.sum_token).gte(BigNumber(this.likedBronzeToken))
    },
    isGetNFT() {
      if (this.isOverGoldFTToken) {
        return true
      } else if (this.isOverSilverNFTToken) {
        // 今回初めて閾値を超えた場合のみ true を返却
        if (
          BigNumber(this.notification.sum_token)
            .minus(this.notification.token)
            .lte(BigNumber(this.likedSilverToken))
        ) {
          return true
        }
      } else if (this.isOverBronzeNFTToken) {
        // 今回初めて閾値を超えた場合のみ true を返却
        if (
          BigNumber(this.notification.sum_token)
            .minus(this.notification.token)
            .lte(BigNumber(this.likedBronzeToken))
        ) {
          return true
        }
      }
      return false
    },
    nextNftToken() {
      let tmpToken = 0
      if (this.isOverSilverNFTToken) {
        tmpToken = BigNumber(this.likedGoldToken).minus(BigNumber(this.notification.sum_token))
      } else if (this.isOverBronzeNFTToken) {
        tmpToken = BigNumber(this.likedSilverToken).minus(BigNumber(this.notification.sum_token))
      } else {
        tmpToken = BigNumber(this.likedBronzeToken).minus(BigNumber(this.notification.sum_token))
      }
      return this.formattedAlisToken(tmpToken)
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
