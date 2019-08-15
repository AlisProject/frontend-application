<template>
  <div class="license-token-container">
    <app-header />
    <div class="area-license-token">
      <the-loader v-if="isLoading" :isLoading="isLoading" />
      <div v-else>
        <div v-if="isMobile()">
          <h2 class="title">
            この機能はスマートフォンからは利用出来ません
          </h2>
        </div>
        <div v-else-if="!isMetaMaskInstalled" class="request-install-metamask">
          <h2 class="title">
            この機能の利用にはMETAMASKのインストールが必要です
          </h2>
          <p class="description">
            ライセンストークン管理機能ではトランザクションの生成が必要なためMETAMASKが必要となります。METAMASKを利用可能なブラウザにインストールして下さい。
          </p>
          <img src="~assets/images/pc/common/metamask-fox.svg" alt="METAMASK" class="metamask">
          <span class="metamask-tm">METAMASK<sup class="sup">TM</sup></span>
          <app-button>
            <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
              METAMASKをインストールする
            </a>
          </app-button>
        </div>
        <div v-else>
          <div v-if="isTargetNetwork">
            <h1 class="title">
              ライセンストークン管理
            </h1>
            <labo-n-license-token-dropzone />
            <div class="certification-list">
              所有ライセンストークン一覧
            </div>
            <labo-n-license-token-list />
          </div>
          <p v-else class="title">
            Ethereumメインネットワークのみご利用できます。MetaMaskの設定をご確認ください。
          </p>
        </div>
      </div>
    </div>
    <app-footer />
  </div>
</template>

<script>
/* global Web3 */
import AppHeader from '~/components/organisms/AppHeader'
import AppFooter from '~/components/organisms/AppFooter'
import LaboNLicenseTokenDropzone from '~/components/organisms/LaboNLicenseTokenDropzone'
import LaboNLicenseTokenList from '~/components/organisms/LaboNLicenseTokenList'
import TheLoader from '../atoms/TheLoader'
import AppButton from '../atoms/AppButton'
import { isMobile } from '~/utils/device'

export default {
  components: {
    AppHeader,
    AppFooter,
    LaboNLicenseTokenDropzone,
    LaboNLicenseTokenList,
    TheLoader,
    AppButton
  },
  data() {
    return {
      isLoading: true,
      isMetaMaskInstalled: true,
      networkType: 'main',
      isMobile
    }
  },
  computed: {
    isProduction() {
      return process.env.ALIS_APP_ID === 'alis'
    },
    isTargetNetwork() {
      const targetNetworkType = this.isProduction ? 'main' : 'ropsten'
      return this.networkType === targetNetworkType
    }
  },
  async mounted() {
    this.isMetaMaskInstalled = this.checkIsMetaMaskInstalled()
    if (this.isMetaMaskInstalled) {
      try {
        const web3 = await this.initMetamask()
        this.networkType = await web3.eth.net.getNetworkType()
      } catch (error) {
        console.error(error)
      }
    }
    this.isLoading = false
  },
  methods: {
    checkIsMetaMaskInstalled() {
      return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
    },
    async initMetamask() {
      await window.ethereum.enable()
      return new Web3(window.ethereum)
    }
  }
}
</script>

<style lang="scss" scoped>
.license-token-container {
  display: grid;
  grid-row-gap: 40px;
  grid-template-columns: 1fr 710px 1fr;
  grid-template-rows: 100px auto 75px;
  /* prettier-ignore */
  grid-template-areas:
    'app-header app-header      app-header'
    '...        license-token ...       '
    'app-footer app-footer      app-footer';
  background: white;
  min-height: 100vh;
}

@media screen and (max-width: 920px) {
  .license-token-container {
    grid-template-columns: 1fr 340px 1fr;
  }
}

@media screen and (max-width: 550px) {
  .license-token-container {
    background: #fff;
    grid-template-columns: 1fr 340px 1fr;
    grid-template-rows: 66px auto min-content;
    grid-row-gap: 20px;
    /* prettier-ignore */
    grid-template-areas:
    'app-header app-header      app-header'
    '...        license-token ...       '
    'app-footer app-footer      app-footer';
  }
}

.area-license-token {
  grid-area: license-token;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  color: #030303;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 5px;
  text-align: center;
  margin: 0 0 40px;
  line-height: 1.5;
}

.certification-list {
  color: #030303;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 5px;
  text-align: center;
  margin: 50px 0 20px;
  line-height: 1.5;
}

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
    font-family: Helvetica;
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
</style>
