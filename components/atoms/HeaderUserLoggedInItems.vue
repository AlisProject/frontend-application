<template>
  <div class="logged-in" v-show="this.$store.state.user.loggedIn">
    <img class="profile-icon" src="~assets/images/profile-icon1.png">
    <img class="notification-icon" src="~assets/images/notification.png">
    <img class="search-icon" src="~assets/images/search.png">
  </div>
</template>

<style lang="scss" scoped>
.logged-in {
  border-top: 6px solid #4a4a4a;
  padding-top: 30px;
  position: fixed;
  right: -14px;
  top: 340px;
  transform: rotate(90deg);
  width: 102px;

  .profile-icon {
    float: left;
    padding: 4px;
    transform: rotate(-90deg);
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  .notification-icon {
    float: left;
    padding-right: 4px;
    transform: rotate(-90deg);
  }

  .search-icon {
    float: left;
    padding: 7px 4px;
    transform: rotate(-90deg);
  }
}
</style>
