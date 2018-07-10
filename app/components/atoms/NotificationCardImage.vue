<template>
  <div class="area-notification-card-image">
    <img
      class="profile-icon"
      src="~assets/images/pc/common/icon_like.png"
      v-if="notification.type === 'like'">
    <img
      class="profile-icon"
      :src="notification.userInfo.icon_image_url"
      v-if="notification.type === 'comment' && notification.userInfo.icon_image_url">
    <img
      class="profile-icon"
      src="~assets/images/pc/common/icon_user_noimg.png"
      v-if="notification.type === 'comment' && !notification.userInfo.icon_image_url">
  </div>
</template>

<script>
export default {
  props: {
    notification: {
      type: Object
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
  justify-content: flex-end;
  align-items: center;
  padding: 10px;

  .profile-icon {
    border-radius: 50%;
    cursor: pointer;
    height: 64px;
    width: 64px;
  }
}

@media screen and (max-width: 640px) {
  .area-notification-card-image {
    padding: 0px;

    .profile-icon {
      height: 40px;
      width: 40px;
    }
  }
}
</style>
