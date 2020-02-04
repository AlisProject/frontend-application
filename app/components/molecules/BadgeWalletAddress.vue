<template>
  <div class="area-wallet-address">
    <span>
      ETHアカウント:
    </span>
    <a target="”_blank”" :href="`https://etherscan.io/address/${walletAddress}`">
      {{ walletAddress.slice(0, 5) }}...{{ walletAddress.slice(-3) }}
    </a>
    <i class="fa fa-times-circle wallet-address-remove" @click="walletaddressDelete()" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  computed: {
    ...mapGetters('badge', ['walletAddress'])
  },
  methods: {
    async walletaddressDelete() {
      const isOk = confirm('ETHアカウントの連携を解除してもよろしいですか？')
      if (!isOk) return
      try {
        if (this.isProcessing) return
        this.isProcessing = true
        await this.unregisterWalletAddress()
        this.sendNotification({ text: 'ETHアカウントの連携を解除しました' })
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
    ...mapActions('badge', ['unregisterWalletAddress'])
  }
}
</script>

<style lang="scss" scoped>
.area-wallet-address {
  grid-area: wallet-address;
  text-align: right;
  color: #6e6e6e;
  font-size: 11px;
  margin: 14.5px 0 0;
}

.wallet-address-remove {
  color: #0086cc;
  cursor: pointer;
}

@media screen and (max-width: 550px) {
  .area-wallet-address {
    display: none;
  }
}
</style>
