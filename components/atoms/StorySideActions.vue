<template>
  <transition name="fade">
    <div class="story-side-actions" v-show="scrollY > 300">
      <div class="action like"></div>
      <div class="action twitter"></div>
      <div class="action bookmark"></div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      scrollY: 0
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.scrollY = window.scrollY
    }
  }
}
</script>

<style lang="scss" scoped>
.story-side-actions {
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  position: fixed;
  left: calc(50% - 450px);

  .action {
    background: white;
    border-radius: 50%;
    border: 1px solid #fefefe;
    box-shadow: 0px 5px 15px -1px #c1c1c1;
    height: 40px;
    margin-bottom: 20px;
    width: 40px;
  }

  .like {
    background: url('~assets/images/pc/story/icon_heart.png') no-repeat;
    background-color: #ff4949;
    background-size: 30px;
    background-position: 16px 20px;
    border-radius: 50%;
    border: 1px solid #ff4949;
    box-shadow: 0px 5px 15px -1px #ff8989;
    height: 62px;
    width: 62px;
  }

  .twitter {
    background: url('~assets/images/pc/story/icon_twitter.png') no-repeat;
    background-color: white;
    background-size: 26px;
    background-position: 9px 11px;
  }

  .bookmark {
    background: url('~assets/images/pc/story/icon_bookmark.png') no-repeat;
    background-color: white;
    background-size: 14px;
    background-position: 13px 9px;
  }
}

.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.3s;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }
}

@media screen and (max-width: 920px) {
  .story-side-actions {
    display: none;
  }
}
</style>
