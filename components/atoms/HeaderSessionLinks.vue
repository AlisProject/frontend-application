<template>
  <div class="session">
    <img class="search-icon" src="~assets/images/pc/common/icon_search.png" alt="search">
    <nuxt-link to="#" class="session-link sign-up">Sign up</nuxt-link>
    /
    <nuxt-link to="#" class="session-link login">Login</nuxt-link>
  </div>
</template>

<style lang="scss" scoped>
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
    width: 16px;
  }

  .session-link {
    color: #525256;
    text-decoration: none;
  }
}

@media screen and (max-width: 920px) {
  .story-container {
    .session {
      border: none;
      grid-area: session;
      padding: 0;
      position: static;
      right: -46px;
      top: 340px;
      transform: rotate(0);
      width: 160px;

      .search-icon {
        float: left;
        padding: 2px 4px;
        transform: rotate(0);
      }
    }
  }
}

@media screen and (max-width: 550px) {
  .session {
    border: none;
    grid-area: session;
    padding: 0;
    position: static;
    right: -46px;
    top: 340px;
    transform: rotate(0);
    width: 160px;

    .search-icon {
      float: left;
      padding: 2px 4px;
      transform: rotate(0);
    }
  }
}
</style>
