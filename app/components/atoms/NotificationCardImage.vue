<template>
  <div class="area-notification-card-image">
    <img class="profile-icon" src="~assets/images/pc/article/btn_like_selected.png">
  </div>
</template>

<script>
export default {
  props: {
    iconUrl: {
      type: String,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
.area-notification-card-image {
  grid-area: notification-card-image;
  background: #fff;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;

  .profile-icon {
    border-radius: 50%;
    cursor: pointer;
    height: 80px;
    width: 80px;
  }

  @media screen and (max-width: 920px) {
    .profile-icon {
      height: 60px;
      width: 60px;
    }
  }
}
</style>
