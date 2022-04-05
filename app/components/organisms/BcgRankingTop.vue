<template>
  <div class="area-category-ranking-container">
    <item-label :labelName="rankingLabel" :addLink="moreLink" :addText="moreText" />
    <div class="bcg-ranking">
      <bcg-ranking-list :indexCount="5" />
    </div>
    <item-label :labelName="articleLabel" :addLink="null" />
  </div>
</template>

<script>
import ItemLabel from '../atoms/ItemLabel'
import BcgRankingList from '../molecules/BcgRankingList'

export default {
  components: {
    ItemLabel,
    BcgRankingList
  },
  data() {
    return {
      rankingLabel: '人気ブロックチェーンゲーム',
      moreLink: '/category/game/bcg_ranking',
      moreText: 'もっと見る',
      articleLabel: 'ゲーム記事'
    }
  }
}
</script>

<style lang="scss" scoped>
.area-category-ranking-container {
  grid-area: ranking;
  margin: 30px 0 10px 0;
}
.bcg-ranking {
  margin: 25px 0 30px 0;
}
</style>
