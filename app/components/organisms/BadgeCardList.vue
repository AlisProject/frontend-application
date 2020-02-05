<template>
  <div v-if="!walletAddress && isCurrentUser" class="area-wallet-address-notice">
    <div v-if="isMobile()" class="wallet-address-register-mobile">
      <p class="badge-description">
        バッジを表示するにはETHアカウントを連携する必要があります。連携を行う場合はパソコンから当ページにアクセスください。
      </p>
      <ul class="notice">
        <li>
          詳細については<nuxt-link class="link" to="/ALIS-official/article/K0ZQLL7yDQP8">
            こちら
          </nuxt-link>をご参照ください
        </li>
      </ul>
    </div>
    <div v-else-if="!isMetaMaskInstalled" class="request-install-metamask">
      <h2 class="title">
        この機能の利用にはMETAMASKのインストールが必要です
      </h2>
      <p class="description">
        現在バッジ機能を利用するにはMETAMASKが必要となります。METAMASKを利用可能なブラウザにインストールして下さい
      </p>
      <img src="~assets/images/pc/common/metamask-fox.svg" alt="METAMASK" class="metamask">
      <span class="metamask-tm">METAMASK<sup class="sup">TM</sup></span>
      <app-button>
        <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
          METAMASKをインストールする
        </a>
      </app-button>
    </div>
    <p v-else-if="isMetaMaskInstalled && !isCorrectNetworkSelected" class="ethereum-network-notice">
      Ethereumメインネットワークのみご利用できます。MetaMaskの設定をご確認ください。
    </p>
    <div
      v-else-if="isMetaMaskInstalled && isCorrectNetworkSelected"
      class="wallet-address-register-pc"
    >
      <p class="badge-description">
        バッジ機能の利用にはETHアカウントの連携が必要です
      </p>
      <app-button class="submit-button" @click="onSubmit()">
        ETHアカウントを連携する
      </app-button>
      <ul class="notice">
        <li>
          連携されたETHアカウントはALISアカウントに紐付きます。
          トークン等の外部から参照されたくない情報を扱ってるETHアカウントは連携しないでください
        </li>
        <li>
          バッジは最大24時間で発行されます
        </li>
        <li>
          バッジの再発行は行えません。連携するETHアカウントはお間違えないようお願いします
        </li>
        <li>
          詳細については<nuxt-link class="link" to="/ALIS-official/article/K0ZQLL7yDQP8">
            こちら
          </nuxt-link>をご参照ください
        </li>
      </ul>
    </div>
  </div>
  <div v-else-if="badges.length < 1" class="area-not-exists-badges description">
    <p>現在バッジは登録されていません</p>
    <p v-if="isCurrentUser && isMobile()">
      登録済みのETHアカウントを変更する場合はパソコンから当ページにアクセスください。
    </p>
    <p>
      詳細については<nuxt-link class="link" to="/ALIS-official/article/K0ZQLL7yDQP8">
        こちら
      </nuxt-link>をご参照ください
    </p>
  </div>
  <div v-else class="area-badge-card-list-container">
    <badge-card
      v-for="badge in badges"
      :key="badge.tokenId"
      :tokenId="parseInt(badge.tokenId, 10)"
      :metadata="badge.metadata"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppButton from '../atoms/AppButton'
import BadgeCard from '../molecules/BadgeCard'
import { isMobile } from '~/utils/device'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import {
  isMetaMaskInstalled,
  isCorrectNetworkSelected,
  enableMetaMask,
  generateSignature
} from '~/utils/web3'

export default {
  props: {
    isCurrentUser: {
      type: Boolean
    }
  },
  components: {
    AppButton,
    BadgeCard
  },
  data() {
    return {
      isLoading: true,
      isMetaMaskInstalled: true,
      isCorrectNetworkSelected: true,
      isProcessing: false,
      isMobile
    }
  },
  async mounted() {
    this.isMetaMaskInstalled = isMetaMaskInstalled()
    this.isCorrectNetworkSelected = await isCorrectNetworkSelected()
    this.isLoading = false
  },
  computed: {
    ...mapGetters('badge', ['walletAddress', 'badges']),
    ...mapGetters('user', ['userInfo'])
  },
  methods: {
    async onSubmit() {
      try {
        if (this.isProcessing) return
        this.isProcessing = true
        if (this.isMetaMaskInstalled && this.isCorrectNetworkSelected) {
          // MetaMask連携を許可
          await enableMetaMask()

          // 署名を生成
          const data = `この署名はあなたのETHアカウントをALISに登録するために利用されます。\n\nあなたのユーザID: ${
            this.userInfo.user_id
          }`
          const signature = await generateSignature(data)

          // 署名を送信(アドレス連携)
          await this.registerWalletAddress({ signature })

          // バッジ情報を取得
          await this.fetchWalletAddress({ userId: this.$route.params.userId })
          if (this.walletAddress) {
            await this.fetchBadges({ walletAddress: this.walletAddress })
          }
        }
      } catch (error) {
        this.sendNotification({
          text: 'エラーが発生しました。お手数ですが、時間をおいて再度お試しください',
          type: 'warning'
        })
        console.error(error)
      } finally {
        this.isProcessing = false
      }
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('badge', [
      'registerWalletAddress',
      'unregisterWalletAddress',
      'fetchWalletAddress',
      'fetchBadges'
    ])
  }
}
</script>

<style lang="scss" scoped>
.request-install-metamask {
  display: flex;
  flex-direction: column;
  align-items: center;
  .metamask {
    width: 130px;
    margin: 10px 0 0;
  }

  .metamask-tm {
    color: #75787b;
    font-size: 16px;
    letter-spacing: 0.38px;
    margin-bottom: 30px;
    text-align: center;

    .sup {
      font-size: 10px;
      top: -0.8em;
    }
  }
}

.ethereum-network-notice,
.title {
  color: #030303;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.8px;
  line-height: 21px;
  text-align: center;
}

.description {
  color: #6e6e6e;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.8px;
  line-height: 1.5;
  .link {
    color: #0086cc;
    text-decoration: none;
  }
}

.area-wallet-address-notice {
  grid-area: badge-card-list;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  justify-content: center;
  width: 500px;
  margin: 0 auto 0 auto;
}

.area-not-exists-badges {
  grid-area: badge-card-list;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  justify-content: center;
  text-align: center;
}

.area-badge-card-list-container {
  display: grid;
  grid-area: badge-card-list;
  grid-gap: 15px;
  grid-template-columns: repeat(auto-fill, 130px);
  grid-template-rows: repeat(auto-fill, 180px);
  justify-content: center;
  padding: 0 0 21px;
  margin: 14.5px 0 0;
}

.badge-description {
  font-size: 14px;
  text-align: center;
}

.submit-button {
  margin: 30px auto;
}

ul.notice {
  list-style-type: none;
  text-indent: -1.25em;
  font-size: 10px;
  li:before {
    display: inline;
    content: '※';
  }
  .link {
    color: #0086cc;
    text-decoration: none;
  }
}

@media screen and (max-width: 920px) {
  .area-wallet-address-notice {
    width: 340px;
  }
  .area-badge-card-list-container {
    margin: 14.5px 27px;
    grid-gap: 15px 26px;
  }
}

@media screen and (max-width: 550px) {
  .area-badge-card-list-container {
    margin: -31px 0 0;
    grid-gap: 15px;
    grid-template-columns: repeat(auto-fill, 96px);
    grid-template-rows: repeat(auto-fill, 136px);
  }
}
</style>
