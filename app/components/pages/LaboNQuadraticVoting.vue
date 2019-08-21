<template>
  <div class="quadratic-voting-container">
    <app-header />
    <div class="area-qv">
      <template v-if="!loginUser">
        本機能のご利用にはログインしていただく必要があります。
      </template>
      <template v-else-if="!phoneNumberVerifiedUser">
        本機能のご利用には電話番号認証をしていただく必要があります。
      </template>
      <template v-else-if="!isAvailable">
        本機能は現在無効です。
      </template>
      <template v-else-if="isLoading">
        <i v-if="isLoading" class="fa fa-spinner fa-pulse fa-fw" />
      </template>
      <template v-else>
        <h1 class="area-title">
          Quadratic Voting
        </h1>
        <div v-if="!exists" class="area-description">
          2020年度のALIS Projectの運営方針としてあなたが望ましいものは何ですか？
        </div>
        <div v-if="!exists" class="area-credit">
          <span v-if="isInvalid" class="over-credit-text">※クレジットが足りません</span>
          残クレジット:
          <span>{{ remainingCredit }}</span>
        </div>
        <div v-if="!exists" class="area-qv-grid">
          <labo-n-quadratic-voting-grid
            :records="gridRecords"
            :columns="columns"
            :votedValues="votedValues"
            @value-changed="valueChanged"
          />
        </div>
        <div v-if="!exists" class="area-submit-button">
          <app-button
            class="save-button"
            :isLoading="isProcessing"
            :disabled="isInvalid || isProcessing"
            @click="onSubmit"
          >
            保存する
          </app-button>
        </div>
        <div v-if="exists">
          ご回答いただきありがとうございました。結果は後ほど共有いたしますので楽しみにお待ち下さい😉
        </div>
      </template>
    </div>
    <app-footer />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import AppHeader from '~/components/organisms/AppHeader'
import LaboNQuadraticVotingGrid from '~/components/organisms/LaboNQuadraticVotingGrid'
import AppFooter from '~/components/organisms/AppFooter'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppHeader,
    LaboNQuadraticVotingGrid,
    AppFooter,
    AppButton
  },
  data() {
    return {
      isProcessing: false,
      loginUser: true,
      phoneNumberVerifiedUser: true,
      exists: true,
      isLoading: true,
      columns: [
        { key: 'record_header', text: '運営方針' },
        { key: 'voting', text: '投票' },
        { key: 'spent_credit', text: '消費クレジット' }
      ],
      gridRecords: [
        { option: 'opt1', text: '暗号通貨ALISが使える場所やサービスを増やす' },
        { option: 'opt2', text: '広告を出稿してユーザー数を増やす' },
        { option: 'opt3', text: 'とにかく機能を充実させる' },
        { option: 'opt4', text: 'ToBビジネスに注力する' },
        { option: 'opt5', text: 'すべての機能をEthereumパブリックチェーンへ移行' },
        { option: 'opt6', text: 'R&DでEthereumやBlockchainのエコシステムへ貢献' }
      ],
      votedValues: {
        opt1: 0,
        opt2: 0,
        opt3: 0,
        opt4: 0,
        opt5: 0,
        opt6: 0
      }
    }
  },
  async mounted() {
    try {
      await this.getUserSession()
    } catch (e) {
      this.loginUser = false
      return
    }

    if (!this.currentUser.phoneNumberVerified) {
      this.phoneNumberVerifiedUser = false
      return
    }

    try {
      const result = await this.$axios.$get('/laboratory/labo/n/quadratic_voting')
      this.exists = result.exists
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoading = false
    }
  },
  computed: {
    isInvalid() {
      return this.remainingCredit < 0
    },
    isAvailable() {
      // 運用時にtrueを返し、フラグを立てる
      // return true

      // stgでのみ有効
      return !this.isProduction
    },
    ...mapGetters('user', ['loggedIn', 'currentUser']),
    isProduction() {
      return process.env.ALIS_APP_ID === 'alis'
    },
    remainingCredit() {
      let totalVotedValue = 0
      for (const key in this.votedValues) {
        totalVotedValue += this.votedValues[key] ** 2
      }

      // TODO: refactoring
      return 100 - totalVotedValue
    }
  },
  methods: {
    valueChanged(target) {
      this.votedValues[target.option] = target.value
    },
    async onSubmit() {
      try {
        if (this.isInvalid || this.isProcessing) return
        this.isProcessing = true
        // TODO: リファクタリング
        const { opt1, opt2, opt3, opt4, opt5, opt6 } = this.votedValues
        await this.postQuadraticVoting({ opt1, opt2, opt3, opt4, opt5, opt6 })
        this.sendNotification({ text: '選択を保存しました' })
        this.exists = true
      } catch (error) {
        const statusCode = error.response.status
        if (statusCode >= 400 && statusCode < 500) {
          this.sendNotification({
            text: '登録に失敗しました。入力内容をご確認ください',
            type: 'warning'
          })
        } else if (statusCode <= 500) {
          this.sendNotification({
            text: 'エラーが発生しました。しばらく時間を置いて再度お試しください',
            type: 'warning'
          })
        }
      } finally {
        this.isProcessing = false
      }
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('user', ['postQuadraticVoting', 'getUserSession'])
  }
}
</script>

