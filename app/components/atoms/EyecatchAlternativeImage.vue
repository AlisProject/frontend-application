<template>
  <a
    :href="articlePath"
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
          return '/users/ALIS-official'
        case 'eyecatch3':
          return 'https://intercom.help/alismedia'
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
  box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.7);
  transition: box-shadow 400ms ease;

  &:hover {
    box-shadow: 0 0 16px 0 rgba(0, 134, 204, 0.5);

    &:active {
      box-shadow: 0 0 2px 0 rgba(0, 134, 204, 0.5);
    }
  }

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
