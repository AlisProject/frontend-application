<template>
  <img
    class="area-profile-icon"
    :src="user.icon_image_url"
    :alt="`${user.user_display_name}'s icon'`">
</template>

<script>
export default {
  props: ['user']
}
</script>

<style lang="scss" scoped>
.area-profile-icon {
  grid-area: profile-icon;
  height: 36px;
  width: 36px;
  border-radius: 50%;
}
</style>
