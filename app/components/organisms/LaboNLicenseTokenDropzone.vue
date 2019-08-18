<template>
  <div>
    <dropzone id="license-token-dropzone" ref="el" :options="options" :destroyDropzone="true" />
    <div class="mint-amount-area">
      発行数
      <select id="mint-amount">
        <option v-for="i in 10" :value="i">
          {{ i }}
        </option>
      </select>
      個
    </div>
  </div>
</template>

<script>
/* global Web3 */
import { mapActions, mapGetters } from 'vuex'
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  components: {
    Dropzone
  },
  data() {
    return {
      maxFileSize: 52428800,
      options: {
        url: 'none',
        dictDefaultMessage:
          'ここにファイルをドラッグ&ドロップして、そのファイルをダウンロードできるライセンストークンを発行できます。'
      },
      abi: [
        {
          constant: false,
          inputs: [
            {
              name: 'contentDigest',
              type: 'uint256'
            },
            {
              name: 'amount',
              type: 'uint256'
            }
          ],
          name: 'bulkMint',
          outputs: [
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser'])
  },
  async mounted() {
    const dropzone = this.$refs.el.dropzone

    // NOTICE
    // Dropzoneのデフォルトの挙動では、ファイルをドロップするとoptionsに指定したurlにpostしてしまう。
    // 独自の処理が必要なので、acceptメソッドをフックすることで、デフォルトの挙動を抑制している。
    dropzone.accept = async (file, done) => {
      if (!this.currentUser || !this.currentUser.phoneNumberVerified) {
        this.sendNotification({
          text: 'トークンを発行するにはログインと電話番号認証をして下さい',
          type: 'warning'
        })
        dropzone.removeAllFiles(true)
        return
      }

      if (file.size >= this.maxFileSize) {
        this.sendNotification({
          text: `ファイルサイズの上限値${Math.floor(this.maxFileSize / 1000000)}MBを超えています`, // MB単位で表示
          type: 'warning'
        })
        dropzone.removeAllFiles(true)
        return
      }

      try {
        await this.uploadFileAndMintToken(file)
      } catch (err) {
        this.sendNotification({
          text: 'トークンの発行に失敗しました',
          type: 'warning'
        })
        dropzone.removeAllFiles(true)
        return
      }

      file.status = Dropzone.SUCCESS
      dropzone.emit('success', file)
      dropzone.emit('complete', file)

      this.sendNotification({
        text: 'トランザクションを発行しました。詳細はMETAMASKでご確認ください'
      })

      dropzone.removeAllFiles(true)
    }
  },
  methods: {
    async uploadFileAndMintToken(file) {
      const data = await this.getDataFromFile(file)
      const contentDigest = this.calcDigest(data)

      let uploadUrl
      try {
        uploadUrl = await this.getUploadUrl(contentDigest, file.name, file.size)
      } catch (error) {
        if (error.response.data.message === 'Invalid parameter: Content digest is duplicated.') {
          // NOTICE ファイルが既にアップロード済みのため、トークン発行のみ行う
          await this.mintToken(contentDigest)
          return
        }
        throw error
      }

      await this.uploadFile(uploadUrl, file)
      await this.mintToken(contentDigest)
    },
    getDataFromFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.addEventListener('load', function() {
          resolve(reader.result)
        })
      })
    },
    calcDigest(data) {
      const web3 = new Web3()
      return web3.utils.keccak256(data)
    },
    async getUploadUrl(contentDigest, uploadFileName, uploadFileSize) {
      const response = await this.getLicenseTokenFileUploadUrl({
        contentDigest,
        uploadFileName,
        uploadFileSize
      })
      return response.upload_url
    },
    async uploadFile(uploadUrl, file) {
      // NOTICE
      // axiosでリクエストのデフォルトヘッダーにAuthorizationをセットしているため、S3側が400エラーになってしまう。
      // このリクエストのみヘッダーからAuthorizationを削除する方法が見当たらないため、
      // 一時的にデフォルトヘッダーからAuthorizationを削除して、
      // このリクエストの送信を終えたらデフォルトヘッダーのAuthorizationを元の値をセットし直している。
      const authorization = this.$axios.defaults.headers.common.Authorization
      delete this.$axios.defaults.headers.common.Authorization
      try {
        await this.$axios.$put(uploadUrl, file, {
          headers: { 'Content-Type': 'application/octet-stream' }
        })
      } finally {
        this.$axios.defaults.headers.common.Authorization = authorization
      }
    },
    async mintToken(contentDigest) {
      return new Promise((resolve, reject) => {
        const web3 = new Web3(window.ethereum)
        const licenseToken = new web3.eth.Contract(
          this.abi,
          process.env.PUBLIC_CHAIN_LICENSE_TOKEN_ADDRESS
        )
        const account = window.ethereum.selectedAddress // MetaMaskで選択中のアカウント
        const amount = parseInt(document.querySelector('#mint-amount').value)

        licenseToken.methods
          .bulkMint(contentDigest, amount)
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
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('user', ['getLicenseTokenFileUploadUrl'])
  }
}
</script>

<style lang="scss" scoped>
.mint-amount-area {
  margin-top: 10px;
  text-align: right;
}
</style>
