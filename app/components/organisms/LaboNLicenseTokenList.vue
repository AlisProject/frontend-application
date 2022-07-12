<template>
  <div class="token-list-area">
    <div v-if="!tokenLoaded" class="token-list-loading">
      <i class="fa fa-spinner fa-spin" />
    </div>
    <div v-else-if="tokenLoaded && tokenIds.length <= 0" class="token-list-empty">
      所有するトークンがありません
    </div>
    <div v-else class="token-list">
      <span
        v-for="tokenId in tokenIds"
        class="token-list-element"
        @click="showCertificate(tokenId)"
      >
        <span class="token-icon fa fa-check-circle">Token{{ tokenId }}</span>
      </span>
    </div>
    <labo-n-license-token-certificate-modal v-if="laboLicenseTokenCertificateModal.isShow" />
    <labo-n-license-token-transfer-modal v-if="laboLicenseTokenTransferModal.isShow" />
  </div>
</template>

<script>
/* global Web3 */
import { mapActions, mapGetters } from 'vuex'

const LaboNLicenseTokenCertificateModal = () =>
  import('../organisms/LaboNLicenseTokenCertificateModal')
const LaboNLicenseTokenTransferModal = () => import('../organisms/LaboNLicenseTokenTransferModal')

export default {
  components: {
    LaboNLicenseTokenCertificateModal,
    LaboNLicenseTokenTransferModal
  },
  data() {
    return {
      tokenIds: [],
      tokenLoaded: false,
      abi: [
        {
          constant: true,
          inputs: [
            {
              name: 'owner',
              type: 'address'
            }
          ],
          name: 'balanceOf',
          outputs: [
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            {
              name: 'owner',
              type: 'address'
            },
            {
              name: 'index',
              type: 'uint256'
            }
          ],
          name: 'tokenOfOwnerByIndex',
          outputs: [
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['laboLicenseTokenCertificateModal', 'laboLicenseTokenTransferModal'])
  },
  async mounted() {
    this.tokenIds = await this.getOwnedTokenIds()
  },
  methods: {
    async getOwnedTokenIds() {
      const web3 = new Web3(window.ethereum)
      const account = window.ethereum.selectedAddress
      const licenseToken = new web3.eth.Contract(
        this.abi,
        process.env.PUBLIC_CHAIN_LICENSE_TOKEN_ADDRESS
      )
      const balanceOf = await licenseToken.methods.balanceOf(account).call()
      const tokenIds = []
      for (let i = 0; i < balanceOf; i++) {
        const tokenId = await licenseToken.methods.tokenOfOwnerByIndex(account, i).call()
        tokenIds.push(parseInt(tokenId))
      }
      this.tokenLoaded = true
      return tokenIds
    },
    showCertificate(tokenId) {
      this.setLaboLicenseTokenCertificateModalValues({ tokenId })
      this.setLaboLicenseTokenCertificateModal({ isShow: true })
    },
    ...mapActions('user', [
      'setLaboLicenseTokenCertificateModal',
      'setLaboLicenseTokenCertificateModalValues'
    ])
  }
}
</script>

<style lang="scss" scoped>
.token-list {
  font-size: 14px;
  letter-spacing: 0.8px;
  padding: 0;
  margin: 10px;
  line-height: 40px;
  cursor: pointer;
  list-style: none;
  word-break: keep-all;
  padding-left: 57px;

  .token-list-element {
    width: 102px;
    cursor: pointer;
    padding: 7px;
    margin-right: 5px;
    text-align: center;
    color: #0086cc;
    word-break: keep-all;
  }
}

.token-list-loading,
.token-list-empty {
  font-size: 16px;
  text-align: center;
}
</style>
