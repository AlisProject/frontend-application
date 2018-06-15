<template>
  <div class="area-notification-card-image">
    <img class="profile-icon" src="~assets/images/pc/common/icon_like.png">
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
