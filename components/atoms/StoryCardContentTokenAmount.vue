<template>
  <p class="token-amount">{{ formattedTokenAmount }}</p>
</template>

<script>
export default {
  props: ['tokenAmount'],
  computed: {
    formattedTokenAmount() {
      return this.tokenAmount > 999 ? (this.tokenAmount / 1000).toFixed(2) + 'k' : this.tokenAmount
    }
  }
}
</script>

<style lang="scss" scoped>
.token-amount {
  background: url('~assets/images/alis-icon-mini.png') no-repeat;
  bottom: 20px;
  color: #717171;
  font-size: 12px;
  height: 22px;
  margin: 0;
  padding: 3px 0 0 25px;
  position: absolute;
  right: 24px;
}

.long-story-card {
  .token-amount {
    bottom: 25px;
    font-size: 14px;
    position: absolute;
    right: 28px;
  }
}
@media screen and (max-width: 1296px) {
  .long-story-card {
    .token-amount {
      bottom: 10px;
      right: 20px;
    }
  }
}
</style>
