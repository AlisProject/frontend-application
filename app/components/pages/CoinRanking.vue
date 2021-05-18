<template>
  <div class="coin-ranking-container">
    <app-header />
    <default-header-nav />
    <coin-ranking />
    <app-footer />
  </div>
</template>

<script>
import AppHeader from '../organisms/AppHeader'
import DefaultHeaderNav from '../molecules/DefaultHeaderNav'
import CoinRanking from '../organisms/CoinRanking'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    DefaultHeaderNav,
    CoinRanking,
    AppFooter
  }
}
</script>

<style lang="scss" scoped>
.coin-ranking-container {
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "app-header              app-header              app-header             "
    "nav                     nav                     nav                    "
    "...                     ranking                 ...                    "
    "app-footer              app-footer              app-footer             ";
  grid-template-columns: minmax(0, 1fr) 1080px minmax(0, 1fr);
  grid-template-rows: 100px auto auto 75px;
  min-height: 100vh;
}

@media screen and (max-width: 1296px) {
  .coin-ranking-container {
    grid-template-columns: minmax(0, 1fr) 710px minmax(0, 1fr);
  }
}

@media screen and (max-width: 920px) {
  .coin-ranking-container {
    grid-template-columns: minmax(0, 1fr) 340px minmax(0, 1fr);
  }
}

@media screen and (max-width: 550px) {
  .coin-ranking-container {
    grid-template-columns: minmax(0, 1fr) 340px minmax(0, 1fr);
  }
}

@media screen and (max-width: 370px) {
  .coin-ranking-container {
    grid-template-columns: 10px minmax(0, 1fr) 10px;
  }
}
</style>
