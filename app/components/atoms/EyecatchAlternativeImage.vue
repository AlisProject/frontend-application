<template>
  <nuxt-link
    :to="articlePath"
    class="eyecatch-alternative-image-container"
    :class="order"/>
</template>

<script>
export default {
  props: {
    order: {
      type: String,
      required: true
    }
  },
  computed: {
    articlePath() {
      switch (this.order) {
        case 'eyecatch1':
          return '#1'
        case 'eyecatch2':
          return '#2'
        case 'eyecatch3':
          return '#3'
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.eyecatch-alternative-image-container {
  border-radius: 4px;

  &.eyecatch1 {
    grid-area: eyecatch1;
    background: url('~assets/images/pc/common/img_Instructions.png') no-repeat;
  }

  &.eyecatch2 {
    grid-area: eyecatch2;
    background: url('~assets/images/pc/common/img_anounce.png') no-repeat;
  }

  &.eyecatch3 {
    grid-area: eyecatch3;
    background: url('~assets/images/pc/common/img_FAQ.png') no-repeat;
  }
}
</style>
