<template>
  <div class="majority-judgement-container">
    <app-header />
    <div class="area-mj">
      <the-loader v-if="isLoading" :isLoading="isLoading" class="area-title" />
      <template v-else>
        <h1 class="area-title">
          <!-- FIXME: 運用時はタイトル修正       -->
          マジョリティ・ジャッジメント(※現在無効)
        </h1>
        <div v-if="!exists" class="area-description">
          あなたが今後alis.toに必要または不要だと思うカテゴリーはどれですか？それぞれのカテゴリーに対して、選択肢のどれかを選択してください。
        </div>
        <div v-if="!exists" class="area-mj-grid">
          <labo-n-majority-judgement-grid
            :records="gridRecords"
            :columns="topicOptions"
            @level-changed="levelChanged"
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
import { mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import AppHeader from '~/components/organisms/AppHeader'
import TheLoader from '../atoms/TheLoader'
import LaboNMajorityJudgementGrid from '~/components/organisms/LaboNMajorityJudgementGrid'
import AppFooter from '~/components/organisms/AppFooter'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppHeader,
    TheLoader,
    LaboNMajorityJudgementGrid,
    AppFooter,
    AppButton
  },
  data() {
    return {
      isProcessing: false,
      exists: true,
      isLoading: true,
      topicOptions: [
        { key: 'record_header', text: '' },
        { key: 'opt1', text: 'テクノロジー' },
        { key: 'opt2', text: '神仏' },
        { key: 'opt3', text: '音楽' },
        { key: 'opt4', text: '恋愛・出会い' },
        { key: 'opt5', text: 'おもしろ' }
      ],
      gridRecords: [
        { level: 1, text: '絶対に必要' },
        { level: 2, text: 'かなり必要' },
        { level: 3, text: 'やや必要' },
        { level: 4, text: 'どちらでもない' },
        { level: 5, text: 'やや不要' },
        { level: 6, text: 'かなり不要' },
        { level: 7, text: '絶対に不要' }
      ],
      selectedLevels: {
        opt1: null,
        opt2: null,
        opt3: null,
        opt4: null,
        opt5: null
      }
    }
  },
  async mounted() {
    try {
      const result = await this.$axios.$get('/laboratory/labo/n/majority_judgement')
      this.exists = result.exists
    } catch (e) {
      console.log(e)
    } finally {
      this.isLoading = false
    }
  },
  computed: {
    isInvalid() {
      return !Object.values(this.selectedLevels).every((value) => value)
    }
  },
  methods: {
    levelChanged(target) {
      this.selectedLevels[target.key] = target.value
    },
    async onSubmit() {
      try {
        if (this.isInvalid || this.isProcessing) return
        this.isProcessing = true
        const { opt1, opt2, opt3, opt4, opt5 } = this.selectedLevels
        await this.postMajorityJudgement({ opt1, opt2, opt3, opt4, opt5 })
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
    ...mapActions('user', ['postMajorityJudgement'])
  }
}
</script>

<style lang="scss" scoped>
.majority-judgement-container {
  background-size: contain;
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header  app-header"
    "...         ...         ...       "
    "mj          mj          mj        "
    "app-footer  app-footer  app-footer";
  grid-template-columns: 1fr 460px 1fr;
  grid-template-rows: 100px 50px 1fr 75px;
  min-height: 100vh;
}

.area-mj {
  display: grid;
  grid-area: mj;
  grid-template-columns: auto;
  grid-gap: 30px;
  justify-items: center;
  grid-template-rows:
    15px
    30px
    330px
    1fr;
  /* prettier-ignore */
  grid-template-areas:
    'title'
    'description'
    'mj-grid'
    'submit-button';
}

.area-title {
  font-size: 20px;
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

.area-mj-grid {
  display: grid;
  grid-area: mj-grid;
}

@media screen and (max-width: 920px) {
  .majority-judgement-container {
    grid-template-columns: 1fr 460px 1fr;
  }
}

@media screen and (max-width: 640px) {
  .majority-judgement-container {
    grid-template-columns: 1fr 340px 1fr;
    grid-template-rows: 66px 40px 1fr min-content;
  }

  .area-title {
    font-size: 16px;
  }
}

@media screen and (max-width: 370px) {
  .majority-judgement-container {
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
