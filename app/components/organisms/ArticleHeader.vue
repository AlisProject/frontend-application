<template>
  <div class="area-header">
    <a class="share-twitter" target="_blank" />
    <a class="share-facebook" target="_blank" />
    <template v-if="isCurrentUser">
      <div v-if="isPaidArticle" class="price-label">
        有料：{{ formattedPrice }}ALIS
      </div>
      <div class="article-button" @click="toggleArticlePopup">
        <div v-show="isArticlePopupShown" class="article-popup">
          <nuxt-link
            v-if="isV2Article"
            class="article-popup-content"
            :to="`/me/articles/public/v2/${article.article_id}/edit`"
          >
            編集する
          </nuxt-link>
          <a
            v-else
            class="article-popup-content"
            :class="{ 'hide-article-popup-content': !isV2Article }"
            :href="`/me/articles/public/${article.article_id}/edit`"
          >
            編集する
          </a>
          <span
            class="article-popup-content unpublish-button"
            :class="{ 'show-unpublish-button': isV2Article }"
            @click="unpublish"
          >
            下書きに戻す
          </span>
          <hr v-if="!isMobile()" class="separate-line">
          <span
            v-if="!isMobile()"
            class="article-popup-content write-to-blockchain-button"
            @click="writeToBlockchain()"
          >ブロックチェーンに記録する</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="isPaidArticle && !isPurchased" class="price-label">
        有料：{{ formattedPrice }}ALIS
      </div>
      <div v-if="isPaidArticle && isPurchased" class="purchased-label">
        購入済
      </div>
    </template>
  </div>
</template>

<script>
/* global Web3 */
import { mapActions, mapGetters } from 'vuex'
import { BigNumber } from 'bignumber.js'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { isV2 } from '~/utils/article'
import { isMobile } from '~/utils/device'

export default {
  props: {
    article: {
      type: Object,
      required: true
    },
    topic: {
      type: String,
      required: false
    },
    isCurrentUser: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isArticlePopupShown: false,
      isMobile,
      registryContractAbi: [
        {
          name: 'register',
          outputs: [],
          inputs: [
            {
              type: 'bytes32',
              name: '_digest'
            }
          ],
          constant: false,
          payable: false,
          type: 'function'
        }
      ]
    }
  },
  computed: {
    shareUrl() {
      return `https://${process.env.ALIS_APP_DOMAIN}/${this.article.user_id}/articles/${
        this.article.article_id
      }`
    },
    isV2Article() {
      return isV2(this.article)
    },
    isPaidArticle() {
      return !!this.article.price
    },
    isPurchased() {
      return this.purchasedArticleIds.includes(this.article.article_id)
    },
    formattedPrice() {
      const formatNumber = 10 ** 18
      const price = new BigNumber(this.article.price).div(formatNumber).toString(10)
      return price
    },
    isProduction() {
      return process.env.ALIS_APP_ID === 'alis'
    },
    ...mapGetters('article', ['purchasedArticleIds', 'originalBody'])
  },
  mounted() {
    this.listen(window, 'click', (event) => {
      if (
        this.$el.querySelector('.article-button') &&
        !this.$el.querySelector('.article-button').contains(event.target)
      ) {
        this.closeEtcPopup()
      }
    })
    this.listen(window, 'touchstart', (event) => {
      if (
        this.$el.querySelector('.article-button') &&
        !this.$el.querySelector('.article-button').contains(event.target)
      ) {
        this.closeEtcPopup()
      }
    })
    this.$el.querySelector(
      '.share-twitter'
    ).href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      location.href
    )}&text=${encodeURIComponent(`${this.article.title} | ALIS`)}`

    this.$el.querySelector(
      '.share-facebook'
    ).href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}`
  },
  destroyed() {
    if (this._eventRemovers) {
      this._eventRemovers.forEach((eventRemover) => {
        eventRemover.remove()
      })
    }
  },
  methods: {
    toggleArticlePopup() {
      this.isArticlePopupShown = !this.isArticlePopupShown
    },
    closeEtcPopup() {
      this.isArticlePopupShown = false
    },
    async unpublish() {
      const articleId = this.article.article_id
      try {
        await this.unpublishPublicArticle({ articleId })
        // 下書きに戻した後に下書き記事ページの記事情報を更新するために location.href を使う
        location.href = `/users/${this.article.user_id}/drafts`
        this.sendNotification({ text: '記事を下書きに戻しました' })
      } catch (e) {
        this.sendNotification({ text: '記事を下書きに戻せませんでした', type: 'warning' })
      }
    },
    isTargetNetwork(networkType) {
      const targetNetworkType = this.isProduction ? 'main' : 'ropsten'
      return networkType === targetNetworkType
    },
    checkIsMetaMaskInstalled() {
      return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
    },
    async approveMetaMask() {
      await window.ethereum.enable()
      return new Web3(window.ethereum)
    },
    async writeToBlockchain() {
      if (!this.checkIsMetaMaskInstalled()) {
        this.sendNotification({
          text: 'MetaMaskのインストールが必要です',
          type: 'warning'
        })
        return
      }

      let web3
      try {
        web3 = await this.approveMetaMask()
      } catch (e) {
        this.sendNotification({
          text: 'MetaMaskの承認に失敗しました',
          type: 'warning'
        })
        return
      }

      const networkType = await web3.eth.net.getNetworkType()
      if (!this.isTargetNetwork(networkType)) {
        this.sendNotification({
          text: 'Ethereumメインネットワークのみご利用できます。MetaMaskの設定をご確認ください。',
          type: 'warning'
        })
        return
      }

      // 表示用の最適化をしていないBody情報を取得
      await this.getPublicArticleOriginalBody({ articleId: this.article.article_id })
      // ダイジェストを生成
      const digest = web3.utils.keccak256(this.originalBody)

      const registry = new web3.eth.Contract(
        this.registryContractAbi,
        process.env.PUBLIC_CHAIN_REGISTRY_ADDRESS
      )
      registry.methods
        .register(digest)
        .send({
          from: window.ethereum.selectedAddress // MetaMaskで選択中のアカウント
        })
        .on('transactionHash', (hash) => {
          this.sendNotification({
            text: 'トランザクションを発行しました。詳細はMETAMASKでご確認ください'
          })

          // 3秒後に記事をダウンロード
          setTimeout(() => {
            this.downloadArticle(this.originalBody)
          }, 3000)
        })
        .on('error', (e) => {
          this.sendNotification({
            text: 'トランザクション発行に失敗しました',
            type: 'warning'
          })
        })
    },
    downloadArticle(originalBody) {
      const download = document.createElement('a')
      download.download = 'hashed-article'
      download.href = URL.createObjectURL(new Blob([originalBody], { type: 'text/plain' }))
      download.click()
    },
    listen(target, eventType, callback) {
      if (!this._eventRemovers) {
        this._eventRemovers = []
      }
      target.addEventListener(eventType, callback)
      this._eventRemovers.push({
        remove: function() {
          target.removeEventListener(eventType, callback)
        }
      })
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('article', ['unpublishPublicArticle', 'getPublicArticleOriginalBody'])
  }
}
</script>

