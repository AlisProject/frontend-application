<template>
  <div class="license-token-certificate-modal-content-container">
    <h1 class="title">
      ライセンストークン証明書
    </h1>
    <h1 class="description">
      下記のライセンストークンを所有することを証明します。
    </h1>
    <div class="label">
      トークンID
    </div>
    <div class="confirm-input">
      {{ tokenId }}
    </div>
    <div class="label">
      所有者のアドレス
    </div>
    <div class="confirm-input">
      {{ ownerAddress }}
    </div>

    <div v-if="downloadFailed" class="download-link-ng">
      ダウンロードに失敗しました
    </div>
    <div v-else class="download-link-ok" @click="downloadFile(tokenId)">
      コンテンツをダウンロードする
    </div>

    <div class="notes">
      ダウンロードはライセンストークンの所有者のみ可能です。<br>また本機能はα版であり、コンテンツのダウンロードを永続的に保証するものではありません。
    </div>
    <button class="close-button" @click="closeModal">
      もどる
    </button>
  </div>
</template>

<script>
/* global Web3 */
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      downloadFailed: false,
      ownerAddress: '',
      abi: [
        {
          'constant': true,
          'inputs': [
            {
              'name': 'tokenId',
              'type': 'uint256'
            }
          ],
          'name': 'ownerOf',
          'outputs': [
            {
              'name': '',
              'type': 'address'
            }
          ],
          'payable': false,
          'stateMutability': 'view',
          'type': 'function'
        }
      ]
    }
  },
  computed: {
    tokenId() {
      return this.laboLicenseTokenCertificateModal.tokenId
    },
    ...mapGetters('user', ['laboLicenseTokenCertificateModal'])
  },
  async mounted() {
    this.ownerAddress = await this.getOwnerAddress(this.tokenId)
  },
  methods: {
    async getOwnerAddress(tokenId) {
      const web3 = new Web3(window.ethereum)
      const licenseToken = new web3.eth.Contract(this.abi, process.env.PUBLIC_CHAIN_LICENSE_TOKEN_ADDRESS)
      const owner = await licenseToken.methods.ownerOf(tokenId).call()
      return owner
    },
    async downloadFile(tokenId) {
      let downloadUrl
      try {
        const signature = await this.sign(tokenId)
        downloadUrl = await this.getDownloadUrl(tokenId, signature)
      } catch (err) {
        this.downloadFailed = true
        setTimeout(() => {
          this.downloadFailed = false
        }, 3000)

        return
      }

      // ダウンロードを開始
      const download = document.createElement('a')
      download.href = downloadUrl
      download.click()
    },
    async getDownloadUrl(tokenId, signature) {
      const response = await this.getLicenseTokenFileDownloadUrl({ tokenId, signature })
      return response.download_url
    },
    async sign(tokenId) {
      const web3 = new Web3(window.ethereum)
      const data = `この署名はトークンを保有していることの証明に利用されます。\nTokenID: ${tokenId}`
      const signature = await web3.eth.personal.sign(data, window.ethereum.selectedAddress)
      return signature
    },
    closeModal() {
      this.setLaboLicenseTokenCertificateModal({ isShow: false })
    },
    ...mapActions('user', [
      'setLaboLicenseTokenCertificateModal',
      'getLicenseTokenFileDownloadUrl'
    ])
  }
}
</script>

<style lang="scss" scoped>
.license-token-certificate-modal-content-container {
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  width: 400px;
  margin: 0 auto;
}

.title {
  color: #030303;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.8px;
}

.description {
  color: #030303;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.8px;
}

.label {
  color: #030303;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.8px;
  margin: 20px 0 10px;
  width: 100%;
}

.confirm-input {
  border-radius: 4px;
  background-color: rgba(0, 134, 204, 0.05);
  padding: 12px;
  color: #030303;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  width: 100%;
  box-sizing: border-box;
  word-break: break-all;

  .unit {
    float: right;
  }
}

.download-link-ok {
  color: #0086cc;
  font-size: 16px;
  margin: 30px 0 0;
  cursor: pointer;
}

.download-link-ng {
  color: #f06273;
  font-size: 16px;
  margin: 30px 0 0;
  cursor: pointer;
}

.notes {
  color: #000;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.8px;
  line-height: 1.5;
  text-align: center;
  margin: 10px 0 0;

  .link {
    color: #0086cc;
    font-size: 12px;
    text-decoration: none;
  }
}

.close-button {
  background-color: #fff;
  border-radius: 30px;
  border: 1px solid #0086cc;
  color: #0086cc;
  cursor: pointer;
  display: block;
  height: 37px;
  margin: 40px auto;
  width: 256px;
  outline: none;
}
</style>
