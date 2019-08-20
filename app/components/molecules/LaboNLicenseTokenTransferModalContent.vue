<template>
  <div class="license-token-transfer-modal-content-container">
    <h1 class="title">
      ライセンストークンを送る
    </h1>
    <p class="description">
      トークンを送る宛先を入力して下さい。
    </p>
    <div class="label">
      トークンID
    </div>
    <div class="confirm-input">
      {{ tokenId }}
    </div>
    <div class="address-input-box">
      <div class="label" v-text="'宛先'" />
      <input
        :value="address"
        class="address-input"
        :class="{ error: addressErrorMessage }"
        type="text"
        placeholder="0x98105Ee422f3d690C612..."
        @input="onInputAddress"
      >
      <span class="error-message">
        {{ addressErrorMessage }}
      </span>
    </div>

    <app-button class="to-next-step-button" :disabled="!isValidAddress()" @click="onSubmit">
      MetaMaskで送る
    </app-button>
  </div>
</template>

<script>
/* global Web3 */
import { mapGetters, mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  },
  data() {
    return {
      address: '',
      addressErrorMessage: '',
      abi: [
        {
          constant: false,
          inputs: [
            {
              name: 'from',
              type: 'address'
            },
            {
              name: 'to',
              type: 'address'
            },
            {
              name: 'tokenId',
              type: 'uint256'
            }
          ],
          name: 'transferFrom',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ]
    }
  },
  computed: {
    tokenId() {
      return this.laboLicenseTokenTransferModal.tokenId
    },
    ...mapGetters('user', ['laboLicenseTokenTransferModal'])
  },
  methods: {
    isValidAddress() {
      return this.address !== '' && this.addressErrorMessage === ''
    },
    onInputAddress(event) {
      this.address = event.target.value
      if (this.address === '') {
        this.addressErrorMessage = ''
        return
      }
      const addressPattern = /^0x[0-9a-fA-F]{40}$/
      if (!addressPattern.test(this.address)) {
        this.addressErrorMessage = 'アドレスの形式が正しくありません'
        return
      }
      this.addressErrorMessage = ''
    },
    async onSubmit() {
      try {
        await this.transfer()

        this.sendNotification({
          text: 'トランザクションを発行しました。詳細はMETAMASKでご確認ください'
        })

        this.closeModal()
      } catch (error) {
        // トランザクション発行をキャンセルしたため何もしない
      }
    },
    async transfer() {
      return new Promise((resolve, reject) => {
        const web3 = new Web3(window.ethereum)
        const licenseToken = new web3.eth.Contract(
          this.abi,
          process.env.PUBLIC_CHAIN_LICENSE_TOKEN_ADDRESS
        )
        const account = window.ethereum.selectedAddress // MetaMaskで選択中のアカウント

        licenseToken.methods
          .transferFrom(account, this.address, this.tokenId)
          .send({
            from: account
          })
          .on('transactionHash', (hash) => {
            resolve(hash)
          })
          .on('error', (err) => {
            reject(err)
          })
      })
    },
    closeModal() {
      this.setLaboLicenseTokenTransferModal({ isShow: false })
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('user', ['setLaboLicenseTokenTransferModal'])
  }
}
</script>

<style lang="scss" scoped>
.license-token-transfer-modal-content-container {
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
  width: 400px;
  box-sizing: border-box;
  word-break: break-all;

  .unit {
    float: right;
  }
}

.address-input {
  appearance: none;
  border: 0;
  box-shadow: 0 0 8px 0 rgba(192, 192, 192, 0.5);
  box-sizing: border-box;
  color: #030303;
  font-size: 14px;
  line-height: 28px;
  padding: 10px 12px;
  width: 400px;
  margin-bottom: 8px;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::-webkit-input-placeholder {
    color: #cecece;
  }

  &:focus {
    outline: 0;
  }

  &.error {
    box-shadow: 0 0 8px 0 rgba(240, 98, 115, 0.5);
  }
}

.error-message {
  color: #f06273;
  display: block;
  font-size: 12px;
  margin-bottom: 2px;
  min-height: 16px;
  text-align: right;
  width: 100%;
}

.to-next-step-button {
  margin: 30px auto;
}
</style>