<style lang="scss" scoped>
.area-header {
  grid-area: header;
  align-items: center;
  background: #fff;
  display: flex;
  height: 31px;
  margin-top: -3px;
  margin-bottom: -20px;
  z-index: 2;

  .share-twitter {
    background: #fff url('~assets/images/pc/article/icon_share_twitter_circle.svg') no-repeat;
    background-size: cover;
    height: 22px;
    width: 22px;
  }

  .share-facebook {
    background: #fff url('~assets/images/pc/article/icon_share_facebook_circle.svg') no-repeat;
    background-size: cover;
    height: 22px;
    width: 22px;
    margin-left: 8px;
    margin-right: auto;
  }

  .article-button {
    background: #fff url('~assets/images/pc/article/icon_etc.png') no-repeat;
    background-size: 24px;
    cursor: pointer;
    position: relative;
    width: 24px;
    height: 26px;
    margin-left: 8px;

    .article-popup {
      background-color: #ffffff;
      border-radius: 4px;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25));
      cursor: default;
      box-sizing: border-box;
      font-size: 14px;
      padding: 8px 16px;
      position: absolute;
      right: 0px;
      top: 24px;
      z-index: 1;

      .article-popup-content {
        color: #6e6e6e;
        cursor: pointer;
        display: inline-block;
        font-size: 14px;
        font-weight: 500;
        line-height: 2;
        text-decoration: none;
        user-select: none;
        white-space: nowrap;
        width: 100%;
      }
    }
  }

  .separate-line {
    border: none;
    border-top: solid 1px #cecece;
    height: 1px;
    opacity: 0.3;
  }

  .price-label {
    align-items: center;
    border-radius: 2px;
    border: 1px solid #0086cc;
    box-sizing: border-box;
    color: #0086cc;
    display: flex;
    font-size: 12px;
    font-weight: bold;
    height: 24px;
    margin: 0 0 0 auto;
    padding: 0 6px;
  }

  .purchased-label {
    align-items: center;
    background: #9e9e9e;
    border-radius: 2px;
    box-sizing: border-box;
    color: #fff;
    display: flex;
    font-size: 12px;
    font-weight: bold;
    height: 24px;
    margin: 0 0 0 auto;
    padding: 0 6px;
  }
}

@media screen and (max-width: 640px) {
  .area-header {
    padding: 0 16px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 16px;
      bottom: 0;
      height: 1px;
      width: calc(100% - 16px * 2);
    }

    .article-button {
      .article-popup {
        right: 0px;

        .article-popup-content.unpublish-button {
          display: none;

          &.show-unpublish-button {
            display: block;
          }

          &.hide-article-popup-content {
            display: none;
          }
        }
      }
    }
  }
}
</style>
