<template>
  <div class="area-footer-actions">
    <div class="action comment"></div>
    <div class="action bookmark"></div>
    <div class="action twitter"></div>
    <div class="action like">
      <span class="likes-count">{{ likesCount }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['likesCount']
}
</script>

<style lang="scss" scoped>
.area-footer-actions {
  display: grid;
  grid-area: footer-actions;
  grid-template-rows: 70px;
  grid-template-columns: repeat(4, 60px);
  justify-content: right;

  .action {
    border: 1px solid #fefefe;
    box-shadow: 0px 5px 15px -1px #c1c1c1;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .comment {
    background: url('~assets/images/pc/article/icon_comment.png') no-repeat;
    background-color: white;
    background-size: 20px;
    background-position: 10px 11px;
  }

  .bookmark {
    background: url('~assets/images/pc/article/icon_bookmark.png') no-repeat;
    background-color: white;
    background-size: 14px;
    background-position: 13px 9px;
  }

  .twitter {
    background: url('~assets/images/pc/article/icon_twitter.png') no-repeat;
    background-color: white;
    background-size: 26px;
    background-position: 9px 11px;
  }

  .like {
    background: url('~assets/images/pc/article/icon_heart.png') no-repeat;
    background-color: #ff4949;
    background-size: 20px;
    background-position: 10px 14px;
    border: 1px solid #ff4949;
    box-shadow: 0px 5px 15px -1px #ff8989;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: relative;

    .likes-count {
      color: #585858;
      font-size: 14px;
      position: absolute;
      top: -18px;
      left: 5px;
    }
  }
}

@media screen and (max-width: 640px) {
  .area-footer-actions {
    position: relative;

    &:after {
      bottom: 48px;
      box-shadow: 0 15px 10px -10px rgba(192, 192, 192, 0.5);
      content: '';
      height: 100px;
      opacity: 0.5;
      position: absolute;
      width: 100%;
    }

    .action {
      z-index: 1;
    }
  }
}
</style>
