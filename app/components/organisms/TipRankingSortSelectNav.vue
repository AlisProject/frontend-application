<template>
  <div class="area-tip-ranking-sort-select-nav">
    <nuxt-link
      class="nav-link"
      :class="{ selected: isSortedByDate }"
      :to="datePath"
    >
      日時
    </nuxt-link>
    <nuxt-link
      class="nav-link"
      :class="{ selected: isSortedByTotal }"
      :to="totalPath"
    >
      総合
    </nuxt-link>
  </div>
</template>

<script>
export default {
  computed: {
    datePath() {
      const { path } = this.$route
      return { path, query: { sort: 'date' } }
    },
    totalPath() {
      const { path } = this.$route
      return { path, query: { sort: 'total' } }
    },
    isSortedByDate() {
      const sort = this.$route.query.sort || ''
      return sort === 'date' || sort === ''
    },
    isSortedByTotal() {
      const sort = this.$route.query.sort
      return sort === 'total'
    }
  }
}
</script>

<style lang="scss" scoped>
.area-tip-ranking-sort-select-nav {
  grid-area: tip-ranking-sort-select-nav;
  display: flex;
  align-self: center;
  justify-self: center;
}

.nav-link {
  color: #6e6e6e;
  font-size: 12px;
  letter-spacing: 0.8px;
  margin: 14px;
  padding: 4px 22px;
  text-decoration: none;

  &.selected {
    border-radius: 10px;
    background-color: #0086cc;
    color: #fff;
  }
}
</style>
