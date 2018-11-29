<template>
  <div class="area-notification-card-image">
    <img
      class="profile-icon"
      src="~assets/images/pc/common/icon_like.png"
      v-if="notification.type === 'like'">
    <template
      v-if="notification.type === 'comment' ||
            notification.type === 'tip' ||
            notification.type === 'reply' ||
            notification.type === 'thread'">
      <img
        class="profile-icon"
        :src="notification.userInfo.icon_image_url"
        v-if="notification.userInfo.icon_image_url">
      <img
        class="profile-icon"
        src="~assets/images/pc/common/icon_user_noimg.png"
        v-else>
    </template>
    <div class="sub-icon comment" v-if="notification.type === 'comment'" />
    <div class="sub-icon tip" v-if="notification.type === 'tip'" />
    <div
      class="tip-error-icon"
      v-if="notification.type === 'tip_error'"/>
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
  align-items: flex-start;
  padding: 12px;
  position: relative;

  .profile-icon {
    border-radius: 50%;
    cursor: pointer;
    height: 40px;
    width: 40px;
  }

  .sub-icon {
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
    box-sizing: border-box;
    color: #0086cc;
    cursor: pointer;
    height: 16px;
    position: absolute;
    right: 12px;
    top: 36px;
    user-select: none;
    width: 16px;

    &.comment {
      background: #fff url('~assets/images/pc/notification/icon_notification_message.png') no-repeat;
      background-size: 10px;
      background-position-x: 3px;
      background-position-y: 3px;
    }

    &.tip {
      background: #fff url('~assets/images/pc/notification/icon_notification_present.png') no-repeat;
      background-size: 10px;
      background-position-x: 3px;
      background-position-y: 3px;
    }
  }

  .tip-error-icon {
    background: url('~assets/images/pc/notification/icon_exclamation.png') no-repeat;
    background-position: 17px;
    background-size: 6px;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid #f06273;
    height: 40px;
    width: 40px;
  }
}
</style>
