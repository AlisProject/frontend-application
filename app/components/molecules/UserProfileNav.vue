<template>
  <nav class="area-user-profile-nav">
    <nuxt-link class="user-profile-nav-item" :to="`/users/${$route.params.userId}`">
      公開中
    </nuxt-link>
    <nuxt-link
      v-if="isCurrentUser"
      class="user-profile-nav-item"
      :to="`/users/${$route.params.userId}/drafts`"
    >
      下書き
    </nuxt-link>
    <nuxt-link class="user-profile-nav-item" :to="`/users/${$route.params.userId}/badge`">
      バッジ
    </nuxt-link>
  </nav>
</template>

<script>
export default {
  props: {
    isCurrentUser: {
      type: Boolean
    }
  }
}
</script>

<style lang="scss" scoped>
.area-user-profile-nav {
  display: flex;
  grid-area: user-profile-nav;
  border-bottom: 1px solid #e6e6e6;

  .user-profile-nav-item {
    color: #6e6e6e;
    font-size: 12px;
    height: 20px;
    list-style: none;
    margin-right: 24px;
    text-align: center;
    text-decoration: none;
    width: 40px;

    &.nuxt-link-exact-active {
      color: #0086cc;
      border-bottom: 1px solid #0086cc;
    }
  }
}

@media screen and (max-width: 550px) {
  .area-user-profile-nav {
    border-top: 1px solid #e6e6e6;
    margin-bottom: 0;
    padding-left: 12px;

    .user-profile-nav-item {
      height: 22px;
      padding-top: 10px;
    }
  }
}
</style>
