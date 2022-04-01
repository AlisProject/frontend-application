<template>
  <div class="area-category-ranking-container">
    <item-label :labelName="rankingLabel" :addLink="addLink" :addText="addText" />
    <div class="bcg-ranking">
      <bcg-ranking-list :indexCount="99" />
    </div>
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
      rankingLabel: 'BCG月間ランキング',
      addLink: '/articles/popular?topic=game',
      addText: '戻る'
    }
  }
}
</script>

<style lang="scss" scoped>
.area-category-ranking-container {
  grid-area: ranking;
  margin: 30px 0 40px 0;
}
.bcg-ranking {
  margin: 25px 0 10px 0;
}
</style>