<style lang="scss" scoped>
.quadratic-voting-container {
  background-size: contain;
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header  app-header"
    "...         ...         ...       "
    "qv          qv          qv        "
    "app-footer  app-footer  app-footer";
  grid-template-columns: 1fr 460px 1fr;
  grid-template-rows: 100px 50px 1fr 75px;
  min-height: 100vh;
}

.area-qv {
  display: grid;
  grid-area: qv;
  grid-template-columns: auto;
  grid-gap: 30px;
  justify-items: center;
  grid-template-rows:
    20px
    30px
    0
    348px
    1fr;
  /* prettier-ignore */
  grid-template-areas:
    'title'
    'description'
    'credit'
    'qv-grid'
    'submit-button';
}

.area-title {
  font-size: 28px;
  grid-area: title;
  letter-spacing: 1.33px;
  margin: 0;
}

.area-description {
  font-size: 15px;
  grid-area: description;
  letter-spacing: 1.33px;
  margin: 0;
}

.area-credit {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding-top: 23px;
  width: 709px;
  font-size: 23px;
  grid-area: credit;
  letter-spacing: 1.33px;
  margin: 0;

  .over-credit-text {
    color: red;
    margin-right: 10px;
    font-size: 15px;
  }
}

.area-qv-grid {
  display: grid;
  grid-area: qv-grid;
}

/* iPad */
@media screen and (max-width: 1024px) {
  .area-description {
    margin: 40px 30px;
  }

  .area-qv {
    grid-template-rows:
      25px
      69px
      0
      388px
      1fr;
  }
}

/* iPhone XS MAX, XR, Plus */
@media screen and (max-width: 414px) {
  .quadratic-voting-container {
    grid-template-columns: 7px 400px 7px;
    grid-template-rows: 50px 50px 1fr 75px;
  }

  .area-qv {
    grid-template-rows: 0 67px 0 285px 1fr;
  }

  .area-credit {
    width: 100%;
  }
}

/* iPhone X */
@media screen and (max-width: 375px) {
  .quadratic-voting-container {
    grid-template-columns: 7px 361px 7px;
  }

  .area-qv {
    grid-template-rows: 24px 64px 0 312px 1fr;
  }

  .area-credit {
    font-size: 15px;
  }
}

@media screen and (max-width: 320px) {
  .quadratic-voting-container {
    grid-template-columns: 10px 1fr 10px;
  }

  .area-qv {
    grid-template-rows: 1px 63px 0 450px 1fr;
  }
}
</style>
