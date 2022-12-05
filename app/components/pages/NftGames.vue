<template>
  <div class="bcg-ranking-container">
    <app-header />
    <bcg-ranking />
    <app-footer />
  </div>
</template>

<script>
import AppHeader from '../organisms/AppHeader'
import BcgRanking from '../organisms/BcgRanking'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    BcgRanking,
    AppFooter
  }
}
</script>

<style lang="scss" scoped>
.bcg-ranking-container {
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "app-header              app-header              app-header             "
    "...                     ranking                 ...                    "
    "app-footer              app-footer              app-footer             ";
  grid-template-columns: minmax(0, 1fr) 1080px minmax(0, 1fr);
  grid-template-rows: 100px minmax(0, auto) 75px;
  min-height: 100vh;
}

@media screen and (max-width: 1296px) {
  .bcg-ranking-container {
    grid-template-columns: minmax(0, 1fr) 1080px minmax(0, 1fr);
  }
}

@media screen and (max-width: 1080px) {
  .bcg-ranking-container {
    grid-template-columns: 32px minmax(0, 1fr) 32px;
  }
}

@media screen and (max-width: 550px) {
  .bcg-ranking-container {
    grid-template-columns: 0 minmax(0, 1fr) 0;
    grid-template-rows: 100px minmax(0, auto) min-content;
  }
}
</style>
