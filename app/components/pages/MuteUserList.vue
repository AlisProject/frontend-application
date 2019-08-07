<template>
  <div class="mute-user-list-container">
    <app-header />
    <h1 class="area-title">
      ミュートしたユーザー
    </h1>
    <div class="area-description">
      <ul>
        <li>ミュートの登録・解除が相手に知られることはありません。</li>
        <li>ミュート機能を使用すると、各種ランキングの順位が非使用時と変化しますのでご注意ください。</li>
        <li>ミュートしたユーザーの記事は一覧に表示されません。検索結果やその他の場所では表示される可能性があります。</li>
      </ul>
    </div>
    <mute-user-card-list v-if="muteUsers.length > 0" :muteUsers="muteUsers" />
    <div v-else class="area-label">
      現在ミュートしたユーザーは登録されていません
    </div>
    <app-footer />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import MuteUserCardList from '../organisms/MuteUserCardList'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    MuteUserCardList,
    AppFooter
  },
  async mounted() {
    await this.getMuteUsers()
  },
  computed: {
    ...mapGetters('article', ['articleContentEditHistories']),
    ...mapGetters('user', ['muteUsers'])
  },
  methods: {
    ...mapActions('user', ['getMuteUsers', 'deleteMuteUser'])
  }
}
</script>

<style lang="scss" scoped>
.mute-user-list-container {
  background-size: contain;
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header           app-header"
    "...         title                ...       "
    "...         description          ...       "
    "...         mute-user-card-list  ...       "
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
  font-size: 10px;
  grid-area: description;
  letter-spacing: 1.33px;
  margin: 0;
}

.area-label {
  font-size: 14px;
  grid-area: mute-user-card-list;
  letter-spacing: 1.33px;
  margin: 0;
}

@media screen and (max-width: 920px) {
  .mute-user-list-container {
    grid-template-columns: 1fr 460px 1fr;
  }
}

@media screen and (max-width: 640px) {
  .mute-user-list-container {
    grid-template-columns: 1fr 340px 1fr;
    grid-template-rows: 66px 40px 1fr min-content;
  }

  .area-title {
    font-size: 16px;
  }
}

@media screen and (max-width: 370px) {
  .mute-user-list-container {
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
