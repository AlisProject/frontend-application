<template>
  <header class="area-app-header-container">
    <nuxt-link to="/" class="area-logo">logo here</nuxt-link>
    <default-header-nav v-show="showDefaultHeaderNav"/>
    <edit-header-nav v-show="showEditHeaderNav" :showPostStoryLink="showPostStoryLink"/>
    <div class="session" v-show="!this.$store.state.user.loggedIn">
      <img class="search-icon" src="~assets/images/search.png" alt="search">
      <nuxt-link to="#" class="session-link sign-up">Sign up</nuxt-link>
      /
      <nuxt-link to="#" class="session-link login">Login</nuxt-link>
    </div>
    <div class="logged-in" v-show="this.$store.state.user.loggedIn">
      <img class="profile-icon" src="~assets/images/profile-icon1.png">
      <img class="notification-icon" src="~assets/images/notification.png">
      <img class="search-icon" src="~assets/images/search.png">
    </div>
  </header>
</template>

<script>
import DefaultHeaderNav from '../molecules/DefaultHeaderNav'
import EditHeaderNav from '../molecules/EditHeaderNav'

export default {
  props: {
    showDefaultHeaderNav: {
      type: Boolean,
      default: false
    },
    showEditHeaderNav: {
      type: Boolean,
      default: false
    },
    showPostStoryLink: {
      type: Boolean,
      default: false
    }
  },
  components: {
    DefaultHeaderNav,
    EditHeaderNav
  }
}
</script>


<style lang="scss" scoped>
.area-app-header-container {
  display: grid;
  grid-area: app-header;
  grid-template-rows: 100px;
  grid-template-columns: 100px 1fr 100px;
  /* prettier-ignore */
  grid-template-areas:
    "logo nav";
  position: relative;
}

.area-logo {
  grid-area: logo;
}

.session {
  border-top: 6px solid #4a4a4a;
  padding-top: 38px;
  position: fixed;
  right: -49px;
  text-align: right;
  top: 340px;
  transform: rotate(90deg);
  width: 162px;

  .search-icon {
    float: left;
    padding-right: 4px;
    transform: rotate(-90deg);
  }

  .session-link {
    color: #525256;
    font-family: YuGothic;
    text-decoration: none;
  }
}

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
