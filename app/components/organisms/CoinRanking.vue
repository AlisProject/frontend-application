<template>
  <div class="area-category-ranking-container">
    <item-label :labelName="rankingLabel" :addLink="addLink" :addText="addText" />
    <div class="coin-ranking">
      <coin-ranking-list :indexCount="50" />
    </div>
    <div class="powered-by">
      <a href="https://www.coingecko.com/" target="_blank">
        Powered by CoinGecko API
      </a>
    </div>
  </div>
</template>

<script>
import ItemLabel from '../atoms/ItemLabel'
import CoinRankingList from '../molecules/CoinRankingList'

export default {
  components: {
    ItemLabel,
    CoinRankingList
  },
  data() {
    return {
      rankingLabel: '時価総額ランキング',
      addLink: null,
      addText: '戻る'
    }
  },
  mounted() {
    this.addLink = this.$nuxt.context.from
      ? this.$nuxt.context.from.fullPath
      : '/articles/popular?topic=crypto'
  }
}
</script>

<style lang="scss" scoped>
.area-category-ranking-container {
  grid-area: ranking;
  margin: 30px 0 40px 0;
}
.coin-ranking {
  margin: 25px 0 10px 0;
}
.powered-by {
  text-align: center;
  font-size: 14px;
  color: #6e6e6e;
  text-decoration: none;
}
.powered-by a {
  color: #6e6e6e;
  text-decoration: none;
}
</style>
