<template>
  <div class="majority-judgement-container">
    <app-header />
    <h1 class="area-title">
      マジョリティ・ジャッジメント
    </h1>
    <!--    TODO: ここにテーブル作る-->
    <app-footer />
  </div>
</template>

<script>
import AppHeader from '../organisms/AppHeader'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    AppFooter
  }
}
</script>

<style lang="scss" scoped>
.majority-judgement-container {
  background-size: contain;
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header                              app-header"
    "...         title                                   ...       "
    "app-footer  app-footer                              app-footer";
  grid-template-columns: 1fr 460px 1fr;
  grid-template-rows: 100px 50px 1fr 75px;
  min-height: 100vh;
}

.area-title {
  font-size: 20px;
  grid-area: title;
  letter-spacing: 1.33px;
  margin: 0;
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
