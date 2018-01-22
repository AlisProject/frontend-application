<template>
  <header class="area-app-header-container">
    <nuxt-link to="/" class="area-logo">logo here</nuxt-link>
    <default-header-nav v-show="showDefaultHeaderNav"/>
    <edit-header-nav v-show="showEditHeaderNav" :showPostStoryLink="showPostStoryLink"/>
    <header-session-links v-show="!this.$store.state.user.loggedIn"/>
    <header-user-logged-in-items v-show="this.$store.state.user.loggedIn"/>
  </header>
</template>

<script>
import DefaultHeaderNav from '../molecules/DefaultHeaderNav'
import EditHeaderNav from '../molecules/EditHeaderNav'
import HeaderSessionLinks from '../atoms/HeaderSessionLinks'
import HeaderUserLoggedInItems from '../atoms/HeaderUserLoggedInItems'

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
    EditHeaderNav,
    HeaderSessionLinks,
    HeaderUserLoggedInItems
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
  z-index: 1;
}

.area-logo {
  grid-area: logo;
}
</style>
