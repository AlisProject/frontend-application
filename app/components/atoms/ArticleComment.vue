<template>
  <div class="article-comment">
    <p class="body">{{comment.body}}</p>
    <div class="commented-user">
      <img class="commented-user-icon" src="~assets/images/profile-icon1.png">
      <ul class="info">
        <li>{{ comment.user.username }}</li>
        <li>{{ comment.createdAt }}</li>
      </ul>
    </div>
    <div class="action-like"></div>
  </div>
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.article-comment {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid rgba(192, 192, 192, 0.5);
  padding: 24px;
  position: relative;

  .body {
    color: #040404;
    font-size: 14.7px;
    font-weight: 500;
    line-height: 21px;
    margin-top: 0;
    padding-bottom: 40px;
  }

  .commented-user {
    bottom: 20px;
    color: #5b5b5b;
    font-size: 14px;
    position: absolute;

    .info {
      float: right;
      margin: 5px;
      padding: 0;
    }
  }

  .action-like {
    background: url('~assets/images/pc/article/icon_heart.png') no-repeat;
    background-color: #ff4949;
    background-size: 18px;
    background-position: 9px 11px;
    border-radius: 50%;
    border: 1px solid #ff4949;
    bottom: 20px;
    box-shadow: 0px 5px 15px -1px #ff8989;
    height: 35px;
    position: absolute;
    right: 24px;
    width: 35px;
  }
}

@media screen and (max-width: 640px) {
  .article-comment {
    padding: 12px;

    .body {
      color: #030303;
      font-size: 14px;
      line-height: 21px;
    }

    .commented-user {
      bottom: 10px;
    }

    .action-like {
      background-size: 16px;
      background-position: 7px 10px;
      bottom: 16px;
      height: 30px;
      right: 16px;
      width: 30px;
    }
  }
}
</style>
