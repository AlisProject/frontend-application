<template>
  <div class="token-history-csv-download">
    <app-header />
    <h1 class="area-title">
      全トークン履歴のダウンロード
    </h1>
    <div class="area-description">
      <ul>
        <li>トークンの獲得や送受信に関わる全データをcsvでダウンロードできます</li>
      </ul>
      <ul>
        <li>ダウンロードの準備ができ次第、通知にてお知らせします</li>
      </ul>
      <ul>
        <li>csvファイルは通知のメッセージをクリックするとダウンロードできます</li>
      </ul>
      <ul>
        <li>
          csvファイルの中身の詳細に関しては<a
            href="https://alis.to/ALIS-official/articles/2Mqmy7Z7ngXP"
          >こちらの記事</a>をご参照ください。
        </li>
      </ul>
      <div v-if="recordNotFoundError" class="record-notfound-error-text">
        履歴情報が存在しないため処理を中断しました
      </div>
      <app-button
        class="create-csv-button"
        :disabled="isClicked"
        @click="CreateTokenHistoryAndNotify()"
      >
        csvを生成する
      </app-button>
    </div>
    <app-footer />
  </div>
</template>

<script>
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { mapActions } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import AppFooter from '../organisms/AppFooter'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppHeader,
    AppButton,
    AppFooter
  },
  data() {
    return {
      isLoading: true,
      isClicked: false,
      recordNotFoundError: false
    }
  },
  async mounted() {},
  computed: {},
  methods: {
    async CreateTokenHistoryAndNotify() {
      this.isClicked = true
      try {
        await this.CreateTokenHistory()
        this.sendNotification({
          text: 'csvの生成開始'
        })
      } catch (err) {
        this.recordNotFoundError = true
      }
    },
    ...mapActions('user', ['CreateTokenHistory']),
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    })
  }
}
</script>

<!--suppress CssInvalidPseudoSelector -->
<style lang="scss" scoped>
.token-history-csv-download {
  background-size: contain;
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header           app-header"
    "...         title                ...       "
    "...         description          ...       "
    "...         csvdownloadbutton    ...       "
    "app-footer  app-footer           app-footer";
  grid-template-columns: 1fr 460px 1fr;
  grid-template-rows: 100px 29px 141px 1fr 75px;
  min-height: 100vh;
}

.area-title {
  font-size: 20px;
  grid-area: title;
  letter-spacing: 1.33px;
  margin: 0;
}

.area-description {
  font-size: 14px;
  grid-area: description;
  letter-spacing: 1.33px;
  margin: 0;
}

_:lang(x) + _:-webkit-full-screen-document,
.area-description {
  font-size: 14px;
}

.area-label {
  font-size: 14px;
  grid-area: mute-user-card-list;
  letter-spacing: 1.33px;
  margin: 0;
}

.create-csv-button {
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
}

.record-notfound-error-text {
  color: #f06273;
  font-size: 14px;
  margin-bottom: -30px;
  text-align: center;
  cursor: pointer;
}

@media screen and (max-width: 920px) {
  .token-history-csv-download {
    grid-template-columns: 1fr 460px 1fr;
  }
}

@media screen and (max-width: 640px) {
  .token-history-csv-download {
    grid-template-columns: 1fr 340px 1fr;
    grid-template-rows: 100px 29px 183px 1fr 75px;
  }

  .area-title {
    font-size: 16px;
  }
}

@media screen and (max-width: 414px) {
  .token-history-csv-download {
    grid-template-columns: 10px 1fr 10px;
  }
}

@media screen and (max-width: 370px) {
  .token-history-csv-download {
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
