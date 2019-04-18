<template>
  <nav class="area-nav">
    <nuxt-link
      class="nav-content"
      :class="{ selected: selected === 'deposit' }"
      to="/me/wallet/deposit"
    >
      入金
    </nuxt-link>
    <nuxt-link
      class="nav-content"
      :class="{ selected: selected === 'withdraw' }"
      to="/me/wallet/withdraw"
    >
      出金
    </nuxt-link>
    <nuxt-link
      class="nav-content"
      :class="{ selected: selected === 'history' }"
      to="/me/wallet/history"
    >
      入出金履歴
    </nuxt-link>
  </nav>
</template>

<script>
export default {
  props: {
    selected: {
      type: String,
      validator(val) {
        return ['deposit', 'withdraw', 'history'].includes(val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.area-nav {
  grid-area: nav;
  display: flex;
  border-bottom: 1px solid #e6e6e6;

  .nav-content {
    color: #6e6e6e;
    font-size: 12px;
    height: 20px;
    letter-spacing: 1.2px;
    text-align: center;
    margin-right: 24px;
    text-decoration: none;

    &.selected {
      color: #0086cc;
      border-bottom: 1px solid #0086cc;
    }
  }
}
</style>
