<template>
  <div class="area-category-ranking-container">
    <item-label :labelName="rankingLabel" :addLink="moreLink" :addText="moreText" />
    <div class="coin-ranking">
      <coin-ranking-list :indexCount="5" />
    </div>
    <item-label :labelName="articleLabel" :addLink="null" />
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
      moreLink: '/category/crypto/coin_ranking',
      moreText: 'もっと見る',
      articleLabel: 'クリプト記事'
    }
  }
}
</script>

<style lang="scss" scoped>
.area-category-ranking-container {
  grid-area: ranking;
  margin: 30px 0 10px 0;
}
.coin-ranking {
  margin: 25px 0 30px 0;
}
</style>
