<template>
  <div class="area-notification-card-image">
    <img
      v-if="notification.type === 'like'"
      class="profile-icon"
      src="~assets/images/pc/common/icon_like.png"
    >
    <img
      v-else-if="notification.type === 'announce'"
      class="profile-icon"
      src="~assets/images/pc/notification/icon_announce.png"
    >
    <img
      v-else-if="notification.type === 'csvdownload'" 
      class="profile-icon"
      src="~assets/images/pc/notification/icon_download.png"
    >
    <template
      v-if="
        notification.type === 'comment' ||
          notification.type === 'tip' ||
          notification.type === 'reply' ||
          notification.type === 'thread' ||
          notification.type === 'purchased'
      "
    >
      <img
        v-if="notification.userInfo.icon_image_url"
        class="profile-icon"
        :src="notification.userInfo.icon_image_url"
      >
      <img v-else class="profile-icon" src="~assets/images/pc/common/icon_user_noimg.png">
    </template>
    <div v-if="notification.type === 'comment'" class="sub-icon comment" />
    <div v-if="notification.type === 'tip'" class="sub-icon tip" />
    <div
      v-if="notification.type === 'tip_error' || notification.type === 'purchase_error'"
      class="tip-error-icon"
    />
    <img
      v-if="notification.type === 'purchase'"
      class="profile-icon"
      src="~assets/images/pc/notification/icon_notification_check.png"
    >
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
  align-items: flex-start;
  background: #fff;
  border-radius: 4px;
  display: flex;
  justify-content: flex-end;
  overflow: hidden;
  padding: 12px;
  position: relative;

  .profile-icon {
    border-radius: 50%;
    cursor: pointer;
    height: 40px;
    width: 40px;
    object-fit: cover;
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
