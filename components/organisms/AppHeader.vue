<template>
  <header class="area-app-header-container">
    <nuxt-link to="/" class="area-logo"/>
    <default-header-nav v-if="showDefaultHeaderNav"/>
    <edit-header-nav v-if="showEditHeaderNav" :showPostStoryLink="showPostStoryLink"/>
    <header-session-links v-if="!this.$store.state.user.loggedIn"/>
    <header-user-logged-in-items v-if="this.$store.state.user.loggedIn"/>
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

.logo-white {
  .area-logo {
    background: url('~assets/images/pc/common/header_logo_white.png') no-repeat;
    background-size: contain;
    margin: 30px;
  }
}

@media screen and (max-width: 920px) {
  .story-container {
    .area-app-header-container {
      background: white;
      grid-gap: 13px;
      /* prettier-ignore */
      grid-template-areas:
      '... ...  ... ...     ...'
      '... logo ... session ...'
      '... nav  ... ...     ...';
      grid-template-columns: 0 min-content 1fr 160px 3px;
      grid-template-rows: 12px 20px 18px;
    }
  }
}

@media screen and (max-width: 550px) {
  .area-app-header-container {
    background: white;
    grid-gap: 13px;
    /* prettier-ignore */
    grid-template-areas:
      '... ...  ... ...     ...'
      '... logo ... session ...'
      '... nav  ... ...     ...';
    grid-template-columns: 0 min-content 1fr 160px 3px;
    grid-template-rows: 12px 20px 18px;
  }

  .logo-white {
    .area-logo {
      background: url('~assets/images/sp/common/header_logo.png') no-repeat;
      background-size: contain;
      margin: 0;
    }
  }
}
</style>
